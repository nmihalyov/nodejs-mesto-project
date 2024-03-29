import { celebrate, Joi } from 'celebrate';

import { type ICardId } from '../controllers';
import { isURL } from '../helpers';

export const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .required(),
    link: Joi.string().custom(isURL).required(),
  }),
});

export const deleteCardValidator = celebrate<ICardId>({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

export const addLikeToCardValidator = celebrate<ICardId>({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

export const removeLikeFromCardValidator = celebrate<ICardId>({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});
