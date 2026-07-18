import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Helper function to calculate letter grade
function calculateLetterGrade(grade: number): string {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
}

// Helper function to calculate GPA
function calculateGPA(grades: any[]): number {
  if (grades.length === 0) return 0;

  const gradePoints: Record<string, number> = {
    A: 4.0,
    B: 3.0,
    C: 2.0,
    D: 1.0,
    F: 0.0,
  };

  let totalPoints = 0;
  let totalCredits = 0;

  grades.forEach((grade) => {
    const points = gradePoints[grade.letterGrade] ?? 0;
    totalPoints += points * (grade.credits || 0);
    totalCredits += grade.credits || 0;
  });

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

// GET - Récupérer les notes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');
    const semester = searchParams.get('semester');
    const summaryParam = searchParams.get('summary');

    const db = getDb();

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (studentId) {
      conditions.push('studentId = ?');
      params.push(parseInt(studentId, 10));
    }
    if (courseId) {
      conditions.push('courseId = ?');
      params.push(parseInt(courseId, 10));
    }
    if (semester) {
      conditions.push('semester = ?');
      params.push(semester);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const grades = db
      .prepare(`SELECT * FROM grades ${where} ORDER BY examDate DESC`)
      .all(...params) as any[];

    // Si summary=true, calculer le résumé complet
    if (summaryParam === 'true' && studentId) {
      const allGrades = db
        .prepare('SELECT * FROM grades WHERE studentId = ?')
        .all(parseInt(studentId, 10)) as any[];

      const totalGPA = calculateGPA(allGrades);
      const totalCredits = allGrades.reduce((sum, g) => sum + (g.credits || 0), 0);
      const earnedCredits = allGrades
        .filter((g) => g.letterGrade !== 'F')
        .reduce((sum, g) => sum + (g.credits || 0), 0);

      // Grouper par semestre en préservant academicYear et semester directement
      const semesterMap = new Map<string, { academicYear: string; semester: string; courses: any[] }>();
      allGrades.forEach((grade) => {
        const key = `${grade.academicYear}-${grade.semester}`;
        if (!semesterMap.has(key)) {
          semesterMap.set(key, {
            academicYear: grade.academicYear,
            semester: grade.semester,
            courses: [],
          });
        }
        semesterMap.get(key)!.courses.push(grade);
      });

      const semesters = Array.from(semesterMap.values())
        .map(({ academicYear, semester: sem, courses }) => ({
          semester: sem,
          academicYear,
          courses,
          semesterGPA: calculateGPA(courses),
          credits: courses.reduce((sum, g) => sum + (g.credits || 0), 0),
        }))
        .sort((a, b) => {
          if (a.academicYear !== b.academicYear) {
            return b.academicYear.localeCompare(a.academicYear);
          }
          return b.semester.localeCompare(a.semester);
        });

      const summary = {
        studentId,
        totalCredits,
        earnedCredits,
        gpa: totalGPA,
        semesters,
      };

      return NextResponse.json({ grades, summary });
    }

    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json({ error: 'Failed to fetch grades' }, { status: 500 });
  }
}

// POST - Ajouter ou modifier une note (upsert)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      courseId,
      courseCode,
      courseName,
      semester,
      academicYear,
      grade,
      credits,
      professorId,
      professorName,
      examDate,
    } = body;

    if (!studentId || !courseId || grade === undefined || grade === null || !credits) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (grade < 0 || grade > 100) {
      return NextResponse.json(
        { error: 'Grade must be between 0 and 100' },
        { status: 400 },
      );
    }

    const db = getDb();

    const studentIdInt = parseInt(studentId, 10);
    const courseIdInt = parseInt(courseId, 10);
    const letterGrade = calculateLetterGrade(grade);
    const now = new Date().toISOString();
    const resolvedSemester = semester || 'S1';
    const resolvedAcademicYear =
      academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
    const resolvedExamDate = examDate ? new Date(examDate).toISOString() : now;

    const existing = db
      .prepare('SELECT id, createdAt FROM grades WHERE studentId = ? AND courseId = ? AND semester = ?')
      .get(studentIdInt, courseIdInt, resolvedSemester) as any;

    if (existing) {
      // Mettre à jour la note existante
      db.prepare(`
        UPDATE grades
        SET courseCode=?, courseName=?, academicYear=?, grade=?, letterGrade=?,
            credits=?, professorId=?, professorName=?, examDate=?, updatedAt=?
        WHERE id=?
      `).run(
        courseCode || '',
        courseName || '',
        resolvedAcademicYear,
        grade,
        letterGrade,
        credits,
        professorId ? parseInt(professorId, 10) : null,
        professorName || 'Prof',
        resolvedExamDate,
        now,
        existing.id,
      );

      const updated = db.prepare('SELECT * FROM grades WHERE id = ?').get(existing.id) as any;
      return NextResponse.json({ success: true, grade: updated });
    } else {
      // Créer une nouvelle note
      db.prepare(`
        INSERT INTO grades
          (studentId, courseId, courseCode, courseName, semester, academicYear,
           grade, letterGrade, credits, professorId, professorName, examDate,
           createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        studentIdInt,
        courseIdInt,
        courseCode || '',
        courseName || '',
        resolvedSemester,
        resolvedAcademicYear,
        grade,
        letterGrade,
        credits,
        professorId ? parseInt(professorId, 10) : null,
        professorName || 'Prof',
        resolvedExamDate,
        now,
        now,
      );

      // Mettre à jour l'enrollment avec la note
      db.prepare(`
        UPDATE enrollments
        SET grade=?, status=?, updatedAt=?
        WHERE studentId=? AND courseId=?
      `).run(
        grade,
        grade >= 10 ? 'completed' : 'failed',
        now,
        studentIdInt,
        courseIdInt,
      );

      const created = db
        .prepare('SELECT * FROM grades WHERE studentId=? AND courseId=? AND semester=?')
        .get(studentIdInt, courseIdInt, resolvedSemester) as any;

      return NextResponse.json({ success: true, grade: created }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating grade:', error);
    return NextResponse.json({ error: 'Failed to create/update grade' }, { status: 500 });
  }
}
