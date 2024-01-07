import { Response } from 'express';

export type EnvironmentTypes = {
  DB_PASSWORD?: string;
  DB_USERNAME?: string;
  DB_NAME?: string;
  APP_PORT?: string;
};

export type BookType = {
  title: string;
  author: string;
  publishYear: number;
};

type ErrType = { err: string; errMessage: string };

export type ResponseStructureType = {
  data: ErrType;
  res: Response;
  statusCode: number;
};

export type ErrMessagesType = {
  [x: string]: {
    err: string;
    errMessage: string;
  };
};
