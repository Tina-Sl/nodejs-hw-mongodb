import express from 'express';
import { env } from './utils/env.js';
import cors from 'cors';
import pino from 'pino-http';
import { pinoConfigs } from './config/pinoConfigs.js';
import { ContactsCollection } from './db/models/contacts.js';

export const setupServer = () => {
  const PORT = Number(env('PORT', '3000'));
  const app = express();
  app.use(cors());
  app.use(pino(pinoConfigs));

  app.get('/contacts', async (req, res) => {
    const contacts = await ContactsCollection.find();
    res.send({ status: 200, data: contacts });
    console.log('con', contacts);
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;

    const contact = await ContactsCollection.findById(id);

    if (contact === null) {
      return res
        .status(404)
        .send({ status: 404, message: 'Contact not found' });
    }
    res.send({ status: 200, data: contact });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send({ status: 500, message: 'Internal server error' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
