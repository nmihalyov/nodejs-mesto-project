import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';

import {
  addLikeToCard,
  createCard,
  deleteCard,
  getCards,
  removeLikeFromCard,
} from '../controllers/card';

const router = Router();

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .required(),
    link: Joi.string().uri().required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), addLikeToCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), removeLikeFromCard);

export default router;
