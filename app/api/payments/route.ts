import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const db = getDb();

    let query = 'SELECT * FROM payments WHERE 1=1';
    const params: (string | number)[] = [];

    if (userId) {
      query += ' AND userId=?';
      params.push(parseInt(userId));
    }
    if (status) {
      query += ' AND status=?';
      params.push(status);
    }
    query += ' ORDER BY createdAt DESC';

    const payments = db.prepare(query).all(...params) as any[];
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    const now = new Date().toISOString();
    const result = db
      .prepare(
        'INSERT INTO payments (userId, amount, type, status, paymentMethod, transactionId, description, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        body.userId ? parseInt(body.userId) : null,
        body.amount ?? null,
        body.type ?? null,
        'pending',
        body.paymentMethod ?? null,
        body.transactionId ?? null,
        body.description ?? null,
        now
      );

    const payment = db
      .prepare('SELECT * FROM payments WHERE id=?')
      .get(result.lastInsertRowid) as any;

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
