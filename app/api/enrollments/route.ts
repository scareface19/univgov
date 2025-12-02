import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Enrollment } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');

    const db = await getDb();
    const query: any = {};
    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    
    const enrollments = await db
      .collection<Enrollment>(Collections.ENROLLMENTS)
      .find(query)
      .toArray();

    return NextResponse.json(enrollments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, courseId } = body;

    const db = await getDb();
    
    // Check if already enrolled
    const existing = await db
      .collection<Enrollment>(Collections.ENROLLMENTS)
      .findOne({ studentId, courseId });

    if (existing) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // Check course capacity
    const course = await db
      .collection(Collections.COURSES)
      .findOne({ _id: new ObjectId(courseId) });

    if (course && course.enrolled >= course.capacity) {
      return NextResponse.json(
        { error: 'Course is full' },
        { status: 400 }
      );
    }

    // Create enrollment
    const newEnrollment: Enrollment = {
      studentId,
      courseId,
      enrollmentDate: new Date(),
      status: 'enrolled',
      attendance: 0,
    };

    const result = await db
      .collection<Enrollment>(Collections.ENROLLMENTS)
      .insertOne(newEnrollment);

    // Update course enrolled count
    await db
      .collection(Collections.COURSES)
      .updateOne(
        { _id: new ObjectId(courseId) },
        { $inc: { enrolled: 1 } }
      );

    return NextResponse.json(
      { id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create enrollment' },
      { status: 500 }
    );
  }
}
