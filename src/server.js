import express from 'express';
import { env } from './utils/env.js';
import cors from 'cors';
import pino from 'pino-http';
import { pinoConfigs } from './config/pinoConfigs.js';

export const setupServer = () => {
  const PORT = Number(env('PORT', '3000'));
  const app = express();
  app.use(cors());
  app.use(pino(pinoConfigs));


  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
