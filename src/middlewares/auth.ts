import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

import AuthError from '../errors/auth';

interface IID {
  id: ObjectId;
}

export interface IRequestWithUserID extends Request {
  user?: IID;
}

const authMiddleware = (
  req: IRequestWithUserID,
  _: Response,
  next: NextFunction,
) => {
  const token = req.cookies.session_token;

  if (typeof token !== 'string' || !token) {
    throw new AuthError('Требуется авторизация');
  }

  const payload = jwt.verify(token, 'some-secret-key') as IID;

  req.user = payload;

  next();
};

export default authMiddleware;
