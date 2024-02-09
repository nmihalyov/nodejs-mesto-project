import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthError } from '../errors';
import { getPrivateKey } from '../helpers';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.session_token;

    if (!token || typeof token !== 'string') {
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
  } catch (error) {
    throw new AuthError('Ошибка авторизации');
  }
};

export default authMiddleware;
