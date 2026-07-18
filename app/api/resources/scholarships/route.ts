import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET - Liste des bourses avec filtres
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const studentId = searchParams.get('studentId');

    const db = getDb();

    let query = 'SELECT * FROM scholarships WHERE 1=1';
    const params: (string | number)[] = [];

    if (status) {
      query += ' AND status=?';
      params.push(status);
    }
    if (type) {
      query += ' AND type=?';
      params.push(type);
    }
    if (studentId) {
      query += ' AND studentId=?';
      params.push(parseInt(studentId));
    }
    query += ' ORDER BY createdAt DESC';

    const scholarships = db.prepare(query).all(...params) as any[];

    const summary = {
      total: scholarships.reduce((sum, s) => sum + (s.amount || 0), 0),
      disbursed: scholarships.reduce((sum, s) => sum + (s.disbursedAmount || 0), 0),
      pending: scholarships.filter(s => s.status === 'pending').length,
      active: scholarships.filter(s => s.status === 'active').length,
      recipients: scholarships.length,
    };

    return NextResponse.json({ scholarships, summary });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    return NextResponse.json({ error: 'Failed to fetch scholarships' }, { status: 500 });
  }
}

// POST - Créer une nouvelle bourse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, studentName, amount, type, semester, academicYear, criteria, startDate, endDate } = body;

    if (!studentId || !amount || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();

    const typeArMap: Record<string, string> = {
      'Excellence': 'التميز',
      'Mérite': 'الجدارة',
      'Sociale': 'اجتماعية',
    };

    const now = new Date().toISOString();
    const currentYear = new Date().getFullYear();

    const result = db
      .prepare(
        'INSERT INTO scholarships (studentId, studentName, amount, type, typeAr, status, semester, academicYear, criteria, disbursedAmount, startDate, endDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        parseInt(studentId),
        studentName || 'Étudiant',
        Number(amount),
        type,
        typeArMap[type] || type,
        'pending',
        semester || 'S1',
        academicYear || `${currentYear}-${currentYear + 1}`,
        criteria ? JSON.stringify(criteria) : '{}',
        0,
        startDate || now,
        endDate || now,
        now,
        now
      );

    const scholarship = db
      .prepare('SELECT * FROM scholarships WHERE id=?')
      .get(result.lastInsertRowid) as any;

    return NextResponse.json({ success: true, scholarship }, { status: 201 });
  } catch (error) {
    console.error('Error creating scholarship:', error);
    return NextResponse.json({ error: 'Failed to create scholarship' }, { status: 500 });
  }
}

// PUT - Mettre à jour une bourse
export async function PUT(request: NextRequest) {
  try {
    const scholarshipId = request.nextUrl.searchParams.get('scholarshipId');
    const body = await request.json();
    const { status, disbursedAmount } = body;

    if (!scholarshipId) {
      return NextResponse.json({ error: 'scholarshipId is required' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();
    const id = parseInt(scholarshipId);

    const setClauses: string[] = ['updatedAt=?'];
    const params: (string | number)[] = [now];

    if (status) {
      setClauses.push('status=?');
      params.push(status);
    }
    if (disbursedAmount !== undefined) {
      setClauses.push('disbursedAmount=?');
      params.push(disbursedAmount);
    }
    params.push(id);

    db.prepare(`UPDATE scholarships SET ${setClauses.join(', ')} WHERE id=?`).run(...params);

    const updated = db.prepare('SELECT * FROM scholarships WHERE id=?').get(id) as any;
    return NextResponse.json({ success: true, scholarship: updated });
  } catch (error) {
    console.error('Error updating scholarship:', error);
    return NextResponse.json({ error: 'Failed to update scholarship' }, { status: 500 });
  }
}
