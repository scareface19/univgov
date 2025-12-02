import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Scholarship } from '@/lib/types';
import { ObjectId } from 'mongodb';

// GET - Liste des bourses avec filtres
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const studentId = searchParams.get('studentId');

    const db = await getDb();
    const query: any = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (studentId) query.studentId = studentId;

    const scholarships = await db
      .collection<Scholarship>(Collections.SCHOLARSHIPS)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Calculer le résumé
    const summary = {
      total: scholarships.reduce((sum, s) => sum + s.amount, 0),
      disbursed: scholarships.reduce((sum, s) => sum + (s.disbursedAmount || 0), 0),
      pending: scholarships.filter(s => s.status === 'pending').length,
      active: scholarships.filter(s => s.status === 'active').length,
      recipients: scholarships.length,
    };

    return NextResponse.json({ scholarships, summary });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scholarships' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle bourse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentName,
      amount,
      type,
      semester,
      academicYear,
      criteria,
      startDate,
      endDate,
    } = body;

    if (!studentId || !amount || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const typeArMap: Record<string, string> = {
      'Excellence': 'التميز',
      'Mérite': 'الجدارة',
      'Sociale': 'اجتماعية',
    };

    const newScholarship: Scholarship = {
      studentId,
      studentName: studentName || 'Étudiant',
      amount: Number(amount),
      type,
      typeAr: typeArMap[type] || type,
      status: 'pending',
      semester: semester || 'S1',
      academicYear: academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      criteria: criteria || {},
      disbursedAmount: 0,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection<Scholarship>(Collections.SCHOLARSHIPS)
      .insertOne(newScholarship);

    return NextResponse.json(
      { success: true, scholarship: { ...newScholarship, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating scholarship:', error);
    return NextResponse.json(
      { error: 'Failed to create scholarship' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une bourse
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { scholarshipId, status, disbursedAmount } = body;

    if (!scholarshipId) {
      return NextResponse.json(
        { error: 'scholarshipId is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const updateData: any = { updatedAt: new Date() };

    if (status) updateData.status = status;
    if (disbursedAmount !== undefined) updateData.disbursedAmount = disbursedAmount;

    await db
      .collection<Scholarship>(Collections.SCHOLARSHIPS)
      .updateOne(
        { _id: new ObjectId(scholarshipId) },
        { $set: updateData }
      );

    const updated = await db
      .collection<Scholarship>(Collections.SCHOLARSHIPS)
      .findOne({ _id: new ObjectId(scholarshipId) });

    return NextResponse.json({ success: true, scholarship: updated });
  } catch (error) {
    console.error('Error updating scholarship:', error);
    return NextResponse.json(
      { error: 'Failed to update scholarship' },
      { status: 500 }
    );
  }
}
