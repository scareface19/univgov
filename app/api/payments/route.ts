import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Payment } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const db = await getDb();
    const query: any = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;
    
    const payments = await db
      .collection<Payment>(Collections.PAYMENTS)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    const newPayment: Payment = {
      ...body,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await db
      .collection<Payment>(Collections.PAYMENTS)
      .insertOne(newPayment);

    return NextResponse.json(
      { id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
