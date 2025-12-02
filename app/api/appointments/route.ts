import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Appointment } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const staffId = searchParams.get('staffId');
    const status = searchParams.get('status');

    const db = await getDb();
    const query: any = {};
    if (studentId) query.studentId = studentId;
    if (staffId) query.staffId = staffId;
    if (status) query.status = status;
    
    const appointments = await db
      .collection<Appointment>(Collections.APPOINTMENTS)
      .find(query)
      .sort({ date: 1, time: 1 })
      .toArray();

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    const newAppointment: Appointment = {
      ...body,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await db
      .collection<Appointment>(Collections.APPOINTMENTS)
      .insertOne(newAppointment);

    return NextResponse.json(
      { id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
