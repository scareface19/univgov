import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { User } from '@/lib/types';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');

    const db = await getDb();
    const query: any = role ? { role: role as User['role'] } : {};
    
    const users = await db
      .collection<User>(Collections.USERS)
      .find(query)
      .project({ password: 0 })
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role, firstName, lastName, ...rest } = body;

    const db = await getDb();
    
    // Check if user already exists
    const existingUser = await db
      .collection<User>(Collections.USERS)
      .findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate digital ID
    const digitalId = `DID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Set default permissions based on role
    let permissions: string[] = [];
    switch (role) {
      case 'student':
        // Pour le compte démo, utiliser les mêmes permissions que dans le script
        if (email === 'demo@unigov.dz') {
          permissions = ['library', 'cafeteria', 'transport', 'sports', 'health'];
        } else {
          permissions = ['library', 'cafeteria', 'courses', 'grades'];
        }
        break;
      case 'professor':
        permissions = ['library', 'cafeteria', 'courses', 'grades', 'course_management'];
        break;
      case 'staff':
        permissions = ['library', 'cafeteria', 'administration'];
        break;
      case 'admin':
        permissions = ['all'];
        break;
    }

    // Create user
    const newUser: User = {
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      digitalId,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions,
      isActive: true,
      ...rest,
    };

    const result = await db
      .collection<User>(Collections.USERS)
      .insertOne(newUser);

    return NextResponse.json(
      { id: result.insertedId, digitalId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
