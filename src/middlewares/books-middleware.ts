import { NextFunction, Request, Response } from 'express';
import { ResponseStructureType } from '../utils/types';
import { responseStructure } from '../utils/helpers';

export const checkBookDetails = (
  req: Request,
  res: Response,
  next: NextFunction,
  data: ResponseStructureType['data']
) => {
  const body = req.body;
  const title = body.title;
  const author = body.author;
  const publishYear = body.publishYear;

  if (!title || !author || !publishYear) {
    return responseStructure({ res, statusCode: 400, data });
  }

  next();
};
