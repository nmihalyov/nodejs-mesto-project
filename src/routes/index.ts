import { Router } from 'express';

import { createUser, loginUser } from '../controllers';
import { authMiddleware, nonExistentRouteMiddleware } from '../middlewares';
import { signInValidator, signUpValidator } from '../validators';

import cardRoutes from './card';
import userRoutes from './user';

const router = Router();

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signup', signUpValidator, createUser);
router.post('/signin', signInValidator, loginUser);

router.use(authMiddleware);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use(nonExistentRouteMiddleware);

export default router;
