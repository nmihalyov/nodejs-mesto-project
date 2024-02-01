import { Router } from 'express';

import {
  getUserById,
  getUserProfile,
  getUsers,
  updateUser,
  updateUserAvatar,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUserProfile);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);
router.get('/:id', getUserById);

export default router;
