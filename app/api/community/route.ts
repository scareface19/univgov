import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { CommunityPost } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');

    const db = await getDb();
    const query: any = {};
    if (type) query.type = type;
    if (tag) query.tags = tag;
    
    const posts = await db
      .collection<CommunityPost>(Collections.COMMUNITY_POSTS)
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    const newPost: CommunityPost = {
      ...body,
      likes: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection<CommunityPost>(Collections.COMMUNITY_POSTS)
      .insertOne(newPost);

    return NextResponse.json(
      { id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
