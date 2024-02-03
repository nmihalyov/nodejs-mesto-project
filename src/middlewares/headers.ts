import { NextFunction, Request, Response } from 'express';

const headers = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Security-Policy', 'default-src self');
  next();
};

export default headers;
