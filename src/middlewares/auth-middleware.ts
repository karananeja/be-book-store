import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { environment, errMessages } from '../utils/constants';
import { responseStructure } from '../utils/helpers';
import { AuthRequest, AuthUserPayload } from '../utils/types';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return responseStructure({
      res,
      statusCode: 401,
      data: errMessages.UNAUTHORIZED,
    });
  }

  const secret = environment.JWT_SECRET;
  if (!secret) {
    return responseStructure({
      res,
      statusCode: 500,
      data: errMessages.JWT_NOT_CONFIGURED,
    });
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, secret) as AuthUserPayload;
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
    next();
  } catch {
    return responseStructure({
      res,
      statusCode: 401,
      data: errMessages.UNAUTHORIZED,
    });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'admin') {
    return responseStructure({
      res,
      statusCode: 403,
      data: errMessages.FORBIDDEN,
    });
  }
  next();
};
