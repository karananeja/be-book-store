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

type SuccessType = {
  msg: string;
  info: {
    [x: string]: string | number;
  };
};

export type ResponseStructureType = {
  data: ErrType | SuccessType;
  res: Response;
  statusCode: number;
};

export type ErrMessagesType = {
  [x: string]: {
    err: string;
    errMessage: string;
  };
};
