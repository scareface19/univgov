import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Internship } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const db = await getDb();
    const query: any = {};
    if (status) query.status = status;
    if (type) query.type = type;
    
    const internships = await db
      .collection<Internship>(Collections.INTERNSHIPS)
      .find(query)
      .sort({ postedAt: -1 })
      .toArray();

    return NextResponse.json(internships);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch internships' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    const newInternship: Internship = {
      ...body,
      applicationsCount: 0,
      postedAt: new Date(),
    };

    const result = await db
      .collection<Internship>(Collections.INTERNSHIPS)
      .insertOne(newInternship);

    return NextResponse.json(
      { id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create internship' },
      { status: 500 }
    );
  }
}
