import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const staffId = searchParams.get('staffId');
    const status = searchParams.get('status');

    const db = getDb();

    const conditions: string[] = [];
    const params: any[] = [];

    if (studentId) {
      conditions.push('studentId = ?');
      params.push(Number(studentId));
    }
    if (staffId) {
      conditions.push('staffId = ?');
      params.push(Number(staffId));
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM appointments ${where} ORDER BY date ASC, time ASC`;

    const appointments = db.prepare(sql).all(...params) as any[];

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    const createdAt = new Date().toISOString();

    const result = db
      .prepare(
        `INSERT INTO appointments (studentId, staffId, type, date, time, notes, status, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        body.studentId ?? null,
        body.staffId ?? null,
        body.type ?? null,
        body.date ?? null,
        body.time ?? null,
        body.notes ?? null,
        'pending',
        createdAt
      );

    const created = db
      .prepare('SELECT * FROM appointments WHERE id = ?')
      .get(result.lastInsertRowid) as any;

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
