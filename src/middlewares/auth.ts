import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthError } from '../errors';
import getPrivateKey from '../helpers/getPrivateKey';

const authMiddleware = (req: Request, _: Response, next: NextFunction) => {
  const token = req.cookies.session_token;

  if (typeof token !== 'string' || !token) {
    throw new AuthError('Требуется авторизация');
  }

  const privateKey = getPrivateKey();
  const payload = jwt.verify(token, privateKey);

  if (typeof payload !== 'string') {
    req.user = {
      id: payload.id || '',
    };
  }

  next();
};

export default authMiddleware;
