import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson, toJson } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const db = getDb();

    let sql = 'SELECT * FROM internships';
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (type) {
      conditions.push('type = ?');
      params.push(type);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY postedAt DESC';

    const internships = db.prepare(sql).all(...params) as Record<string, unknown>[];

    return NextResponse.json(
      internships.map((i) => ({ ...i, requirements: parseJson(i.requirements as string, []) }))
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();
    const now = new Date().toISOString();

    const result = db
      .prepare(
        `INSERT INTO internships (partnershipId, title, titleAr, description, descriptionAr, requirements, duration, positions, applicationsCount, location, type, status, postedAt, deadline)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`
      )
      .run(
        body.partnershipId ? Number(body.partnershipId) : null,
        body.title,
        body.titleAr || body.title,
        body.description,
        body.descriptionAr || body.description,
        toJson(body.requirements),
        body.duration,
        body.positions ? Number(body.positions) : null,
        body.location,
        body.type,
        body.status || 'open',
        now,
        body.deadline || null
      );

    const internship = db
      .prepare('SELECT * FROM internships WHERE id = ?')
      .get(result.lastInsertRowid) as Record<string, unknown>;

    return NextResponse.json(
      { ...internship, requirements: parseJson(internship.requirements as string, []) },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create internship' }, { status: 500 });
  }
}
