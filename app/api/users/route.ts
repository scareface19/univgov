import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson, toJson } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');

    const db = getDb();
    const rows: any[] = role
      ? db.prepare('SELECT * FROM users WHERE role = ?').all(role)
      : db.prepare('SELECT * FROM users').all();

    const users = rows.map(({ password: _password, ...user }) => ({
      ...user,
      permissions: parseJson(user.permissions, []),
      isActive: Boolean(user.isActive),
    }));

    return NextResponse.json({ success: true, users });
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
    const { email, password, role, firstName, lastName, department, avatar } = body;

    const db = getDb();

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
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

    const now = new Date().toISOString();

    const result = db.prepare(
      `INSERT INTO users (email, password, role, firstName, lastName, digitalId, department, avatar, permissions, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
    ).run(
      email,
      hashedPassword,
      role,
      firstName,
      lastName,
      digitalId,
      department ?? null,
      avatar ?? null,
      toJson(permissions),
      now,
      now
    );

    const newId = result.lastInsertRowid;

    const created = db.prepare('SELECT * FROM users WHERE id = ?').get(newId) as any;
    const { password: _pw, ...userWithoutPassword } = created;

    return NextResponse.json(
      {
        success: true,
        user: {
          ...userWithoutPassword,
          permissions: parseJson(userWithoutPassword.permissions, []),
          isActive: Boolean(userWithoutPassword.isActive),
        },
        id: newId.toString(),
        digitalId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
