import { NextFunction, Request, Response } from 'express';

interface IErrorWithStatusCode extends Error {
  statusCode?: number;
}

interface ValidationError {
  details: {
    message: string;
  }[];
}

const handleValidationError = (error: any): string | null => {
  const details = error.details as Map<string, ValidationError>;

  if (details) {
    return [...details.values()][0].details[0].message;
  }

  return null;
};

const errorMiddleware = (
  err: IErrorWithStatusCode,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const validationError = handleValidationError(err);

  if (validationError) {
    res.status(400).send({ status: 'error', message: validationError });
  } else {
    const { statusCode = 500 } = err;
    const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

    res.status(statusCode).send({ status: 'error', message });
  }
};

export default errorMiddleware;
