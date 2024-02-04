import { Joi } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

interface IErrorWithStatusCode extends Error {
  statusCode?: number;
}

const errorMiddleware = (
  err: IErrorWithStatusCode,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if ('details' in err && err.details instanceof Map) {
    const validationError = err.details.values().next().value;

    if (validationError instanceof Joi.ValidationError) {
      const { message } = validationError;

      res.status(400).send({ status: 'error', message });
      return;
    }
  }

  const { statusCode = 500 } = err;
  const message = statusCode === 500 && !err.message ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ status: 'error', message });
};

export default errorMiddleware;
