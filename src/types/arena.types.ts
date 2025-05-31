import { User } from './user.types';

export interface Arena {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: string;
    username: string;
    fullName: string;
  };
}

export interface ArenaInvite {
  id: string;
  arena_id: string;
  user_id: string;
  invited_at: Date;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  followed_at: Date;
}

export interface Chat {
  id: string;
  arenaId: string;
  senderId: string;
  message: string;
  sentAt: Date;
  sender?: {
    id: string;
    username: string;
    fullName: string;
  };
}

export interface ChatLike {
  id: string;
  chat_id: string;
  user_id: string;
  liked_at: Date;
}

export interface ChatComment {
  id: string;
  chat_id: string;
  user_id: string;
  comment: string;
  commented_at: Date;
}

export interface Comment {
  id: string;
  arenaId: string;
  commenterId: string;
  comment: string;
  commentedAt: Date;
  commenter?: {
    id: string;
    username: string;
    fullName: string;
  };
}

export interface ArenaView {
  id: string;
  arenaId: string;
  viewerId?: string;
  guestId?: string;
  ipAddress: string;
  userAgent: string;
  viewedAt: Date;
  viewer?: {
    id: string;
    username: string;
    fullName: string;
  };
}

export interface CreateArenaDto {
  title: string;
  description: string;
  is_public: boolean;
}

export interface UpdateArenaDto {
  title?: string;
  description?: string;
  is_public?: boolean;
}

export interface CreateChatDto {
  message: string;
}

export interface CreateCommentDto {
  comment: string;
} 