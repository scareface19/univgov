import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { ForumPost } from '@/lib/types';
import { ObjectId } from 'mongodb';

// GET - Récupérer les posts d'un forum
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forumId = searchParams.get('forumId');
    const postId = searchParams.get('postId'); // Pour récupérer un post spécifique avec ses réponses

    if (!forumId) {
      return NextResponse.json(
        { error: 'forumId is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    if (postId) {
      // Récupérer un post spécifique avec ses réponses
      const post = await db
        .collection<ForumPost>(Collections.FORUM_POSTS)
        .findOne({ _id: new ObjectId(postId), forumId });

      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }

      // Récupérer les réponses (posts avec ce postId comme parent)
      const replies = await db
        .collection<ForumPost>(Collections.FORUM_POSTS)
        .find({ forumId, parentPostId: postId })
        .sort({ createdAt: 1 })
        .toArray();

      return NextResponse.json({ ...post, replies });
    }

    // Récupérer tous les posts principaux du forum (sans parent)
    const posts = await db
      .collection<ForumPost>(Collections.FORUM_POSTS)
      .find({ forumId, parentPostId: { $exists: false } })
      .sort({ createdAt: -1 })
      .toArray();

    // Pour chaque post, récupérer le nombre de réponses
    const postsWithReplies = await Promise.all(
      posts.map(async (post) => {
        const repliesCount = await db
          .collection(Collections.FORUM_POSTS)
          .countDocuments({ forumId, parentPostId: post._id!.toString() });

        return {
          ...post,
          repliesCount,
        };
      })
    );

    return NextResponse.json(postsWithReplies);
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forum posts' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau post ou une réponse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { forumId, authorId, authorName, content, contentAr, parentPostId } = body;

    if (!forumId || !authorId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Vérifier que le forum existe
    const forum = await db
      .collection(Collections.FORUMS)
      .findOne({ _id: new ObjectId(forumId) });

    if (!forum) {
      return NextResponse.json(
        { error: 'Forum not found' },
        { status: 404 }
      );
    }

    const newPost: ForumPost & { parentPostId?: string } = {
      forumId,
      authorId,
      authorName: authorName || 'Utilisateur',
      content,
      contentAr: contentAr || content,
      likes: 0,
      likedBy: [],
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (parentPostId) {
      newPost.parentPostId = parentPostId;
    }

    const result = await db
      .collection<ForumPost>(Collections.FORUM_POSTS)
      .insertOne(newPost as ForumPost);

    // Mettre à jour le forum (lastActivity, postsCount, participants)
    await db
      .collection(Collections.FORUMS)
      .updateOne(
        { _id: new ObjectId(forumId) },
        {
          $set: { lastActivity: new Date() },
          $inc: { postsCount: 1 },
          $addToSet: { participants: authorId },
        }
      );

    // Award points
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gamification/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authorId,
          action: 'forum_post',
          points: parentPostId ? 10 : 15, // Moins de points pour les réponses
        }),
      });
    } catch (error) {
      console.error('Error awarding points:', error);
    }

    return NextResponse.json(
      { success: true, post: { ...newPost, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json(
      { error: 'Failed to create forum post' },
      { status: 500 }
    );
  }
}

// PUT - Like/Unlike un post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, userId, action } = body; // action: 'like' | 'unlike'

    if (!postId || !userId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const post = await db
      .collection<ForumPost>(Collections.FORUM_POSTS)
      .findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    if (action === 'like') {
      if (post.likedBy?.includes(userId)) {
        return NextResponse.json(
          { error: 'Already liked' },
          { status: 400 }
        );
      }

      await db
        .collection(Collections.FORUM_POSTS)
        .updateOne(
          { _id: new ObjectId(postId) },
          {
            $inc: { likes: 1 },
            $push: { likedBy: userId },
          }
        );
    } else if (action === 'unlike') {
      await db
        .collection(Collections.FORUM_POSTS)
        .updateOne(
          { _id: new ObjectId(postId) },
          {
            $inc: { likes: -1 },
            $pull: { likedBy: userId },
          }
        );
    }

    const updated = await db
      .collection<ForumPost>(Collections.FORUM_POSTS)
      .findOne({ _id: new ObjectId(postId) });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error('Error updating forum post:', error);
    return NextResponse.json(
      { error: 'Failed to update forum post' },
      { status: 500 }
    );
  }
}

