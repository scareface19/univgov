import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson, toJson } from '@/lib/db';

// GET - Récupérer les posts d'un forum
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forumId = searchParams.get('forumId');
    const postId = searchParams.get('postId');

    if (!forumId) {
      return NextResponse.json({ error: 'forumId is required' }, { status: 400 });
    }

    const db = getDb();

    if (postId) {
      // Récupérer un post spécifique avec ses réponses
      const post = db
        .prepare('SELECT * FROM forum_posts WHERE id = ? AND forumId = ?')
        .get(Number(postId), Number(forumId)) as Record<string, unknown> | undefined;

      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      const replies = db
        .prepare(
          'SELECT * FROM forum_posts WHERE forumId = ? AND parentPostId = ? ORDER BY createdAt ASC'
        )
        .all(Number(forumId), Number(postId)) as Record<string, unknown>[];

      return NextResponse.json({
        post: { ...post, likedBy: parseJson(post.likedBy as string, []) },
        replies: replies.map((r) => ({ ...r, likedBy: parseJson(r.likedBy as string, []) })),
      });
    }

    // Récupérer tous les posts principaux du forum (sans parent)
    const posts = db
      .prepare(
        'SELECT * FROM forum_posts WHERE forumId = ? AND parentPostId IS NULL ORDER BY createdAt DESC'
      )
      .all(Number(forumId)) as Record<string, unknown>[];

    const postsWithReplies = posts.map((post) => {
      const repliesCountRow = db
        .prepare('SELECT COUNT(*) as c FROM forum_posts WHERE parentPostId = ?')
        .get(post.id) as { c: number };

      return {
        ...post,
        likedBy: parseJson(post.likedBy as string, []),
        repliesCount: repliesCountRow.c,
      };
    });

    return NextResponse.json({ success: true, posts: postsWithReplies });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json({ error: 'Failed to fetch forum posts' }, { status: 500 });
  }
}

// POST - Créer un nouveau post ou une réponse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { forumId, authorId, authorName, content, contentAr, parentPostId } = body;

    if (!forumId || !authorId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();

    // Vérifier que le forum existe
    const forum = db
      .prepare('SELECT id FROM forums WHERE id = ?')
      .get(Number(forumId)) as Record<string, unknown> | undefined;

    if (!forum) {
      return NextResponse.json({ error: 'Forum not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    const result = db
      .prepare(
        `INSERT INTO forum_posts (forumId, authorId, authorName, content, contentAr, likes, likedBy, replies, parentPostId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, 0, '[]', '[]', ?, ?, ?)`
      )
      .run(
        Number(forumId),
        authorId,
        authorName || 'Utilisateur',
        content,
        contentAr || content,
        parentPostId ? Number(parentPostId) : null,
        now,
        now
      );

    // Mettre à jour le forum (lastActivity, postsCount, participants)
    const forumRow = db
      .prepare('SELECT participants FROM forums WHERE id = ?')
      .get(Number(forumId)) as { participants: string };

    const participants: unknown[] = parseJson(forumRow.participants, []);
    if (!participants.includes(authorId)) {
      participants.push(authorId);
    }

    db.prepare(
      'UPDATE forums SET postsCount = postsCount + 1, lastActivity = ?, participants = ? WHERE id = ?'
    ).run(now, toJson(participants), Number(forumId));

    // Award points
    try {
      await fetch(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gamification/points`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: authorId,
            action: 'forum_post',
            points: parentPostId ? 10 : 15,
          }),
        }
      );
    } catch (error) {
      console.error('Error awarding points:', error);
    }

    const post = db
      .prepare('SELECT * FROM forum_posts WHERE id = ?')
      .get(result.lastInsertRowid) as Record<string, unknown>;

    return NextResponse.json(
      { success: true, post: { ...post, likedBy: parseJson(post.likedBy as string, []) } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json({ error: 'Failed to create forum post' }, { status: 500 });
  }
}

// PUT - Like/Unlike un post
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');
    const body = await request.json();
    const { userId, action } = body;

    if (!postId || !userId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    if (action === 'like') {
      const row = db
        .prepare('SELECT likedBy FROM forum_posts WHERE id = ?')
        .get(Number(postId)) as { likedBy: string } | undefined;

      if (!row) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      const likedBy: unknown[] = parseJson(row.likedBy, []);
      if (!likedBy.includes(userId)) {
        likedBy.push(userId);
      }

      db.prepare(
        'UPDATE forum_posts SET likes = likes + 1, likedBy = ?, updatedAt = ? WHERE id = ?'
      ).run(toJson(likedBy), now, Number(postId));
    } else if (action === 'unlike') {
      const row = db
        .prepare('SELECT likedBy FROM forum_posts WHERE id = ?')
        .get(Number(postId)) as { likedBy: string } | undefined;

      if (!row) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      const likedBy = parseJson(row.likedBy, []).filter((id: unknown) => id !== userId);

      db.prepare(
        'UPDATE forum_posts SET likes = MAX(0, likes - 1), likedBy = ?, updatedAt = ? WHERE id = ?'
      ).run(toJson(likedBy), now, Number(postId));
    }

    const updated = db
      .prepare('SELECT * FROM forum_posts WHERE id = ?')
      .get(Number(postId)) as Record<string, unknown>;

    return NextResponse.json({
      success: true,
      post: { ...updated, likedBy: parseJson(updated.likedBy as string, []) },
    });
  } catch (error) {
    console.error('Error updating forum post:', error);
    return NextResponse.json({ error: 'Failed to update forum post' }, { status: 500 });
  }
}
