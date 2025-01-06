import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

export const swaggerDocs = () => {
  try {
    const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
    console.log('path', SWAGGER_PATH);
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf-8'));
    return [swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    console.log(err);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
