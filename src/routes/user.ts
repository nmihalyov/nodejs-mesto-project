import { Router } from 'express';

import {
  IUserId,
  getUserById,
  getUserProfile,
  getUsers,
  updateUser,
  updateUserAvatar,
} from '../controllers/user';
import { getUserByIdValidator, updateUserAvatarValidator, updateUserValidator } from '../validators/user';

const router = Router();

router.get('/', getUsers);

router.get('/me', getUserProfile);

router.patch('/me', updateUserValidator, updateUser);

router.patch('/me/avatar', updateUserAvatarValidator, updateUserAvatar);

router.get<IUserId>('/:id', getUserByIdValidator, getUserById);

export default router;
