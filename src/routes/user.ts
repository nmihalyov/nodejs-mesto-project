import { Router } from 'express';

import {
  createUser,
  getUserById,
  getUsers,
  loginUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.post('/signup', createUser);
router.post('/signin', loginUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);
router.get('/:id', getUserById);

export default router;
