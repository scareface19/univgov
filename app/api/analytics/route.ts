import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'academic';

    const db = getDb();

    let analytics: any = {};

    switch (type) {
      case 'academic': {
        const enrollments = (db.prepare('SELECT COUNT(*) as c FROM enrollments').get() as any).c as number;
        const courses = (db.prepare('SELECT COUNT(*) as c FROM courses').get() as any).c as number;
        const students = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'student'").get() as any).c as number;

        analytics = {
          type: 'academic',
          metrics: {
            totalEnrollments: enrollments,
            totalCourses: courses,
            totalStudents: students,
            averageEnrollmentPerCourse: courses > 0 ? enrollments / courses : 0,
          },
        };
        break;
      }

      case 'financial': {
        const payments = db.prepare('SELECT status, amount FROM payments').all() as any[];
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
          },
        };
        break;
      }

      case 'engagement': {
        const posts = (db.prepare('SELECT COUNT(*) as c FROM community_posts').get() as any).c as number;
        const announcements = (db.prepare('SELECT COUNT(*) as c FROM announcements').get() as any).c as number;
        const appointments = (db.prepare('SELECT COUNT(*) as c FROM appointments').get() as any).c as number;

        analytics = {
          type: 'engagement',
          metrics: {
            totalPosts: posts,
            totalAnnouncements: announcements,
            totalAppointments: appointments,
          },
        };
        break;
      }

      case 'partnerships': {
        const partnerships = (db.prepare("SELECT COUNT(*) as c FROM partnerships WHERE status = 'active'").get() as any).c as number;
        const internships = (db.prepare("SELECT COUNT(*) as c FROM internships WHERE status = 'open'").get() as any).c as number;

        analytics = {
          type: 'partnerships',
          metrics: {
            activePartnerships: partnerships,
            openInternships: internships,
          },
        };
        break;
      }
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
