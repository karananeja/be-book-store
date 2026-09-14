import { Response, Request } from 'express';
import { Document, Types } from 'mongoose';

export type EnvironmentTypes = {
  DB_PASSWORD?: string;
  DB_USERNAME?: string;
  DB_NAME?: string;
  APP_PORT?: string;
  JWT_SECRET?: string;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_NAME?: string;
};

export type UserRole = 'admin' | 'user';

export type BookStatus = 'want_to_read' | 'reading' | 'completed';

export type BookType = { title: string; author: string; publishYear: number };

export type UserType = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export type UserBookType = {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  status: BookStatus;
};

export type AuthUserPayload = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
};

export type AuthRequest = Request & { user?: AuthUserPayload };

type ErrType = { err: string; errMessage: string };

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>
  | Document
  | Array<Document>
  | null;

type SuccessType = { msg: string; info?: JSONValue };

export type ResponseStructureType = {
  data: ErrType | SuccessType;
  res: Response;
  statusCode?: number;
};

export type ErrMessagesType = {
  [x: string]: { err: string; errMessage: string };
};
