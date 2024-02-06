import escape from 'escape-html';
import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { ObjectId } from 'mongoose';

import { ForbiddenError, NotFoundError } from '../errors';
import { Card, type ICard } from '../models';

type TCreateCard = Pick<ICard, 'name' | 'link'>;

export interface ICardId {
  cardId: ObjectId;
}

const NOT_FOUND_TEXT = 'Запрашиваемая карточка не найдена';

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
    const id = req.user?.id;
    const { name, link } = req.body;

    const card = await Card.create({
      name: escape(name),
      link: escape(link),
      owner: id,
    });

    res.status(constants.HTTP_STATUS_CREATED).send({ status: 'success', card });
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req: Request<ICardId>, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const id = req.user?.id;

    const card = await Card.findOne({ _id: cardId });

    if (!card) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    if (card?.owner.toString() !== id) {
      throw new ForbiddenError('Доступ запрещен');
    }

    await card?.deleteOne();

    res.send({ status: 'success', card });
  } catch (error) {
    next(error);
  }
};

export const addLikeToCard = async (req: Request<ICardId>, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findByIdAndUpdate(cardId, {
      $addToSet: {
        likes: cardId,
      },
    }, {
      new: true,
    });

    if (card === null) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    res.send({ status: 'success', card });
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

    const card = await Card.findByIdAndUpdate(cardId, {
      $pull: {
        likes: cardId,
      },
    }, {
      new: true,
    });

    if (card === null) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    res.send({ status: 'success', card });
  } catch (error) {
    next(error);
  }
};
