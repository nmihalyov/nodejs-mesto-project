import { Router } from 'express';

import {
  getUserById,
  getUserProfile,
  getUsers,
  updateUser,
  updateUserAvatar,
  type IUserId,
} from '../controllers';
import { getUserByIdValidator, updateUserAvatarValidator, updateUserValidator } from '../validators';

const router = Router();

router.get('/', getUsers);

router.get('/me', getUserProfile);

router.patch('/me', updateUserValidator, updateUser);

router.patch('/me/avatar', updateUserAvatarValidator, updateUserAvatar);

router.get<IUserId>('/:id', getUserByIdValidator, getUserById);

export default router;
