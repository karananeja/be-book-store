import { NextFunction, Request, Response, Router } from 'express';
import { checkBookDetails } from '../middlewares/books-middleware';
import { authenticate, requireAdmin } from '../middlewares/auth-middleware';
import { errMessages } from '../utils/constants';
import { Book } from '../models/book-model';
import { UserBook } from '../models/user-book-model';
import { responseStructure } from '../utils/helpers';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireAdmin,
  (req, res, next) => checkBookDetails(req, res, next, errMessages.BAD_REQUEST),
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    const newBook = {
      title: body.title,
      author: body.author,
      publishYear: body.publishYear,
    };

    try {
      const book = await Book.create(newBook);
      responseStructure({
        res,
        statusCode: 201,
        data: { msg: 'Book Created!', info: book },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', async (_: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find();
    responseStructure({
      res,
      data: { msg: 'Fetched all the books', info: books },
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:bookId',
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    try {
      const book = await Book.findById(bookId);
      const statusCode = book ? 200 : 404;
      const data = book
        ? { msg: 'Fetched the book details', info: book }
        : errMessages.BOOK_NOT_FOUND;
      responseStructure({ res, statusCode, data });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:bookId',
  requireAdmin,
  (req, res, next) => checkBookDetails(req, res, next, errMessages.BAD_REQUEST),
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    try {
      const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
        new: true,
      });

      const statusCode = updatedBook ? 200 : 404;
      const data = updatedBook
        ? { msg: 'Updated the Book details', info: updatedBook }
        : errMessages.BOOK_NOT_FOUND;
      responseStructure({ res, statusCode, data });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:bookId',
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    try {
      const deletedBook = await Book.findByIdAndDelete(bookId);
      if (!deletedBook) {
        return responseStructure({
          res,
          statusCode: 404,
          data: errMessages.BOOK_NOT_FOUND,
        });
      }

      await UserBook.deleteMany({ bookId });

      responseStructure({
        res,
        data: { msg: 'Deleted the book' },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
