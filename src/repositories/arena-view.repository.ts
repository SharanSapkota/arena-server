import { MongoClient, ObjectId } from 'mongodb';
import { ArenaView } from '../types/arena.types';

export class ArenaViewRepository {
  private collection;

  constructor() {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    const db = client.db('arena');
    this.collection = db.collection('arena_views');
  }

  async findById(id: string): Promise<ArenaView | null> {
    const view = await this.collection.findOne({ _id: new ObjectId(id) });
    return view ? this.mapToArenaView(view) : null;
  }

  async findByArenaId(arenaId: string): Promise<ArenaView[]> {
    const views = await this.collection.find({ arena_id: arenaId }).toArray();
    return views.map(this.mapToArenaView);
  }

  async findByUserId(userId: string): Promise<ArenaView[]> {
    const views = await this.collection.find({ viewer_id: userId }).toArray();
    return views.map(this.mapToArenaView);
  }

  async create(data: { arena_id: string; viewer_id?: string; guest_id?: string; ip_address: string; user_agent: string }): Promise<ArenaView> {
    const view = {
      _id: new ObjectId(),
      arena_id: data.arena_id,
      viewer_id: data.viewer_id,
      guest_id: data.guest_id,
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      viewed_at: new Date(),
    };

    await this.collection.insertOne(view);
    return this.mapToArenaView(view);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async deleteByArenaAndUser(arenaId: string, userId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({
      arena_id: arenaId,
      viewer_id: userId,
    });
    return result.deletedCount > 0;
  }

  async countByArenaId(arenaId: string): Promise<number> {
    return this.collection.countDocuments({ arena_id: arenaId });
  }

  private mapToArenaView(data: any): ArenaView {
    return {
      id: data._id.toString(),
      arenaId: data.arena_id,
      viewerId: data.viewer_id,
      guestId: data.guest_id,
      viewedAt: data.viewed_at,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
    };
  }
} 