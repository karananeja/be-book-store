import { NextFunction, Response, Router } from 'express';
import { authenticate } from '../middlewares/auth-middleware';
import { Book } from '../models/book-model';
import { UserBook } from '../models/user-book-model';
import { BOOK_STATUSES, errMessages } from '../utils/constants';
import { responseStructure } from '../utils/helpers';
import { AuthRequest, BookStatus } from '../utils/types';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string | undefined;
    const filter: { userId: string; status?: BookStatus } = {
      userId: req.user!.id,
    };

    if (status) {
      if (!BOOK_STATUSES.includes(status as BookStatus)) {
        return responseStructure({
          res,
          statusCode: 400,
          data: errMessages.INVALID_STATUS,
        });
      }
      filter.status = status as BookStatus;
    }

    const items = await UserBook.find(filter)
      .populate('bookId')
      .sort({ updatedAt: -1 });

    responseStructure({
      res,
      data: { msg: 'Fetched library', info: items },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { bookId, status } = req.body ?? {};

  if (!bookId) {
    return responseStructure({
      res,
      statusCode: 400,
      data: errMessages.LIBRARY_BAD_REQUEST,
    });
  }

  const nextStatus: BookStatus =
    status && BOOK_STATUSES.includes(status) ? status : 'want_to_read';

  if (status && !BOOK_STATUSES.includes(status)) {
    return responseStructure({
      res,
      statusCode: 400,
      data: errMessages.INVALID_STATUS,
    });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return responseStructure({
        res,
        statusCode: 404,
        data: errMessages.BOOK_NOT_FOUND,
      });
    }

    const existing = await UserBook.findOne({
      userId: req.user!.id,
      bookId,
    });
    if (existing) {
      return responseStructure({
        res,
        statusCode: 409,
        data: errMessages.BOOK_ALREADY_IN_LIBRARY,
      });
    }

    const item = await UserBook.create({
      userId: req.user!.id,
      bookId,
      status: nextStatus,
    });
    await item.populate('bookId');

    responseStructure({
      res,
      statusCode: 201,
      data: { msg: 'Book added to library', info: item },
    });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      return responseStructure({
        res,
        statusCode: 409,
        data: errMessages.BOOK_ALREADY_IN_LIBRARY,
      });
    }
    next(error);
  }
});

router.patch(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { status } = req.body ?? {};

    if (!status || !BOOK_STATUSES.includes(status)) {
      return responseStructure({
        res,
        statusCode: 400,
        data: errMessages.INVALID_STATUS,
      });
    }

    try {
      const item = await UserBook.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.id },
        { status },
        { new: true }
      ).populate('bookId');

      if (!item) {
        return responseStructure({
          res,
          statusCode: 404,
          data: errMessages.LIBRARY_ITEM_NOT_FOUND,
        });
      }

      responseStructure({
        res,
        data: { msg: 'Library item updated', info: item },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const item = await UserBook.findOneAndDelete({
        _id: req.params.id,
        userId: req.user!.id,
      });

      if (!item) {
        return responseStructure({
          res,
          statusCode: 404,
          data: errMessages.LIBRARY_ITEM_NOT_FOUND,
        });
      }

      responseStructure({
        res,
        data: { msg: 'Removed from library' },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
