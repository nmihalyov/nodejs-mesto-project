import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error, ObjectId } from 'mongoose';

import { ClientError, ForbiddenError, NotFoundError } from '../errors';
import { escapeChars } from '../helpers';
import { Card, type ICard } from '../models';

type TCreateCard = Pick<ICard, 'name' | 'link'>;

type TAction = '$pull' | '$addToSet';

type TUpdateCardData = Partial<Record<TAction, {
  likes?: string | ObjectId;
}>>;

export interface ICardId {
  cardId: ObjectId;
}

const NOT_FOUND_TEXT = 'Запрашиваемая карточка не найдена';
const INCORRECT_ID_TEXT = 'Некорректный формат ID';

const updateCard = async (
  id: ObjectId,
  data: TUpdateCardData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findByIdAndUpdate(id, data, {
      new: true,
    }).orFail(new NotFoundError(NOT_FOUND_TEXT));

    res.send({ status: 'success', card });
  } catch (error) {
    if (error instanceof Error.CastError) {
      next(new ClientError(INCORRECT_ID_TEXT));
      return;
    }

    next(error);
  }
};

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
    const escapedData = escapeChars({
      name,
      link,
    });

    const card = await Card.create({
      ...escapedData,
      owner: id,
    });

    res.status(constants.HTTP_STATUS_CREATED).send({ status: 'success', card });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      next(new ClientError(error.message));
      return;
    }

    next(error);
  }
};

export const deleteCard = async (req: Request<ICardId>, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const id = req.user?.id;

    const card = await Card.findOne({ _id: cardId }).orFail(new NotFoundError(NOT_FOUND_TEXT));

    if (card.owner.toString() !== id) {
      throw new ForbiddenError('Доступ запрещен');
    }

    await card.deleteOne();

    res.send({ status: 'success', card });
  } catch (error) {
    if (error instanceof Error.CastError) {
      next(new ClientError(INCORRECT_ID_TEXT));
      return;
    }

    next(error);
  }
};

export const addLikeToCard = async (req: Request<ICardId>, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const data: TUpdateCardData = {
    $addToSet: {
      likes: userId,
    },
  };

  updateCard(req.params.cardId, data, res, next);
};

export const removeLikeFromCard = async (
  req: Request<ICardId>,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  const data: TUpdateCardData = {
    $pull: {
      likes: userId,
    },
  };

  updateCard(req.params.cardId, data, res, next);
};
