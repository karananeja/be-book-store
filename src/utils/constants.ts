import { config } from 'dotenv';
import { EnvironmentTypes, ErrMessagesType } from './types';
import { CorsOptions } from 'cors';
config();

export const environment: EnvironmentTypes = {
  DB_PASSWORD: process.env.NODE_DB_PASSWORD,
  DB_USERNAME: process.env.NODE_DB_USERNAME,
  DB_NAME: process.env.NODE_DB_NAME,
  APP_PORT: process.env.NODE_APP_PORT,
};

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
};

export const corsOptions: CorsOptions = {
  origin: process.env.NODE_ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
