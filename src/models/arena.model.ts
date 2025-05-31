import mongoose, { Document, Schema } from 'mongoose';

export interface IArena extends Document {
  title: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  invitedUsers: mongoose.Types.ObjectId[];
  isPrivate: boolean;
  entryFee?: number;
  status: 'active' | 'closed';
  comments: {
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const arenaSchema = new Schema<IArena>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    invitedUsers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    entryFee: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    comments: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
arenaSchema.index({ creator: 1, status: 1 });
arenaSchema.index({ participants: 1 });

export const Arena = mongoose.model<IArena>('Arena', arenaSchema); 