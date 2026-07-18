import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson, toJson } from '@/lib/db';

// GET - Liste des votes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const db = getDb();

    let query = 'SELECT * FROM votes WHERE 1=1';
    const params: (string | number)[] = [];

    if (status) {
      query += ' AND status=?';
      params.push(status);
      if (status === 'active') {
        query += ' AND deadline >= ?';
        params.push(new Date().toISOString());
      }
    }
    if (category) {
      query += ' AND category=?';
      params.push(category);
    }
    query += ' ORDER BY createdAt DESC';

    const votes = (db.prepare(query).all(...params) as any[]).map(v => ({
      ...v,
      options: parseJson(v.options, []),
    }));

    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}

// POST - Créer un vote ou voter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, voteId, optionId, userId, ...voteData } = body;

    const db = getDb();

    // Si action = 'vote', enregistrer le vote
    if (action === 'vote' && voteId && optionId && userId) {
      // Vérifier si l'utilisateur a déjà voté
      const existing = db
        .prepare('SELECT id FROM vote_records WHERE voteId=? AND userId=?')
        .get(parseInt(voteId), parseInt(userId)) as any;

      if (existing) {
        return NextResponse.json({ error: 'Vous avez déjà voté' }, { status: 409 });
      }

      // Vérifier que le vote est actif et pas expiré
      const vote = db
        .prepare('SELECT options, status, deadline FROM votes WHERE id=?')
        .get(parseInt(voteId)) as any;

      if (!vote) {
        return NextResponse.json({ error: 'Vote not found' }, { status: 404 });
      }

      if (vote.status !== 'active' || new Date(vote.deadline) < new Date()) {
        return NextResponse.json({ error: "Ce vote n'est plus actif" }, { status: 400 });
      }

      // Mettre à jour les compteurs dans options JSON
      const options = parseJson(vote.options, []);
      const option = options.find((opt: any) => opt.id === optionId);
      if (option) {
        option.votes = (option.votes || 0) + 1;
      }

      db.prepare('UPDATE votes SET options=?, totalVotes=totalVotes+1 WHERE id=?').run(
        toJson(options),
        parseInt(voteId)
      );

      // Enregistrer le vote
      const now = new Date().toISOString();
      db.prepare(
        'INSERT INTO vote_records (voteId, userId, optionId, createdAt) VALUES (?, ?, ?, ?)'
      ).run(parseInt(voteId), parseInt(userId), optionId, now);

      // Award points
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gamification/points`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action: 'vote', points: 5 }),
        });
      } catch (err) {
        console.error('Error awarding points:', err);
      }

      return NextResponse.json({
        success: true,
        message: 'Vote enregistré avec succès',
        pointsAwarded: 5,
      });
    }

    // Sinon, créer un nouveau vote (admin only)
    const now = new Date().toISOString();
    const result = db
      .prepare(
        'INSERT INTO votes (title, titleAr, description, options, totalVotes, deadline, status, category, createdAt, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        voteData.title,
        voteData.titleAr || voteData.title,
        voteData.description,
        toJson(voteData.options || []),
        0,
        voteData.deadline,
        'active',
        voteData.category || 'general',
        now,
        voteData.createdBy ? parseInt(voteData.createdBy) : (userId ? parseInt(userId) : null)
      );

    const newVote = db
      .prepare('SELECT * FROM votes WHERE id=?')
      .get(result.lastInsertRowid) as any;

    return NextResponse.json(
      { success: true, vote: { ...newVote, options: parseJson(newVote.options, []) } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 });
  }
}
