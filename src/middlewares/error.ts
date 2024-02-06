import { Joi } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';

interface IErrorWithStatusCode extends Error {
  statusCode?: number;
}

const { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_BAD_REQUEST } = constants;

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

      res.status(HTTP_STATUS_BAD_REQUEST).send({ status: 'error', message });
      return;
    }
  }

  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR } = err;
  const message = statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR && !err.message
    ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ status: 'error', message });
};

export default errorMiddleware;
