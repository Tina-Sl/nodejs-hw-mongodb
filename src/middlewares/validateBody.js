import createHttpError from 'http-errors';

export function validateBody(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
      return;
    } catch (error) {
      const objectErrors = error.details.reduce((obj, item, index) => {
        let mess = item.message;
        if (mess !== undefined) {
          mess = mess.replace(/"/g, '');
          let objKey = 'err' + (index + 1);
          obj[objKey] = mess;
        }
        return obj;
      }, {});

      const httpError = createHttpError(
        400,
        'Field values in the request body are incorrect',
        {
          errors: objectErrors,
        },
      );

      next(httpError);
    }
  };
}
