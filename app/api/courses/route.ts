import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Course } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const faculty = searchParams.get('faculty');
    const semester = searchParams.get('semester');

    const db = await getDb();
    const query: any = {};
    if (faculty) query.faculty = faculty;
    if (semester) query.semester = semester;
    
    const courses = await db
      .collection<Course>(Collections.COURSES)
      .find(query)
      .toArray();

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    const newCourse: Course = {
      ...body,
      enrolled: 0,
      createdAt: new Date(),
    };

    const result = await db
      .collection<Course>(Collections.COURSES)
      .insertOne(newCourse);

    return NextResponse.json(
      { id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
