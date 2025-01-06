import express from 'express';
import { env } from './utils/env.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// import pino from 'pino-http';
// import pino from 'pino';
// import { pinoConfigs } from './config/pinoConfigs.js';

import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
// import { swaggerDocs } from './middlewares/swaggerDocs.js';
// import { UPLOAD_DIR } from './constans/index.js';
import * as fs from 'node:fs';
import path from 'node:path';
import swaggerUI from 'swagger-ui-express';

export const setupServer = () => {
  const PORT = Number(env('PORT', '3000'));

  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve('docs/swagger.json'), 'utf-8'),
  );
  const app = express();
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  app.use(cors());

  // app.use(pino(pinoConfigs));
  // const logger = pino();
  // app.use((req, res, next) => {
  //   logger.info(`${req.method} ${req.url}`);
  //   next();
  // });

  app.use(cookieParser());
  // app.use('/uploads', express.static(UPLOAD_DIR));
  // app.use('/api-docs', swaggerDocs());

  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
