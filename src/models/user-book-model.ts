import { Schema, model } from 'mongoose';
import { UserBookType } from '../utils/types';

const userBookSchema = new Schema<UserBookType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    status: {
      type: String,
      enum: ['want_to_read', 'reading', 'completed'],
      default: 'want_to_read',
      required: true,
    },
  },
  { timestamps: true }
);

userBookSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const UserBook = model<UserBookType>('UserBook', userBookSchema);
