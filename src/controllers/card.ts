import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';

import Card, { ICard } from '../models/card';

type TCreateCard = Pick<ICard, 'name' | 'link'>;

interface ICardId {
  cardId: ObjectId;
}

export const getCards = async (_: Request, res: Response) => {
  try {
    const cards = await Card.find({});

    res.send(cards);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const createCard = async (req: Request<any, any, TCreateCard>, res: Response) => {
  try {
    // @ts-ignore
    const { _id } = req.user;
    const { name, link } = req.body;

    const card = await Card.create({ name, link, owner: _id });

    res.status(201).send(card);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const deleteCard = async (req: Request<ICardId>, res: Response) => {
  try {
    const { cardId } = req.params;

    const result = await Card.deleteOne({ _id: cardId });

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
