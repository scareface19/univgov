import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const location = searchParams.get('location');

    // Mock inventory data
    const inventory = [
      {
        _id: "1",
        itemName: "Ordinateurs Portables",
        itemNameAr: "أجهزة كمبيوتر محمولة",
        category: "Informatique",
        quantity: 150,
        available: 120,
        inUse: 25,
        maintenance: 5,
        status: "good",
        location: "Salle Info A",
        building: "Bâtiment Sciences",
        purchaseDate: new Date("2023-09-01"),
        warranty: "2026-09-01",
        value: 180000,
        supplier: "Tech Solutions",
      },
      {
        _id: "2",
        itemName: "Projecteurs",
        itemNameAr: "أجهزة العرض",
        category: "Audiovisuel",
        quantity: 45,
        available: 35,
        inUse: 8,
        maintenance: 2,
        status: "maintenance",
        location: "Amphi 1-5",
        building: "Bâtiment Central",
        purchaseDate: new Date("2022-01-15"),
        warranty: "2025-01-15",
        value: 67500,
        supplier: "AV Pro",
      },
      {
        _id: "3",
        itemName: "Microscopes",
        itemNameAr: "المجاهر",
        category: "Laboratoire",
        quantity: 30,
        available: 28,
        inUse: 2,
        maintenance: 0,
        status: "good",
        location: "Labo Biologie",
        building: "Bâtiment Sciences",
        purchaseDate: new Date("2021-06-01"),
        warranty: "2026-06-01",
        value: 150000,
        supplier: "Lab Equipment Co",
      },
    ];

    let filtered = inventory;
    if (status) filtered = filtered.filter(i => i.status === status);
    if (location) filtered = filtered.filter(i => i.location.includes(location));

    const summary = {
      totalItems: inventory.reduce((sum, i) => sum + i.quantity, 0),
      totalValue: inventory.reduce((sum, i) => sum + i.value, 0),
      available: inventory.reduce((sum, i) => sum + i.available, 0),
      inMaintenance: inventory.reduce((sum, i) => sum + i.maintenance, 0),
      categories: [...new Set(inventory.map(i => i.category))].length,
    };

    return NextResponse.json({ inventory: filtered, summary });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newItem = {
      ...body,
      available: body.quantity,
      inUse: 0,
      maintenance: 0,
      status: 'good',
      createdAt: new Date(),
    };

    return NextResponse.json(
      { success: true, item: newItem },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add inventory item' },
      { status: 500 }
    );
  }
}
