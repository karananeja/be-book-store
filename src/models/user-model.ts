import { Schema, model } from 'mongoose';
import { UserType } from '../utils/types';

const userSchema = new Schema<UserType>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true,
    },
  },
  { timestamps: true }
);

export const User = model<UserType>('User', userSchema);
