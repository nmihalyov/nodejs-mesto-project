import { Request, Response } from 'express';
import { ObjectId, isValidObjectId } from 'mongoose';

import Card, { ICard } from '../models/card';

type TCreateCard = Pick<ICard, 'name' | 'link'>;

interface ICardId {
  cardId: ObjectId;
}

export const getCards = async (_: Request, res: Response) => {
  try {
    const cards = await Card.find({});

    res.send({ status: 'success', cards });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};

export const createCard = async (req: Request<any, any, TCreateCard>, res: Response) => {
  try {
    // @ts-ignore
    const { _id } = req.user;
    const { name, link } = req.body;

    const card = await Card.create({ name, link, owner: _id });

    if (!name || !link) {
      res.status(400).send({ status: 'error', message: 'Некорректные данные' });
      return;
    }

    res.status(201).send({ status: 'success', card });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};

export const deleteCard = async (req: Request<ICardId>, res: Response) => {
  try {
    const { cardId } = req.params;

    const result = await Card.deleteOne({ _id: cardId });

    if (!isValidObjectId(cardId)) {
      res.status(400).send({ status: 'error', message: 'Некорректный ID карточки' });
      return;
    }

    if (result.deletedCount === 0) {
      res.status(404).send({ status: 'error', message: 'Запрашиваемая карточка не найдена' });
      return;
    }

    res.send({ status: 'success' });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};

export const addLikeToCard = async (req: Request<ICardId>, res: Response) => {
  try {
    const { cardId } = req.params;

    const result = await Card.findByIdAndUpdate(cardId, {
      $addToSet: {
        likes: cardId,
      },
    }, {
      new: true,
      runValidators: true,
    });

    if (!isValidObjectId(cardId)) {
      res.status(400).send({ status: 'error', message: 'Некорректный ID карточки' });
      return;
    }

    if (result === null) {
      res.status(404).send({ status: 'error', message: 'Запрашиваемая карточка не найдена' });
      return;
    }

    res.send({ status: 'success' });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};

export const removeLikeFromCard = async (req: Request<ICardId>, res: Response) => {
  try {
    const { cardId } = req.params;

    const result = await Card.findByIdAndUpdate(cardId, {
      $pull: {
        likes: cardId,
      },
    }, {
      new: true,
      runValidators: true,
    });

    if (!isValidObjectId(cardId)) {
      res.status(400).send({ status: 'error', message: 'Некорректный ID карточки' });
      return;
    }

    if (result === null) {
      res.status(404).send({ status: 'error', message: 'Запрашиваемая карточка не найдена' });
      return;
    }

    res.send({ status: 'success' });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};
