import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson, toJson } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const now = new Date().toISOString();

    const db = getDb();

    let results = db
      .prepare(
        `SELECT * FROM announcements
         WHERE publishedAt <= ?
           AND (expiresAt IS NULL OR expiresAt >= ?)
         ORDER BY priority DESC, publishedAt DESC
         LIMIT 50`
      )
      .all(now, now) as any[];

    // Parse JSON fields
    results = results.map(a => ({
      ...a,
      targetRoles: parseJson(a.targetRoles, []),
      attachments: parseJson(a.attachments, []),
    }));

    // Filter by role in JS after parsing
    if (role) {
      results = results.filter(
        a => a.targetRoles.includes(role) || a.targetRoles.length === 0
      );
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    const publishedAt = body.publishedAt
      ? new Date(body.publishedAt).toISOString()
      : new Date().toISOString();
    const expiresAt = body.expiresAt ? new Date(body.expiresAt).toISOString() : null;
    const targetRoles = toJson(body.targetRoles ?? []);
    const attachments = toJson(body.attachments ?? []);

    const result = db
      .prepare(
        `INSERT INTO announcements
           (title, titleAr, content, contentAr, authorId, targetRoles, priority, publishedAt, expiresAt, attachments)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        body.title ?? null,
        body.titleAr ?? null,
        body.content ?? null,
        body.contentAr ?? null,
        body.authorId ?? null,
        targetRoles,
        body.priority ?? 0,
        publishedAt,
        expiresAt,
        attachments
      );

    const created = db
      .prepare('SELECT * FROM announcements WHERE id = ?')
      .get(result.lastInsertRowid) as any;

    return NextResponse.json(
      {
        ...created,
        targetRoles: parseJson(created.targetRoles, []),
        attachments: parseJson(created.attachments, []),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}
