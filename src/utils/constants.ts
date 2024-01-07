import { config } from 'dotenv';
import { EnvironmentTypes } from './types';
config();

const environment: EnvironmentTypes = {
  DB_PASSWORD: process.env.NODE_DB_PASSWORD,
  DB_NAME: process.env.NODE_DB_NAME,
  APP_PORT: process.env.NODE_APP_PORT,
};

export { environment };
