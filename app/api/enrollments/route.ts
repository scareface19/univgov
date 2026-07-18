import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');

    const db = getDb();
    const conditions: string[] = [];
    const params: any[] = [];

    if (studentId) {
      conditions.push('studentId = ?');
      params.push(Number(studentId));
    }
    if (courseId) {
      conditions.push('courseId = ?');
      params.push(Number(courseId));
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const enrollments = db
      .prepare(`SELECT * FROM enrollments ${where}`)
      .all(...params) as any[];

    return NextResponse.json({ success: true, enrollments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, courseId } = body;

    const db = getDb();

    // Check for duplicate enrollment
    const existing = db
      .prepare('SELECT id FROM enrollments WHERE studentId = ? AND courseId = ?')
      .get(Number(studentId), Number(courseId));

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Already enrolled' },
        { status: 409 }
      );
    }

    // Check course existence and capacity
    const course = db
      .prepare('SELECT capacity, enrolled FROM courses WHERE id = ?')
      .get(Number(courseId)) as { capacity: number; enrolled: number } | undefined;

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    if (course.enrolled >= course.capacity) {
      return NextResponse.json(
        { success: false, error: 'Course is full' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Insert enrollment
    const result = db
      .prepare(
        `INSERT INTO enrollments (studentId, courseId, enrollmentDate, status, attendance)
         VALUES (?, ?, ?, 'enrolled', 0)`
      )
      .run(Number(studentId), Number(courseId), now);

    // Increment course enrolled count
    db.prepare('UPDATE courses SET enrolled = enrolled + 1 WHERE id = ?').run(
      Number(courseId)
    );

    const enrollment = db
      .prepare('SELECT * FROM enrollments WHERE id = ?')
      .get(result.lastInsertRowid) as any;

    return NextResponse.json({ success: true, enrollment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create enrollment' },
      { status: 500 }
    );
  }
}
