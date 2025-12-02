import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Vote, VoteRecord } from '@/lib/types';
import { ObjectId } from 'mongodb';

// GET - Liste des votes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get('active');
    const category = searchParams.get('category');

    const db = await getDb();
    const query: any = {};
    
    if (active === 'true') {
      query.status = 'active';
      query.deadline = { $gte: new Date() };
    }
    if (category) query.category = category;

    const votes = await db
      .collection<Vote>(Collections.VOTES)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}

// POST - Créer un vote ou voter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, voteId, optionId, userId, ...voteData } = body;

    const db = await getDb();

    // Si action = 'vote', enregistrer le vote
    if (action === 'vote' && voteId && optionId && userId) {
      // Vérifier si l'utilisateur a déjà voté
      const existingVote = await db
        .collection<VoteRecord>(Collections.VOTE_RECORDS)
        .findOne({ voteId, userId });

      if (existingVote) {
        return NextResponse.json(
          { error: 'Vous avez déjà voté' },
          { status: 400 }
        );
      }

      // Vérifier que le vote est actif et pas expiré
      const vote = await db
        .collection<Vote>(Collections.VOTES)
        .findOne({ _id: new ObjectId(voteId) });

      if (!vote) {
        return NextResponse.json(
          { error: 'Vote not found' },
          { status: 404 }
        );
      }

      if (vote.status !== 'active' || new Date(vote.deadline) < new Date()) {
        return NextResponse.json(
          { error: 'Ce vote n\'est plus actif' },
          { status: 400 }
        );
      }

      // Enregistrer le vote
      const voteRecord: VoteRecord = {
        voteId,
        userId,
        optionId,
        createdAt: new Date(),
      };

      await db
        .collection<VoteRecord>(Collections.VOTE_RECORDS)
        .insertOne(voteRecord);

      // Mettre à jour les compteurs
      const option = vote.options.find(opt => opt.id === optionId);
      if (option) {
        await db
          .collection<Vote>(Collections.VOTES)
          .updateOne(
            { _id: new ObjectId(voteId), 'options.id': optionId },
            {
              $inc: {
                'options.$.votes': 1,
                totalVotes: 1,
              },
            }
          );
      }

      // Award points
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gamification/points`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            action: 'vote',
            points: 5,
          }),
        });
      } catch (error) {
        console.error('Error awarding points:', error);
      }

      return NextResponse.json({
        success: true,
        message: 'Vote enregistré avec succès',
        pointsAwarded: 5,
      });
    }

    // Sinon, créer un nouveau vote (admin only)
    const newVote: Vote = {
      title: voteData.title,
      titleAr: voteData.titleAr || voteData.title,
      description: voteData.description,
      options: voteData.options || [],
      totalVotes: 0,
      deadline: new Date(voteData.deadline),
      status: 'active',
      category: voteData.category || 'general',
      createdAt: new Date(),
      createdBy: voteData.createdBy || userId,
    };

    const result = await db
      .collection<Vote>(Collections.VOTES)
      .insertOne(newVote);

    return NextResponse.json(
      { success: true, vote: { ...newVote, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}
