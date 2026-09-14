import { NextFunction, Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user-model';
import { authenticate } from '../middlewares/auth-middleware';
import { environment, errMessages } from '../utils/constants';
import { responseStructure } from '../utils/helpers';
import { AuthRequest, AuthUserPayload } from '../utils/types';

const router = Router();

const signToken = (user: AuthUserPayload) => {
  const secret = environment.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(user, secret, { expiresIn: '7d' });
};

const publicUser = (doc: {
  _id: { toString: () => string };
  name: string;
  email: string;
  role: 'admin' | 'user';
}) => ({
  id: doc._id.toString(),
  name: doc.name,
  email: doc.email,
  role: doc.role,
});

router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return responseStructure({
        res,
        statusCode: 400,
        data: errMessages.AUTH_BAD_REQUEST,
      });
    }

    try {
      const existing = await User.findOne({ email: String(email).toLowerCase() });
      if (existing) {
        return responseStructure({
          res,
          statusCode: 409,
          data: errMessages.EMAIL_IN_USE,
        });
      }

      const passwordHash = await bcrypt.hash(String(password), 10);
      const user = await User.create({
        name: String(name).trim(),
        email: String(email).toLowerCase().trim(),
        passwordHash,
        role: 'user',
      });

      const payload = publicUser(user);
      const token = signToken(payload);

      responseStructure({
        res,
        statusCode: 201,
        data: { msg: 'Registered successfully', info: { token, user: payload } },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return responseStructure({
      res,
      statusCode: 400,
      data: errMessages.LOGIN_BAD_REQUEST,
    });
  }

  try {
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return responseStructure({
        res,
        statusCode: 401,
        data: errMessages.INVALID_CREDENTIALS,
      });
    }

    const match = await bcrypt.compare(String(password), user.passwordHash);
    if (!match) {
      return responseStructure({
        res,
        statusCode: 401,
        data: errMessages.INVALID_CREDENTIALS,
      });
    }

    const payload = publicUser(user);
    const token = signToken(payload);

    responseStructure({
      res,
      data: { msg: 'Logged in successfully', info: { token, user: payload } },
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/me',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user?.id).select(
        'name email role'
      );
      if (!user) {
        return responseStructure({
          res,
          statusCode: 401,
          data: errMessages.UNAUTHORIZED,
        });
      }

      responseStructure({
        res,
        data: { msg: 'Current user', info: publicUser(user) },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
