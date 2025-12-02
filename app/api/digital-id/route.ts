import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Récupérer les infos Digital ID de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const digitalId = searchParams.get('digitalId');

    if (!userId && !digitalId) {
      return NextResponse.json(
        { error: 'userId or digitalId is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const query: any = {};
    
    if (userId) {
      query._id = new ObjectId(userId);
    } else if (digitalId) {
      query.digitalId = digitalId;
    }

    const user = await db
      .collection(Collections.USERS)
      .findOne(query);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Récupérer les permissions et les infos supplémentaires
    const digitalIdData = {
      userId: user._id,
      digitalId: user.digitalId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department,
      permissions: user.permissions || [],
      isActive: user.isActive !== false,
      createdAt: user.createdAt,
    };

    return NextResponse.json(digitalIdData);
  } catch (error) {
    console.error('Error fetching digital ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch digital ID' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les permissions Digital ID
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, permissions, isActive } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (permissions !== undefined) {
      updateData.permissions = permissions;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    await db
      .collection(Collections.USERS)
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
      );

    const updated = await db
      .collection(Collections.USERS)
      .findOne({ _id: new ObjectId(userId) });

    return NextResponse.json({
      success: true,
      digitalId: {
        userId: updated!._id,
        digitalId: updated!.digitalId,
        permissions: updated!.permissions || [],
        isActive: updated!.isActive,
      },
    });
  } catch (error) {
    console.error('Error updating digital ID:', error);
    return NextResponse.json(
      { error: 'Failed to update digital ID' },
      { status: 500 }
    );
  }
}

// POST - Générer/Regénérer QR Code (retourne les données pour QR Code)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db
      .collection(Collections.USERS)
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Générer les données pour le QR Code
    const qrData = {
      digitalId: user.digitalId,
      userId: user._id!.toString(),
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      department: user.department,
      permissions: user.permissions || [],
      timestamp: new Date().toISOString(),
    };

    // En production, vous pourriez signer ce QR code avec une clé secrète
    const qrCodeString = JSON.stringify(qrData);

    return NextResponse.json({
      success: true,
      qrData,
      qrCodeString,
      // En production, encoder en base64 ou utiliser une librairie QR
      // qrCodeImage: generateQRCodeImage(qrData)
    });
  } catch (error) {
    console.error('Error generating QR Code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR Code' },
      { status: 500 }
    );
  }
}

