import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Partnership } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const sector = searchParams.get('sector');

    const db = await getDb();
    const query: any = {};
    if (status) query.status = status;
    if (sector) query.sector = sector;
    
    const partnerships = await db
      .collection<Partnership>(Collections.PARTNERSHIPS)
      .find(query)
      .sort({ startDate: -1 })
      .toArray();

    return NextResponse.json(partnerships);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch partnerships' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    const newPartnership: Partnership = {
      ...body,
      opportunitiesCount: 0,
      startDate: new Date(body.startDate),
    };

    const result = await db
      .collection<Partnership>(Collections.PARTNERSHIPS)
      .insertOne(newPartnership);

    return NextResponse.json(
      { id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create partnership' },
      { status: 500 }
    );
  }
}
