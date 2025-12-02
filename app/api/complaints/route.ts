import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Complaint } from '@/lib/types';
import { ObjectId } from 'mongodb';

// GET - Liste des réclamations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const db = await getDb();
    const query: any = {};
    
    if (userId) query.submittedBy = userId;
    if (status) query.status = status;
    if (category) query.category = category;

    const complaints = await db
      .collection<Complaint>(Collections.COMPLAINTS)
      .find(query)
      .sort({ submittedDate: -1 })
      .toArray();

    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle réclamation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, titleAr, description, category, priority, submittedBy, submittedByName } = body;

    if (!title || !description || !category || !submittedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Générer un ID de réclamation unique
    const count = await db.collection(Collections.COMPLAINTS).countDocuments();
    const year = new Date().getFullYear();
    const complaintId = `REC-${year}-${String(count + 1).padStart(3, '0')}`;

    const newComplaint: Complaint = {
      complaintId,
      title,
      titleAr: titleAr || title,
      description,
      category,
      priority: priority || 'medium',
      status: 'en_attente',
      submittedBy,
      submittedByName: submittedByName || 'Utilisateur',
      submittedDate: new Date(),
      lastUpdate: new Date(),
      timeline: [
        {
          date: new Date(),
          action: 'Réclamation soumise',
          status: 'done',
        },
        {
          date: new Date(),
          action: 'En attente de traitement',
          status: 'current',
        },
      ],
    };

    const result = await db
      .collection<Complaint>(Collections.COMPLAINTS)
      .insertOne(newComplaint);

    return NextResponse.json(
      { success: true, complaint: { ...newComplaint, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une réclamation (statut, assignation, résolution)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { complaintId, action, status, assignedTo, assignedToName, resolution } = body;

    if (!complaintId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const complaint = await db
      .collection<Complaint>(Collections.COMPLAINTS)
      .findOne({ complaintId });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    let updateData: any = { lastUpdate: new Date() };
    const timelineUpdate = [...complaint.timeline];

    if (action === 'updateStatus' && status) {
      updateData.status = status;
      
      // Update timeline
      timelineUpdate.forEach(item => {
        if (item.status === 'current') item.status = 'done';
      });
      
      timelineUpdate.push({
        date: new Date(),
        action: `Statut changé: ${status}`,
        status: 'current',
      });
      
      updateData.timeline = timelineUpdate;
    } else if (action === 'assign' && assignedTo) {
      updateData.assignedTo = assignedTo;
      updateData.assignedToName = assignedToName;
      
      timelineUpdate.push({
        date: new Date(),
        action: `Assignée à ${assignedToName}`,
        status: 'done',
      });
      
      updateData.timeline = timelineUpdate;
      updateData.status = 'en_cours';
    } else if (action === 'resolve' && resolution) {
      updateData.status = 'resolue';
      updateData.resolution = resolution;
      
      timelineUpdate.forEach(item => {
        if (item.status === 'current') item.status = 'done';
      });
      
      timelineUpdate.push({
        date: new Date(),
        action: 'Réclamation résolue',
        status: 'done',
      });
      
      updateData.timeline = timelineUpdate;
    }

    await db
      .collection<Complaint>(Collections.COMPLAINTS)
      .updateOne(
        { complaintId },
        { $set: updateData }
      );

    const updated = await db
      .collection<Complaint>(Collections.COMPLAINTS)
      .findOne({ complaintId });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}


