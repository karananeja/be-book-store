import fs from 'fs';
import { ErrorRequestHandler } from 'express';
import { responseStructure } from '../utils/helpers';
import { errMessages } from '../utils/constants';

export const errorHandler: ErrorRequestHandler = (error, _, res, next) => {
  if (error) {
    process.chdir('src/logs');
    const filePath = './errorLogs.json';

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) throw err;

      const logs = JSON.parse(data);

      logs.push({
        time: new Date().toISOString(),
        message: `${error.name}: ${error.message}`,
        stack: error.stack,
      });

      fs.writeFile(
        filePath,
        JSON.stringify(logs, null, 2),
        { encoding: 'utf8' },
        () => console.log(`Error logged at ${new Date()}`)
      );
    });

    responseStructure({
      res,
      statusCode: 500,
      data: errMessages.INTERNAL_SERVER_ERROR,
    });
  } else {
    next();
  }
};
