import { NextRequest, NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/mongodb';
import { Message, Conversation } from '@/lib/types';
import { ObjectId } from 'mongodb';

// GET - Récupérer les messages ou conversations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');
    const type = searchParams.get('type') || 'messages'; // 'messages' or 'conversations'

    const db = await getDb();

    if (type === 'conversations' && userId) {
      // Récupérer toutes les conversations de l'utilisateur
      const conversations = await db
        .collection<Conversation>(Collections.CONVERSATIONS)
        .find({ participants: userId })
        .sort({ lastMessageAt: -1 })
        .toArray();

      // Pour chaque conversation, récupérer les infos des autres participants
      const conversationsWithDetails = await Promise.all(
        conversations.map(async (conv) => {
          const otherParticipantId = conv.participants.find(id => id !== userId);
          if (otherParticipantId) {
            const otherUser = await db
              .collection(Collections.USERS)
              .findOne({ _id: new ObjectId(otherParticipantId) });
            
            return {
              ...conv,
              otherParticipant: otherUser ? {
                id: otherUser._id,
                name: `${otherUser.firstName} ${otherUser.lastName}`,
                avatar: otherUser.avatar,
              } : null,
              unreadCount: conv.unreadCount?.[userId] || 0,
            };
          }
          return conv;
        })
      );

      return NextResponse.json(conversationsWithDetails);
    }

    if (conversationId) {
      // Récupérer les messages d'une conversation
      const messages = await db
        .collection<Message>(Collections.MESSAGES)
        .find({ conversationId })
        .sort({ createdAt: 1 })
        .toArray();

      return NextResponse.json(messages);
    }

    // Récupérer tous les messages de l'utilisateur
    const messages = await db
      .collection<Message>(Collections.MESSAGES)
      .find({
        $or: [
          { senderId: userId },
          { recipientId: userId },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST - Envoyer un message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, recipientId, content, conversationId } = body;

    if (!senderId || !recipientId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Récupérer les noms des utilisateurs
    const [sender, recipient] = await Promise.all([
      db.collection(Collections.USERS).findOne({ _id: new ObjectId(senderId) }),
      db.collection(Collections.USERS).findOne({ _id: new ObjectId(recipientId) }),
    ]);

    if (!sender || !recipient) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let convId = conversationId;

    // Si pas de conversationId, chercher ou créer une conversation
    if (!convId) {
      let existingConv = await db
        .collection<Conversation>(Collections.CONVERSATIONS)
        .findOne({
          participants: { $all: [senderId, recipientId], $size: 2 },
        });

      if (!existingConv) {
        // Créer une nouvelle conversation
        const newConversation: Conversation = {
          participants: [senderId, recipientId],
          unreadCount: { [recipientId]: 0 },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const convResult = await db
          .collection<Conversation>(Collections.CONVERSATIONS)
          .insertOne(newConversation);

        convId = convResult.insertedId.toString();
      } else {
        convId = existingConv._id!.toString();
      }
    }

    // Créer le message
    const newMessage: Message = {
      conversationId: convId,
      senderId,
      senderName: `${sender.firstName} ${sender.lastName}`,
      recipientId,
      recipientName: `${recipient.firstName} ${recipient.lastName}`,
      content,
      read: false,
      createdAt: new Date(),
    };

    const result = await db
      .collection<Message>(Collections.MESSAGES)
      .insertOne(newMessage);

    // Mettre à jour la conversation
    await db
      .collection<Conversation>(Collections.CONVERSATIONS)
      .updateOne(
        { _id: new ObjectId(convId) },
        {
          $set: {
            lastMessage: content,
            lastMessageAt: new Date(),
            updatedAt: new Date(),
          },
          $inc: {
            [`unreadCount.${recipientId}`]: 1,
          },
        }
      );

    return NextResponse.json(
      { success: true, message: { ...newMessage, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// PUT - Marquer comme lu
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, conversationId, userId } = body;

    const db = await getDb();

    if (messageId) {
      // Marquer un message spécifique comme lu
      await db
        .collection<Message>(Collections.MESSAGES)
        .updateOne(
          { _id: new ObjectId(messageId) },
          { $set: { read: true } }
        );
    } else if (conversationId && userId) {
      // Marquer tous les messages de la conversation comme lus
      await db
        .collection<Message>(Collections.MESSAGES)
        .updateMany(
          { conversationId, recipientId: userId, read: false },
          { $set: { read: true } }
        );

      // Réinitialiser le compteur de non-lus
      await db
        .collection<Conversation>(Collections.CONVERSATIONS)
        .updateOne(
          { _id: new ObjectId(conversationId) },
          { $set: { [`unreadCount.${userId}`]: 0 } }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}
