import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Mock data - in production, fetch from database
    const userPoints = {
      userId,
      total: 2450,
      level: 8,
      rank: 12,
      badges: ['innovateur', 'ambassadeur', 'contributeur'],
      recentActivity: [
        { type: 'suggestion', points: 50, date: new Date() },
        { type: 'vote', points: 5, date: new Date() },
      ],
    };

    return NextResponse.json(userPoints);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch points' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, points } = body;

    // Award points based on action
    const pointsAwarded = points || getPointsForAction(action);

    // In production, update database
    // await db.collection('gamification_points').insertOne({...})

    return NextResponse.json({
      success: true,
      pointsAwarded,
      newTotal: 2450 + pointsAwarded,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to award points' },
      { status: 500 }
    );
  }
}

function getPointsForAction(action: string): number {
  const pointsMap: Record<string, number> = {
    suggestion: 10,
    vote: 5,
    forum_post: 15,
    volunteer: 50,
    project_completion: 100,
    help_student: 25,
    course_completion: 200,
  };

  return pointsMap[action] || 0;
}
