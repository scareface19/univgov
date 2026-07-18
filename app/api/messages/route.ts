import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseJson, toJson } from '@/lib/db';

// GET - Récupérer les messages ou conversations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');
    const type = searchParams.get('type') || 'messages'; // 'messages' or 'conversations'

    const db = getDb();

    if (type === 'conversations' && userId) {
      const allConvos = db.prepare('SELECT * FROM conversations ORDER BY lastMessageAt DESC').all() as any[];
      const userConvos = allConvos.filter(c => {
        const parts = parseJson(c.participants, []);
        return parts.includes(parseInt(userId));
      });

      const conversationsWithDetails = userConvos.map(conv => {
        const parts = parseJson(conv.participants, []);
        const otherParticipantId = parts.find((id: number) => id !== parseInt(userId));
        let otherParticipant = null;
        if (otherParticipantId) {
          const otherUser = db
            .prepare('SELECT id, firstName, lastName, avatar FROM users WHERE id=?')
            .get(otherParticipantId) as any;
          if (otherUser) {
            otherParticipant = {
              id: otherUser.id,
              name: `${otherUser.firstName} ${otherUser.lastName}`,
              avatar: otherUser.avatar,
            };
          }
        }
        const unreadRow = db
          .prepare('SELECT count FROM conversation_unread WHERE conversationId=? AND userId=?')
          .get(conv.id, parseInt(userId)) as any;
        return {
          ...conv,
          participants: parts,
          otherParticipant,
          unreadCount: unreadRow?.count || 0,
        };
      });

      return NextResponse.json(conversationsWithDetails);
    }

    if (conversationId) {
      const messages = db
        .prepare('SELECT * FROM messages WHERE conversationId=? ORDER BY createdAt ASC')
        .all(parseInt(conversationId)) as any[];
      return NextResponse.json(messages);
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const messages = db
      .prepare('SELECT * FROM messages WHERE senderId=? OR recipientId=? ORDER BY createdAt DESC')
      .all(parseInt(userId), parseInt(userId)) as any[];

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST - Envoyer un message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, recipientId, content, conversationId } = body;

    if (!senderId || !recipientId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();

    const sender = db
      .prepare('SELECT firstName, lastName FROM users WHERE id=?')
      .get(parseInt(senderId)) as any;
    const recipient = db
      .prepare('SELECT firstName, lastName FROM users WHERE id=?')
      .get(parseInt(recipientId)) as any;

    if (!sender || !recipient) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let convId: number = conversationId ? parseInt(conversationId) : 0;

    if (!convId) {
      const allConvos = db.prepare('SELECT * FROM conversations').all() as any[];
      const existing = allConvos.find(c => {
        const parts = parseJson(c.participants, []);
        return parts.includes(parseInt(senderId)) && parts.includes(parseInt(recipientId));
      });

      if (existing) {
        convId = existing.id;
      } else {
        const now = new Date().toISOString();
        const result = db
          .prepare('INSERT INTO conversations (participants, createdAt, updatedAt) VALUES (?, ?, ?)')
          .run(toJson([parseInt(senderId), parseInt(recipientId)]), now, now);
        convId = result.lastInsertRowid as number;
      }
    }

    const now = new Date().toISOString();
    const senderName = `${sender.firstName} ${sender.lastName}`;
    const recipientName = `${recipient.firstName} ${recipient.lastName}`;

    const msgResult = db
      .prepare(
        'INSERT INTO messages (conversationId, senderId, senderName, recipientId, recipientName, content, read, createdAt) VALUES (?, ?, ?, ?, ?, ?, 0, ?)'
      )
      .run(convId, parseInt(senderId), senderName, parseInt(recipientId), recipientName, content, now);

    db.prepare(
      'UPDATE conversations SET lastMessage=?, lastMessageAt=?, updatedAt=? WHERE id=?'
    ).run(content, now, now, convId);

    db.prepare(
      `INSERT INTO conversation_unread (conversationId, userId, count) VALUES (?, ?, 1)
       ON CONFLICT(conversationId, userId) DO UPDATE SET count = count + 1`
    ).run(convId, parseInt(recipientId));

    return NextResponse.json(
      {
        success: true,
        message: {
          id: msgResult.lastInsertRowid,
          conversationId: convId,
          senderId: parseInt(senderId),
          senderName,
          recipientId: parseInt(recipientId),
          recipientName,
          content,
          read: 0,
          createdAt: now,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// PUT - Marquer comme lu
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, conversationId, userId } = body;

    const db = getDb();

    if (messageId) {
      db.prepare('UPDATE messages SET read=1 WHERE id=?').run(parseInt(messageId));
    } else if (conversationId && userId) {
      db.prepare(
        'UPDATE messages SET read=1 WHERE conversationId=? AND recipientId=? AND read=0'
      ).run(parseInt(conversationId), parseInt(userId));

      db.prepare(
        `INSERT INTO conversation_unread (conversationId, userId, count) VALUES (?, ?, 0)
         ON CONFLICT(conversationId, userId) DO UPDATE SET count=0`
      ).run(parseInt(conversationId), parseInt(userId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}
