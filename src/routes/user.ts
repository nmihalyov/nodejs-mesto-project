import { Router } from 'express';

import {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserAvatar,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

export default router;
