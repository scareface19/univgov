import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Announcement } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');

    const db = await getDb();
    const query: any = {
      publishedAt: { $lte: new Date() },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gte: new Date() } }
      ]
    };
    
    if (role) {
      query.targetRoles = role;
    }
    
    const announcements = await db
      .collection<Announcement>(Collections.ANNOUNCEMENTS)
      .find(query)
      .sort({ priority: -1, publishedAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(announcements);
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
    const db = await getDb();
    
    const newAnnouncement: Announcement = {
      ...body,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    };

    const result = await db
      .collection<Announcement>(Collections.ANNOUNCEMENTS)
      .insertOne(newAnnouncement);

    return NextResponse.json(
      { id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}
