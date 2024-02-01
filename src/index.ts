// Importing the required dependencies into the application
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { corsOptions, environment } from './utils/constants';
import { connectDB } from './mongodb/connect';
import { errorHandler } from './middlewares/errorMiddleware';
import booksRouter from './routes/books';

// Initializing the application
const app: Express = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// API endpoints
app.use('/api/v1/books', booksRouter);

// Setting up the port and database connection url
const port = environment.APP_PORT || 3000;
const mongoDbURI = `mongodb+srv://${environment.DB_USERNAME}:${environment.DB_PASSWORD}@books-store-cluster.ijpskzs.mongodb.net/${environment.DB_NAME}?retryWrites=true&w=majority`;

// Restrict all miscellaneous routes
app.get('*', (_: Request, res: Response) => res.status(404).send('Not found'));

// Global Error catch handler
app.use(errorHandler);

// Server started on the required port
app.listen(port, () => {
  console.log(`[server] The port is listening on ${port}`);
  // Connecting to the database
  connectDB(mongoDbURI);
});
