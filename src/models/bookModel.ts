import { Schema, model } from 'mongoose';
import { BookType } from '../utils/types';

const bookSchema = new Schema<BookType>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishYear: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Book = model<BookType>('Book', bookSchema);
