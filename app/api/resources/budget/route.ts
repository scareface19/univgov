import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const faculty = searchParams.get('faculty');
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    // Mock budget data
    const budgetData = {
      year: parseInt(year),
      total: 45000000,
      allocated: 38500000,
      spent: 33200000,
      remaining: 5300000,
      faculties: [
        {
          name: "Sciences",
          nameAr: "العلوم",
          budget: 12000000,
          spent: 8500000,
          percentage: 71,
          departments: [
            { name: "Informatique", budget: 5000000, spent: 3500000 },
            { name: "Mathématiques", budget: 4000000, spent: 3000000 },
            { name: "Physique", budget: 3000000, spent: 2000000 },
          ],
        },
        {
          name: "Technologies",
          nameAr: "التكنولوجيا",
          budget: 15000000,
          spent: 11200000,
          percentage: 75,
          departments: [
            { name: "Génie Civil", budget: 7000000, spent: 5500000 },
            { name: "Électronique", budget: 8000000, spent: 5700000 },
          ],
        },
        {
          name: "Médecine",
          nameAr: "الطب",
          budget: 10000000,
          spent: 7800000,
          percentage: 78,
          departments: [
            { name: "Médecine Générale", budget: 6000000, spent: 4800000 },
            { name: "Pharmacie", budget: 4000000, spent: 3000000 },
          ],
        },
      ],
    };

    return NextResponse.json(budgetData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch budget' },
      { status: 500 }
    );
  }
}
