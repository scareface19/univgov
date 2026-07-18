import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson, toJson } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const faculty = searchParams.get('faculty');
    const semester = searchParams.get('semester');

    const db = getDb();
    const conditions: string[] = [];
    const params: any[] = [];

    if (faculty) {
      conditions.push('faculty = ?');
      params.push(faculty);
    }
    if (semester) {
      conditions.push('semester = ?');
      params.push(semester);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const rows = db.prepare(`SELECT * FROM courses ${where}`).all(...params) as any[];

    const courses = rows.map((row) => ({
      ...row,
      schedule: parseJson(row.schedule, null),
      prerequisites: parseJson(row.prerequisites, []),
    }));

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      courseCode,
      courseName,
      courseNameAr,
      credits,
      faculty,
      department,
      semester,
      professorId,
      capacity,
      schedule,
      description,
      prerequisites,
    } = body;

    const db = getDb();
    const now = new Date().toISOString();

    const result = db
      .prepare(
        `INSERT INTO courses
          (courseCode, courseName, courseNameAr, credits, faculty, department, semester,
           professorId, capacity, enrolled, schedule, description, prerequisites, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`
      )
      .run(
        courseCode,
        courseName,
        courseNameAr ?? null,
        credits ?? null,
        faculty ?? null,
        department ?? null,
        semester ?? null,
        professorId ?? null,
        capacity ?? null,
        toJson(schedule),
        description ?? null,
        toJson(prerequisites),
        now
      );

    const created = db
      .prepare('SELECT * FROM courses WHERE id = ?')
      .get(result.lastInsertRowid) as any;

    return NextResponse.json(
      {
        success: true,
        course: {
          ...created,
          schedule: parseJson(created.schedule, null),
          prerequisites: parseJson(created.prerequisites, []),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
