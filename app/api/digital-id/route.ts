import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson } from '@/lib/db';

// GET - Récupérer les infos Digital ID de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const digitalId = searchParams.get('digitalId');

    if (!userId && !digitalId) {
      return NextResponse.json(
        { error: 'userId or digitalId is required' },
        { status: 400 },
      );
    }

    const db = getDb();

    const user = db
      .prepare(
        `SELECT id, digitalId, firstName, lastName, email, role, department,
                permissions, isActive, createdAt
         FROM users
         WHERE id = ? OR digitalId = ?`,
      )
      .get(
        userId ? parseInt(userId, 10) : null,
        digitalId ?? null,
      ) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const digitalIdData = {
      userId: user.id,
      digitalId: user.digitalId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department,
      permissions: parseJson(user.permissions, []),
      isActive: user.isActive === 1,
      createdAt: user.createdAt,
    };

    return NextResponse.json(digitalIdData);
  } catch (error) {
    console.error('Error fetching digital ID:', error);
    return NextResponse.json({ error: 'Failed to fetch digital ID' }, { status: 500 });
  }
}

// PUT - Mettre à jour les permissions Digital ID
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, permissions, isActive } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const db = getDb();

    const sets: string[] = ['updatedAt = ?'];
    const params: any[] = [new Date().toISOString()];

    if (permissions !== undefined) {
      sets.push('permissions = ?');
      params.push(JSON.stringify(permissions));
    }
    if (isActive !== undefined) {
      sets.push('isActive = ?');
      params.push(isActive ? 1 : 0);
    }

    params.push(parseInt(userId, 10));

    db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...params);

    const updated = db
      .prepare(
        `SELECT id, digitalId, firstName, lastName, email, role, department,
                permissions, isActive, createdAt
         FROM users
         WHERE id = ?`,
      )
      .get(parseInt(userId, 10)) as any;

    return NextResponse.json({
      success: true,
      digitalId: {
        userId: updated.id,
        digitalId: updated.digitalId,
        permissions: parseJson(updated.permissions, []),
        isActive: updated.isActive === 1,
      },
    });
  } catch (error) {
    console.error('Error updating digital ID:', error);
    return NextResponse.json({ error: 'Failed to update digital ID' }, { status: 500 });
  }
}

// POST - Générer/Regénérer QR Code (retourne les données pour QR Code)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const db = getDb();

    const user = db
      .prepare(
        `SELECT id, digitalId, firstName, lastName, role, department, permissions
         FROM users
         WHERE id = ?`,
      )
      .get(parseInt(userId, 10)) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const qrData = {
      digitalId: user.digitalId,
      userId: String(user.id),
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      department: user.department,
      permissions: parseJson(user.permissions, []),
      timestamp: new Date().toISOString(),
    };

    const qrCodeString = JSON.stringify(qrData);

    return NextResponse.json({ success: true, qrData, qrCodeString });
  } catch (error) {
    console.error('Error generating QR Code:', error);
    return NextResponse.json({ error: 'Failed to generate QR Code' }, { status: 500 });
  }
}
