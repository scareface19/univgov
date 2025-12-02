import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'academic';

    const db = await getDb();
    
    // Generate analytics based on type
    let analytics: any = {};

    switch (type) {
      case 'academic':
        const enrollments = await db.collection(Collections.ENROLLMENTS).countDocuments();
        const courses = await db.collection(Collections.COURSES).countDocuments();
        const students = await db.collection(Collections.USERS).countDocuments({ role: 'student' });
        
        analytics = {
          type: 'academic',
          metrics: {
            totalEnrollments: enrollments,
            totalCourses: courses,
            totalStudents: students,
            averageEnrollmentPerCourse: courses > 0 ? enrollments / courses : 0,
          }
        };
        break;

      case 'financial':
        const payments = await db.collection(Collections.PAYMENTS).find().toArray();
        const totalRevenue = payments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0);
        const pendingPayments = payments.filter(p => p.status === 'pending').length;
        
        analytics = {
          type: 'financial',
          metrics: {
            totalRevenue,
            pendingPayments,
            completedPayments: payments.filter(p => p.status === 'completed').length,
            totalTransactions: payments.length,
          }
        };
        break;

      case 'engagement':
        const posts = await db.collection(Collections.COMMUNITY_POSTS).countDocuments();
        const announcements = await db.collection(Collections.ANNOUNCEMENTS).countDocuments();
        const appointments = await db.collection(Collections.APPOINTMENTS).countDocuments();
        
        analytics = {
          type: 'engagement',
          metrics: {
            totalPosts: posts,
            totalAnnouncements: announcements,
            totalAppointments: appointments,
          }
        };
        break;

      case 'partnerships':
        const partnerships = await db.collection(Collections.PARTNERSHIPS).countDocuments({ status: 'active' });
        const internships = await db.collection(Collections.INTERNSHIPS).countDocuments({ status: 'open' });
        
        analytics = {
          type: 'partnerships',
          metrics: {
            activePartnerships: partnerships,
            openInternships: internships,
          }
        };
        break;
    }

    analytics.generatedAt = new Date();

    return NextResponse.json(analytics);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}
