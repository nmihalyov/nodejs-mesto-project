import { NextFunction, Request, Response } from 'express';

interface IErrorWithStatusCode extends Error {
  statusCode?: number;
}

const errorMiddleware = (
  err: IErrorWithStatusCode,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) => {
  const { statusCode = 500 } = err;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ status: 'error', message });
};

export default errorMiddleware;
