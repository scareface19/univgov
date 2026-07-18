import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson, toJson } from '@/lib/db';

// GET - Liste des forums avec filtres
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const db = getDb();

    let sql = 'SELECT * FROM forums';
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (search) {
      conditions.push('(title LIKE ? OR titleAr LIKE ? OR description LIKE ?)');
      const likeVal = `%${search}%`;
      params.push(likeVal, likeVal, likeVal);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY lastActivity DESC';

    const forums = db.prepare(sql).all(...params) as Record<string, unknown>[];

    const forumsWithStats = forums.map((forum) => {
      const postsCountRow = db
        .prepare('SELECT COUNT(*) as c FROM forum_posts WHERE forumId = ?')
        .get(forum.id) as { c: number };

      const authorRows = db
        .prepare('SELECT authorId FROM forum_posts WHERE forumId = ?')
        .all(forum.id) as { authorId: number }[];
      const uniqueAuthorIds = new Set(authorRows.map((r) => r.authorId));

      return {
        ...forum,
        participants: parseJson(forum.participants as string, []),
        postsCount: postsCountRow.c,
        membersCount: uniqueAuthorIds.size,
      };
    });

    return NextResponse.json({ success: true, forums: forumsWithStats });
  } catch (error) {
    console.error('Error fetching forums:', error);
    return NextResponse.json({ error: 'Failed to fetch forums' }, { status: 500 });
  }
}

// POST - Créer un nouveau forum
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, titleAr, description, category, authorId, authorName } = body;

    if (!title || !description || !category || !authorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    const result = db
      .prepare(
        `INSERT INTO forums (title, titleAr, description, category, authorId, authorName, participants, postsCount, lastActivity, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
      )
      .run(
        title,
        titleAr || title,
        description,
        category,
        authorId,
        authorName || 'Utilisateur',
        toJson([authorId]),
        now,
        now
      );

    const forum = db
      .prepare('SELECT * FROM forums WHERE id = ?')
      .get(result.lastInsertRowid) as Record<string, unknown>;

    // Award points for creating forum
    try {
      await fetch(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gamification/points`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: authorId, action: 'forum_post', points: 15 }),
        }
      );
    } catch (error) {
      console.error('Error awarding points:', error);
    }

    return NextResponse.json(
      {
        success: true,
        forum: { ...forum, participants: parseJson(forum.participants as string, []) },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating forum:', error);
    return NextResponse.json({ error: 'Failed to create forum' }, { status: 500 });
  }
}
