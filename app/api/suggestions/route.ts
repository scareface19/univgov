import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson, toJson } from '@/lib/db';

// GET - Liste des suggestions avec filtres
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const db = getDb();

    let query = 'SELECT * FROM suggestions WHERE 1=1';
    const params: (string | number)[] = [];

    if (status) {
      query += ' AND status=?';
      params.push(status);
    }
    if (category) {
      query += ' AND category=?';
      params.push(category);
    }
    query += ' ORDER BY votes DESC, createdAt DESC';

    const suggestions = (db.prepare(query).all(...params) as any[]).map(s => ({
      ...s,
      voters: parseJson(s.voters, []),
    }));

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}

// POST - Créer une nouvelle suggestion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, titleAr, description, category, authorId, authorName } = body;

    if (!title || !description || !authorId || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    const result = db
      .prepare(
        'INSERT INTO suggestions (title, titleAr, description, category, authorId, authorName, status, votes, voters, impact, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        title,
        titleAr || title,
        description,
        category,
        parseInt(authorId),
        authorName || 'Utilisateur',
        'recue',
        0,
        '[]',
        'medium',
        now,
        now
      );

    const suggestion = db
      .prepare('SELECT * FROM suggestions WHERE id=?')
      .get(result.lastInsertRowid) as any;

    // Award points to user for suggestion
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gamification/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: authorId, action: 'suggestion', points: 10 }),
      });
    } catch (err) {
      console.error('Error awarding points:', err);
    }

    return NextResponse.json(
      { success: true, suggestion: { ...suggestion, voters: parseJson(suggestion.voters, []) } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating suggestion:', error);
    return NextResponse.json({ error: 'Failed to create suggestion' }, { status: 500 });
  }
}

// PUT - Mettre à jour une suggestion (vote, statut, impact)
export async function PUT(request: NextRequest) {
  try {
    const suggestionId = request.nextUrl.searchParams.get('suggestionId');
    const body = await request.json();
    const { action, userId, status } = body;

    if (!suggestionId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();
    const id = parseInt(suggestionId);

    if (action === 'vote' && userId) {
      const row = db
        .prepare('SELECT voters FROM suggestions WHERE id=?')
        .get(id) as any;

      if (!row) {
        return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
      }

      const voters = parseJson(row.voters, []);
      if (voters.includes(userId)) {
        return NextResponse.json({ error: 'Already voted' }, { status: 400 });
      }
      voters.push(userId);

      db.prepare(
        'UPDATE suggestions SET votes=votes+1, voters=?, updatedAt=? WHERE id=?'
      ).run(toJson(voters), now, id);

      // Award points for voting
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gamification/points`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action: 'vote', points: 5 }),
        });
      } catch (err) {
        console.error('Error awarding points:', err);
      }
    } else if (action === 'updateStatus' && status) {
      db.prepare(
        'UPDATE suggestions SET status=?, updatedAt=? WHERE id=?'
      ).run(status, now, id);
    } else if (action === 'updateImpact' && body.impact) {
      db.prepare(
        'UPDATE suggestions SET impact=?, updatedAt=? WHERE id=?'
      ).run(body.impact, now, id);
    }

    const updated = db.prepare('SELECT * FROM suggestions WHERE id=?').get(id) as any;
    if (!updated) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      suggestion: { ...updated, voters: parseJson(updated.voters, []) },
    });
  } catch (error) {
    console.error('Error updating suggestion:', error);
    return NextResponse.json({ error: 'Failed to update suggestion' }, { status: 500 });
  }
}
