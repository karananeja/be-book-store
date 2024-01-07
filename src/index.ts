// Importing the required dependencies into the application
import express, { Express, Request, Response } from 'express';
import { environment } from './utils/constants';

// Initializing the application
const app: Express = express();

// Setting up the port and database connection url
const port = environment.APP_PORT || 3000;

// Restrict all miscellaneous routes
app.get('*', (_: Request, res: Response) => res.status(404).send('Not found'));

// Server started on the required port
app.listen(port, () =>
  console.log(`[server]: The port is listening on ${port}`)
);
