import { Router } from 'express';

import {
  ICardId,
  addLikeToCard,
  createCard,
  deleteCard,
  getCards,
  removeLikeFromCard,
} from '../controllers/card';
import {
  addLikeToCardValidator,
  createCardValidator,
  deleteCardValidator,
  removeLikeFromCardValidator,
} from '../validators/card';

const router = Router();

router.get('/', getCards);

router.post('/', createCardValidator, createCard);

router.delete<ICardId>('/:cardId', deleteCardValidator, deleteCard);

router.put<ICardId>('/:cardId/likes', addLikeToCardValidator, addLikeToCard);

router.delete<ICardId>('/:cardId/likes', removeLikeFromCardValidator, removeLikeFromCard);

export default router;
