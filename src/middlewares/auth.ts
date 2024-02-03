import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

import AuthError from '../errors/auth';
import getPrivateKey from '../helpers/getPrivateKey';

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

  const privateKey = getPrivateKey();
  const payload = jwt.verify(token, privateKey) as IID;

  req.user = payload;

  next();
};

export default authMiddleware;
