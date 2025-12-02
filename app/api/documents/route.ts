import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Document } from '@/lib/types';
import { ObjectId } from 'mongodb';

// GET - Liste des documents avec filtres
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const db = await getDb();
    const query: any = {};
    
    if (userId) query.userId = userId;
    if (type) query.type = type;
    if (status) query.status = status;

    const documents = await db
      .collection<Document>(Collections.DOCUMENTS)
      .find(query)
      .sort({ requestedDate: -1 })
      .toArray();

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST - Demander un nouveau document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, type, title, titleAr, expiryDays } = body;

    if (!userId || !type || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Générer un ID de document unique
    const count = await db.collection(Collections.DOCUMENTS).countDocuments();
    const year = new Date().getFullYear();
    const documentId = `DOC-${year}-${String(count + 1).padStart(3, '0')}`;

    const typeArMap: Record<string, string> = {
      'certificate': 'شهادة التسجيل',
      'transcript': 'كشف النقاط',
      'attestation': 'شهادة',
      'other': 'وثيقة أخرى',
    };

    const newDocument: Document = {
      documentId,
      userId,
      userName: userName || 'Utilisateur',
      type,
      typeAr: typeArMap[type] || 'وثيقة',
      title,
      titleAr: titleAr || title,
      status: 'pending',
      requestedDate: new Date(),
      metadata: {},
    };

    if (expiryDays) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      newDocument.expiryDate = expiryDate;
    }

    const result = await db
      .collection<Document>(Collections.DOCUMENTS)
      .insertOne(newDocument);

    return NextResponse.json(
      { success: true, document: { ...newDocument, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating document request:', error);
    return NextResponse.json(
      { error: 'Failed to create document request' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un document (statut, fichier, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, action, status, fileUrl, metadata } = body;

    if (!documentId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const document = await db
      .collection<Document>(Collections.DOCUMENTS)
      .findOne({ documentId });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    let updateData: any = {};

    if (action === 'updateStatus' && status) {
      updateData.status = status;
      if (status === 'available') {
        updateData.processedDate = new Date();
      }
    } else if (action === 'uploadFile' && fileUrl) {
      updateData.fileUrl = fileUrl;
      updateData.status = 'available';
      updateData.processedDate = new Date();
    } else if (action === 'updateMetadata' && metadata) {
      updateData.metadata = { ...document.metadata, ...metadata };
    }

    await db
      .collection<Document>(Collections.DOCUMENTS)
      .updateOne(
        { documentId },
        { $set: updateData }
      );

    const updated = await db
      .collection<Document>(Collections.DOCUMENTS)
      .findOne({ documentId });

    return NextResponse.json({ success: true, document: updated });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

