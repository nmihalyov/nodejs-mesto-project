import { celebrate, Joi } from 'celebrate';

import { IUserId } from '../controllers/user';

export const signUpValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().alphanum().min(8).required(),
  }),
});

export const signInValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).required(),
  }),
});

export const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().email(),
  }),
});

export const updateUserAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
});

export const getUserByIdValidator = celebrate<IUserId>({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});
