import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const sector = searchParams.get('sector');

    const db = getDb();

    let sql = 'SELECT * FROM partnerships';
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (sector) {
      conditions.push('sector = ?');
      params.push(sector);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY startDate DESC';

    const partnerships = db.prepare(sql).all(...params) as Record<string, unknown>[];

    return NextResponse.json(partnerships);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch partnerships' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    const result = db
      .prepare(
        `INSERT INTO partnerships (companyName, companyNameAr, sector, description, descriptionAr, contactPerson, email, phone, website, status, startDate, endDate, opportunitiesCount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
      )
      .run(
        body.companyName,
        body.companyNameAr || body.companyName,
        body.sector,
        body.description,
        body.descriptionAr || body.description,
        body.contactPerson,
        body.email,
        body.phone,
        body.website,
        body.status || 'active',
        body.startDate ? new Date(body.startDate).toISOString() : null,
        body.endDate || null
      );

    const partnership = db
      .prepare('SELECT * FROM partnerships WHERE id = ?')
      .get(result.lastInsertRowid) as Record<string, unknown>;

    return NextResponse.json(partnership, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create partnership' }, { status: 500 });
  }
}
