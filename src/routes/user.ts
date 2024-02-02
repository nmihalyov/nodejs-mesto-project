import { celebrate, Joi } from 'celebrate';
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

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().email(),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
}), updateUserAvatar);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().required(),
  }),
}), getUserById);

export default router;
