import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson } from '@/lib/db';

// GET - Liste des réclamations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const db = getDb();

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (userId) {
      conditions.push('submittedBy = ?');
      params.push(parseInt(userId, 10));
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = db
      .prepare(`SELECT * FROM complaints ${where} ORDER BY submittedDate DESC`)
      .all(...params) as any[];

    const complaints = rows.map((row) => ({
      ...row,
      timeline: parseJson(row.timeline, []),
    }));

    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 });
  }
}

// POST - Créer une nouvelle réclamation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, titleAr, description, category, priority, submittedBy, submittedByName } = body;

    if (!title || !description || !category || !submittedBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();

    const { c: count } = db
      .prepare('SELECT COUNT(*) as c FROM complaints')
      .get() as { c: number };
    const year = new Date().getFullYear();
    const complaintId = `REC-${year}-${String(count + 1).padStart(3, '0')}`;

    const now = new Date().toISOString();
    const timeline = body.timeline || [
      { date: now, action: 'Réclamation soumise', status: 'done' },
      { date: now, action: 'En attente de traitement', status: 'current' },
    ];

    db.prepare(`
      INSERT INTO complaints
        (complaintId, title, titleAr, description, category, priority, status,
         submittedBy, submittedByName, submittedDate, lastUpdate, timeline)
      VALUES (?, ?, ?, ?, ?, ?, 'en_attente', ?, ?, ?, ?, ?)
    `).run(
      complaintId,
      title,
      titleAr || title,
      description,
      category,
      priority || 'medium',
      parseInt(submittedBy, 10),
      submittedByName || 'Utilisateur',
      now,
      now,
      JSON.stringify(timeline),
    );

    const created = db
      .prepare('SELECT * FROM complaints WHERE complaintId = ?')
      .get(complaintId) as any;
    created.timeline = parseJson(created.timeline, []);

    return NextResponse.json({ success: true, complaint: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 });
  }
}

// PUT - Mettre à jour une réclamation (statut, assignation, résolution)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { complaintId, action, status, assignedTo, assignedToName, resolution } = body;

    if (!complaintId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();

    const existing = db
      .prepare('SELECT * FROM complaints WHERE complaintId = ?')
      .get(complaintId) as any;

    if (!existing) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const timeline: any[] = parseJson(existing.timeline, []);

    if (action === 'updateStatus' && status) {
      timeline.forEach((item) => {
        if (item.status === 'current') item.status = 'done';
      });
      timeline.push({ date: now, action: `Statut changé: ${status}`, status: 'current' });

      db.prepare(
        'UPDATE complaints SET status=?, timeline=?, lastUpdate=? WHERE complaintId=?',
      ).run(status, JSON.stringify(timeline), now, complaintId);
    } else if (action === 'assign' && assignedTo) {
      timeline.push({ date: now, action: `Assignée à ${assignedToName}`, status: 'done' });

      db.prepare(
        "UPDATE complaints SET assignedTo=?, assignedToName=?, status='en_cours', timeline=?, lastUpdate=? WHERE complaintId=?",
      ).run(parseInt(assignedTo, 10), assignedToName, JSON.stringify(timeline), now, complaintId);
    } else if (action === 'resolve' && resolution) {
      timeline.forEach((item) => {
        if (item.status === 'current') item.status = 'done';
      });
      timeline.push({ date: now, action: 'Réclamation résolue', status: 'done' });

      db.prepare(
        "UPDATE complaints SET status='resolue', resolution=?, timeline=?, lastUpdate=? WHERE complaintId=?",
      ).run(resolution, JSON.stringify(timeline), now, complaintId);
    }

    const updated = db
      .prepare('SELECT * FROM complaints WHERE complaintId = ?')
      .get(complaintId) as any;
    updated.timeline = parseJson(updated.timeline, []);

    return NextResponse.json({ success: true, complaint: updated });
  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json({ error: 'Failed to update complaint' }, { status: 500 });
  }
}
