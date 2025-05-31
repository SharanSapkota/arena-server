import { MongoClient, ObjectId } from 'mongodb';
import { ChatLike } from '../types/chat.types';

export class ChatLikeRepository {
  private collection: any;

  constructor() {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    const db = client.db('arena');
    this.collection = db.collection('chat_likes');
  }

  async findById(id: string): Promise<ChatLike | null> {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByChatId(chatId: string): Promise<ChatLike[]> {
    return this.collection.find({ chatId }).toArray();
  }

  async findByUserId(userId: string): Promise<ChatLike[]> {
    return this.collection.find({ userId }).toArray();
  }

  async create(data: { chat_id: string; user_id: string }): Promise<ChatLike> {
    const like = {
      chatId: data.chat_id,
      userId: data.user_id,
      createdAt: new Date(),
    };

    const result = await this.collection.insertOne(like);
    return { ...like, _id: result.insertedId };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async deleteByChatAndUser(chatId: string, userId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ chatId, userId });
    return result.deletedCount > 0;
  }

  async countByChatId(chatId: string): Promise<number> {
    return this.collection.countDocuments({ chatId });
  }
} 