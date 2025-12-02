import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Forum } from '@/lib/types';
import { ObjectId } from 'mongodb';

// GET - Liste des forums avec filtres
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const db = await getDb();
    const query: any = {};
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleAr: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const forums = await db
      .collection<Forum>(Collections.FORUMS)
      .find(query)
      .sort({ lastActivity: -1 })
      .toArray();

    // Pour chaque forum, calculer le nombre réel de posts et participants uniques
    const forumsWithStats = await Promise.all(
      forums.map(async (forum) => {
        const postsCount = await db
          .collection(Collections.FORUM_POSTS)
          .countDocuments({ forumId: forum._id!.toString() });

        const uniqueParticipants = await db
          .collection(Collections.FORUM_POSTS)
          .distinct('authorId', { forumId: forum._id!.toString() });

        return {
          ...forum,
          postsCount,
          participants: uniqueParticipants.length,
        };
      })
    );

    return NextResponse.json(forumsWithStats);
  } catch (error) {
    console.error('Error fetching forums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forums' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau forum
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, titleAr, description, category, authorId, authorName } = body;

    if (!title || !description || !category || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    const newForum: Forum = {
      title,
      titleAr: titleAr || title,
      description,
      category,
      authorId,
      authorName: authorName || 'Utilisateur',
      participants: [authorId],
      postsCount: 0,
      lastActivity: new Date(),
      createdAt: new Date(),
    };

    const result = await db
      .collection<Forum>(Collections.FORUMS)
      .insertOne(newForum);

    // Award points for creating forum
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gamification/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authorId,
          action: 'forum_post',
          points: 15,
        }),
      });
    } catch (error) {
      console.error('Error awarding points:', error);
    }

    return NextResponse.json(
      { success: true, forum: { ...newForum, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating forum:', error);
    return NextResponse.json(
      { error: 'Failed to create forum' },
      { status: 500 }
    );
  }
}
