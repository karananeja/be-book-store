import { config } from 'dotenv';
import { EnvironmentTypes, ErrMessagesType } from './types';
import { CorsOptions } from 'cors';
config();

export const environment: EnvironmentTypes = {
  DB_PASSWORD: process.env.NODE_DB_PASSWORD,
  DB_USERNAME: process.env.NODE_DB_USERNAME,
  DB_NAME: process.env.NODE_DB_NAME,
  APP_PORT: process.env.NODE_APP_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_NAME: process.env.ADMIN_NAME,
};

export const BOOK_STATUSES = ['want_to_read', 'reading', 'completed'] as const;

export const errMessages: ErrMessagesType = {
  INTERNAL_SERVER_ERROR: {
    err: 'INTERNAL_SERVER_ERROR',
    errMessage: 'Exception has occurred',
  },
  BAD_REQUEST: {
    err: 'BAD_REQUEST',
    errMessage: 'Send all required fields: title, author, publishYear',
  },
  BOOK_NOT_FOUND: {
    err: 'BOOK_NOT_FOUND',
    errMessage: `Book doesn't exists`,
  },
  UNAUTHORIZED: {
    err: 'UNAUTHORIZED',
    errMessage: 'Authentication required',
  },
  FORBIDDEN: {
    err: 'FORBIDDEN',
    errMessage: 'Admin access required',
  },
  INVALID_CREDENTIALS: {
    err: 'INVALID_CREDENTIALS',
    errMessage: 'Invalid email or password',
  },
  EMAIL_IN_USE: {
    err: 'EMAIL_IN_USE',
    errMessage: 'Email is already registered',
  },
  AUTH_BAD_REQUEST: {
    err: 'AUTH_BAD_REQUEST',
    errMessage: 'Send all required fields: name, email, password',
  },
  LOGIN_BAD_REQUEST: {
    err: 'LOGIN_BAD_REQUEST',
    errMessage: 'Send all required fields: email, password',
  },
  LIBRARY_BAD_REQUEST: {
    err: 'LIBRARY_BAD_REQUEST',
    errMessage: 'Send required field: bookId',
  },
  INVALID_STATUS: {
    err: 'INVALID_STATUS',
    errMessage: 'Status must be want_to_read, reading, or completed',
  },
  LIBRARY_ITEM_NOT_FOUND: {
    err: 'LIBRARY_ITEM_NOT_FOUND',
    errMessage: 'Library item not found',
  },
  BOOK_ALREADY_IN_LIBRARY: {
    err: 'BOOK_ALREADY_IN_LIBRARY',
    errMessage: 'Book is already in your library',
  },
  JWT_NOT_CONFIGURED: {
    err: 'JWT_NOT_CONFIGURED',
    errMessage: 'JWT secret is not configured',
  },
};

export const corsOptions: CorsOptions = {
  origin: process.env.NODE_ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
