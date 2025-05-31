import { MongoClient, ObjectId } from 'mongodb';
import { Chat } from '../types/chat.types';

export class ChatRepository {
  private collection: any;

  constructor() {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    const db = client.db('arena');
    this.collection = db.collection('chats');
  }

  async findById(id: string): Promise<Chat | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByArenaId(arenaId: string): Promise<Chat[]> {
    return this.collection.find({ arenaId }).toArray();
  }

  async findByUserId(userId: string): Promise<Chat[]> {
    return this.collection.find({ userId }).toArray();
  }

  async create(data: {
    arena_id: string;
    user_id: string;
    content: string;
    type: 'text' | 'image' | 'video';
  }): Promise<Chat> {
    const chat = {
      arenaId: data.arena_id,
      userId: data.user_id,
      content: data.content,
      type: data.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.collection.insertOne(chat);
    return { ...chat, _id: result.insertedId };
  }

  async update(id: string, data: { content: string }): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: data.content,
          updatedAt: new Date(),
        },
      }
    );
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
} 