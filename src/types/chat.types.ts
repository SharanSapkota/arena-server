import { ObjectId } from 'mongodb';

export interface Chat {
  _id: ObjectId;
  arenaId: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'video';
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatLike {
  _id: ObjectId;
  chatId: string;
  userId: string;
  createdAt: Date;
}

export interface ChatComment {
  _id: ObjectId;
  chatId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
} 