import { NextFunction, Request, Response } from 'express';

import { NotFoundError } from '../errors';

const nonExistentRouteMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Несуществующий маршрут'));
};

export default nonExistentRouteMiddleware;
