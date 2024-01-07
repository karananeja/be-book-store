import { NextFunction, Request, Response, Router } from 'express';
import { checkBookDetails } from '../middlewares/booksMiddleware';
import { errMessages } from '../src/utils/constants';
import { Book } from '../models/bookModel';
import { responseStructure } from '../src/utils/helpers';

const router = Router();

router.post(
  '/books',
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
        data: {
          msg: 'Book Created!',
          info: { id: String(book._id), title: body.title },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
