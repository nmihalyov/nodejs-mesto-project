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
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLikeToCard);
router.delete('/:cardId/likes', removeLikeFromCard);

export default router;
