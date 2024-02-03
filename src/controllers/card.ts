import escape from 'escape-html';
import { NextFunction, Request, Response } from 'express';
import { ObjectId, isValidObjectId } from 'mongoose';

import ClientError from '../errors/client';
import NotFoundError from '../errors/notFound';
import { IRequestWithUserID } from '../middlewares/auth';
import Card, { ICard } from '../models/card';

type TCreateCard = Pick<ICard, 'name' | 'link'>;

interface ICardId {
  cardId: ObjectId;
}

const NOT_FOUND_TEXT = 'Запрашиваемая карточка не найдена';
const INCORRECT_ID_TEXT = 'Некорректный ID карточки';

export const getCards = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});

    res.send({ status: 'success', cards });
  } catch (error) {
    next(error);
  }
};

export const createCard = async (
  req: Request<any, any, TCreateCard>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = (req as IRequestWithUserID).user?.id;
    const { name, link } = req.body;

    if (!name || !link) {
      throw new ClientError('Некорректные данные');
    }

    const card = await Card.create({
      name: escape(name),
      link: escape(link),
      owner: id,
    });

    res.status(201).send({ status: 'success', card });
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req: Request<ICardId>, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const id = (req as unknown as IRequestWithUserID).user?.id;

    if (!isValidObjectId(cardId)) {
      throw new ClientError(INCORRECT_ID_TEXT);
    }

    const result = await Card.deleteOne({ _id: cardId, owner: id });

    if (result.deletedCount === 0) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    res.send({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

export const addLikeToCard = async (req: Request<ICardId>, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;

    if (!isValidObjectId(cardId)) {
      throw new ClientError(INCORRECT_ID_TEXT);
    }

    const result = await Card.findByIdAndUpdate(cardId, {
      $addToSet: {
        likes: cardId,
      },
    }, {
      new: true,
      runValidators: true,
    });

    if (result === null) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    res.send({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

export const removeLikeFromCard = async (
  req: Request<ICardId>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;

    if (!isValidObjectId(cardId)) {
      throw new ClientError(INCORRECT_ID_TEXT);
    }

    const result = await Card.findByIdAndUpdate(cardId, {
      $pull: {
        likes: cardId,
      },
    }, {
      new: true,
      runValidators: true,
    });

    if (result === null) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    res.send({ status: 'success' });
  } catch (error) {
    next(error);
  }
};
