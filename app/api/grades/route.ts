import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Grade, StudentGradeSummary } from '@/lib/types';
import { ObjectId } from 'mongodb';

// Helper function to calculate letter grade
function calculateLetterGrade(grade: number): string {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
}

// Helper function to calculate GPA
function calculateGPA(grades: Grade[]): number {
  if (grades.length === 0) return 0;
  
  const gradePoints: Record<string, number> = {
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0,
  };

  let totalPoints = 0;
  let totalCredits = 0;

  grades.forEach(grade => {
    const points = gradePoints[grade.letterGrade] || 0;
    totalPoints += points * grade.credits;
    totalCredits += grade.credits;
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
    const summary = searchParams.get('summary'); // 'true' pour résumé complet avec GPA

    const db = await getDb();
    const query: any = {};
    
    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    if (semester) query.semester = semester;

    const grades = await db
      .collection<Grade>(Collections.GRADES)
      .find(query)
      .sort({ examDate: -1 })
      .toArray();

    // Si summary=true, calculer le résumé complet
    if (summary === 'true' && studentId) {
      // Calculer GPA total
      const allGrades = await db
        .collection<Grade>(Collections.GRADES)
        .find({ studentId })
        .toArray();

      const totalGPA = calculateGPA(allGrades);
      
      // Calculer crédits
      const totalCredits = allGrades.reduce((sum, g) => sum + g.credits, 0);
      const earnedCredits = allGrades
        .filter(g => g.letterGrade !== 'F')
        .reduce((sum, g) => sum + g.credits, 0);

      // Grouper par semestre
      const semesterMap = new Map<string, Grade[]>();
      allGrades.forEach(grade => {
        const key = `${grade.academicYear}-${grade.semester}`;
        if (!semesterMap.has(key)) {
          semesterMap.set(key, []);
        }
        semesterMap.get(key)!.push(grade);
      });

      const semesters = Array.from(semesterMap.entries()).map(([key, courses]) => {
        const [academicYear, sem] = key.split('-');
        return {
          semester: sem,
          academicYear,
          courses,
          semesterGPA: calculateGPA(courses),
          credits: courses.reduce((sum, g) => sum + g.credits, 0),
        };
      }).sort((a, b) => {
        if (a.academicYear !== b.academicYear) {
          return b.academicYear.localeCompare(a.academicYear);
        }
        return b.semester.localeCompare(a.semester);
      });

      const summary: StudentGradeSummary = {
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
    return NextResponse.json(
      { error: 'Failed to fetch grades' },
      { status: 500 }
    );
  }
}

// POST - Ajouter ou modifier une note
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

    if (!studentId || !courseId || !grade || !credits) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (grade < 0 || grade > 100) {
      return NextResponse.json(
        { error: 'Grade must be between 0 and 100' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Vérifier si la note existe déjà
    const existingGrade = await db
      .collection<Grade>(Collections.GRADES)
      .findOne({ studentId, courseId, semester });

    const letterGrade = calculateLetterGrade(grade);

    const gradeData: Grade = {
      studentId,
      courseId,
      courseCode: courseCode || '',
      courseName: courseName || '',
      semester: semester || 'S1',
      academicYear: academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      grade,
      letterGrade,
      credits,
      professorId: professorId || '',
      professorName: professorName || 'Prof',
      examDate: examDate ? new Date(examDate) : new Date(),
      createdAt: existingGrade?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (existingGrade) {
      // Mettre à jour la note existante
      await db
        .collection<Grade>(Collections.GRADES)
        .updateOne(
          { _id: existingGrade._id },
          { $set: gradeData }
        );
      
      const updated = await db
        .collection<Grade>(Collections.GRADES)
        .findOne({ _id: existingGrade._id });

      return NextResponse.json({ success: true, grade: updated });
    } else {
      // Créer une nouvelle note
      const result = await db
        .collection<Grade>(Collections.GRADES)
        .insertOne(gradeData);

      // Mettre à jour l'enrollment avec la note
      await db
        .collection(Collections.ENROLLMENTS)
        .updateOne(
          { studentId, courseId },
          {
            $set: {
              grade,
              status: grade >= 60 ? 'completed' : 'failed',
              updatedAt: new Date(),
            },
          }
        );

      return NextResponse.json(
        { success: true, grade: { ...gradeData, _id: result.insertedId } },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating/updating grade:', error);
    return NextResponse.json(
      { error: 'Failed to create/update grade' },
      { status: 500 }
    );
  }
}

// GET /gpa - Calculer uniquement le GPA
export async function GET_GPA(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const grades = await db
      .collection<Grade>(Collections.GRADES)
      .find({ studentId })
      .toArray();

    const gpa = calculateGPA(grades);
    const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
    const earnedCredits = grades
      .filter(g => g.letterGrade !== 'F')
      .reduce((sum, g) => sum + g.credits, 0);

    return NextResponse.json({
      studentId,
      gpa: Number(gpa.toFixed(2)),
      totalCredits,
      earnedCredits,
      totalCourses: grades.length,
    });
  } catch (error) {
    console.error('Error calculating GPA:', error);
    return NextResponse.json(
      { error: 'Failed to calculate GPA' },
      { status: 500 }
    );
  }
}

