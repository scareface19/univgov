import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson, toJson } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');

    const db = getDb();
    const conditions: string[] = [];
    const params: any[] = [];

    if (type) {
      conditions.push('type = ?');
      params.push(type);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    let rows = db
      .prepare(`SELECT * FROM community_posts ${where} ORDER BY createdAt DESC LIMIT 50`)
      .all(...params) as any[];

    // Parse JSON fields before tag filtering
    let posts = rows.map((row) => ({
      ...row,
      tags: parseJson(row.tags, []),
      attachments: parseJson(row.attachments, []),
      comments: parseJson(row.comments, []),
    }));

    // Filter by tag in JS after JSON parse
    if (tag) {
      posts = posts.filter((p) => Array.isArray(p.tags) && p.tags.includes(tag));
    }

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorId, content, contentAr, type, tags, attachments } = body;

    const db = getDb();
    const now = new Date().toISOString();

    const result = db
      .prepare(
        `INSERT INTO community_posts
          (authorId, content, contentAr, type, tags, attachments, likes, comments, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
      )
      .run(
        Number(authorId),
        content ?? null,
        contentAr ?? null,
        type ?? null,
        toJson(tags ?? []),
        toJson(attachments ?? []),
        toJson([]),
        now,
        now
      );

    const created = db
      .prepare('SELECT * FROM community_posts WHERE id = ?')
      .get(result.lastInsertRowid) as any;

    return NextResponse.json(
      {
        success: true,
        post: {
          ...created,
          tags: parseJson(created.tags, []),
          attachments: parseJson(created.attachments, []),
          comments: parseJson(created.comments, []),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
