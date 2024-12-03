import express from 'express';
import { env } from './utils/env.js';
import cors from 'cors';
// import pino from 'pino-http';
// import pino from 'pino';
// import { pinoConfigs } from './config/pinoConfigs.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
  const PORT = Number(env('PORT', '3000'));

  const app = express();

  app.use(cors());

  // app.use(pino(pinoConfigs));
  // const logger = pino();
  // app.use((req, res, next) => {
  //   logger.info(`${req.method} ${req.url}`);
  //   next();
  // });

  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
