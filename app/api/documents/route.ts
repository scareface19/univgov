import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson } from '@/lib/db';

// GET - Liste des documents avec filtres
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const db = getDb();

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (userId) {
      conditions.push('userId = ?');
      params.push(parseInt(userId, 10));
    }
    if (type) {
      conditions.push('type = ?');
      params.push(type);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = db
      .prepare(`SELECT * FROM documents ${where} ORDER BY requestedDate DESC`)
      .all(...params) as any[];

    const documents = rows.map((row) => ({
      ...row,
      metadata: parseJson(row.metadata, {}),
    }));

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST - Demander un nouveau document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, type, title, titleAr, expiryDays } = body;

    if (!userId || !type || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();

    const { c: count } = db
      .prepare('SELECT COUNT(*) as c FROM documents')
      .get() as { c: number };
    const year = new Date().getFullYear();
    const documentId = `DOC-${year}-${String(count + 1).padStart(3, '0')}`;

    const typeArMap: Record<string, string> = {
      certificate: 'شهادة التسجيل',
      transcript: 'كشف النقاط',
      attestation: 'شهادة',
      other: 'وثيقة أخرى',
    };

    const now = new Date().toISOString();
    let expiryDate: string | null = null;
    if (expiryDays) {
      const d = new Date();
      d.setDate(d.getDate() + Number(expiryDays));
      expiryDate = d.toISOString();
    }

    db.prepare(`
      INSERT INTO documents
        (documentId, userId, userName, type, typeAr, title, titleAr,
         status, requestedDate, expiryDate, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, '{}')
    `).run(
      documentId,
      parseInt(userId, 10),
      userName || 'Utilisateur',
      type,
      typeArMap[type] || 'وثيقة',
      title,
      titleAr || title,
      now,
      expiryDate,
    );

    const created = db
      .prepare('SELECT * FROM documents WHERE documentId = ?')
      .get(documentId) as any;
    created.metadata = parseJson(created.metadata, {});

    return NextResponse.json({ success: true, document: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating document request:', error);
    return NextResponse.json({ error: 'Failed to create document request' }, { status: 500 });
  }
}

// PUT - Mettre à jour un document (statut, fichier, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, action, status, fileUrl, metadata } = body;

    if (!documentId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();

    const existing = db
      .prepare('SELECT * FROM documents WHERE documentId = ?')
      .get(documentId) as any;

    if (!existing) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    if (action === 'updateStatus' && status) {
      if (status === 'available') {
        db.prepare(
          'UPDATE documents SET status=?, processedDate=? WHERE documentId=?',
        ).run(status, now, documentId);
      } else {
        db.prepare('UPDATE documents SET status=? WHERE documentId=?').run(status, documentId);
      }
    } else if (action === 'uploadFile' && fileUrl) {
      db.prepare(
        "UPDATE documents SET fileUrl=?, status='available', processedDate=? WHERE documentId=?",
      ).run(fileUrl, now, documentId);
    } else if (action === 'updateMetadata' && metadata) {
      const current = parseJson(existing.metadata, {});
      const merged = { ...current, ...metadata };
      db.prepare('UPDATE documents SET metadata=? WHERE documentId=?').run(
        JSON.stringify(merged),
        documentId,
      );
    }

    const updated = db
      .prepare('SELECT * FROM documents WHERE documentId = ?')
      .get(documentId) as any;
    updated.metadata = parseJson(updated.metadata, {});

    return NextResponse.json({ success: true, document: updated });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}
