import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Suggestion } from '@/lib/types';
import { ObjectId } from 'mongodb';

// GET - Liste des suggestions avec filtres
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'votes'; // votes, date

    const db = await getDb();
    const query: any = {};
    
    if (status) query.status = status;
    if (category) query.category = category;

    let sortQuery: any = { createdAt: -1 };
    if (sort === 'votes') {
      sortQuery = { votes: -1, createdAt: -1 };
    }

    const suggestions = await db
      .collection<Suggestion>(Collections.SUGGESTIONS)
      .find(query)
      .sort(sortQuery)
      .toArray();

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle suggestion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, titleAr, description, category, authorId, authorName } = body;

    if (!title || !description || !authorId || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    const newSuggestion: Suggestion = {
      title,
      titleAr: titleAr || title,
      description,
      category,
      authorId,
      authorName: authorName || 'Utilisateur',
      status: 'recue',
      votes: 0,
      voters: [],
      impact: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection<Suggestion>(Collections.SUGGESTIONS)
      .insertOne(newSuggestion);

    // Award points to user for suggestion
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gamification/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authorId,
          action: 'suggestion',
          points: 10,
        }),
      });
    } catch (error) {
      console.error('Error awarding points:', error);
    }

    return NextResponse.json(
      { success: true, suggestion: { ...newSuggestion, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to create suggestion' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une suggestion (vote, statut, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { suggestionId, action, userId, status } = body;

    if (!suggestionId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const suggestion = await db
      .collection<Suggestion>(Collections.SUGGESTIONS)
      .findOne({ _id: new ObjectId(suggestionId) });

    if (!suggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    let updateData: any = { updatedAt: new Date() };

    if (action === 'vote' && userId) {
      // Check if user already voted
      if (suggestion.voters?.includes(userId)) {
        return NextResponse.json(
          { error: 'Already voted' },
          { status: 400 }
        );
      }

      updateData = {
        $inc: { votes: 1 },
        $push: { voters: userId },
        updatedAt: new Date(),
      };

      // Award points for voting
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
    } else if (action === 'updateStatus' && status) {
      updateData.status = status;
    } else if (action === 'updateImpact' && body.impact) {
      updateData.impact = body.impact;
    }

    await db
      .collection<Suggestion>(Collections.SUGGESTIONS)
      .updateOne(
        { _id: new ObjectId(suggestionId) },
        { $set: updateData }
      );

    const updated = await db
      .collection<Suggestion>(Collections.SUGGESTIONS)
      .findOne({ _id: new ObjectId(suggestionId) });

    return NextResponse.json({ success: true, suggestion: updated });
  } catch (error) {
    console.error('Error updating suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to update suggestion' },
      { status: 500 }
    );
  }
}
