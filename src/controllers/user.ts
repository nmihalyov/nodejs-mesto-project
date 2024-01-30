import { NextFunction, Request, Response } from 'express';
import { ObjectId, isValidObjectId } from 'mongoose';

import ClientError from '../errors/client';
import NotFoundError from '../errors/notFound';
import User, { IUser } from '../models/user';

interface IUserId {
  id: ObjectId;
}

const NOT_FOUND_TEXT = 'Запрашиваемый пользователь не найден';
const INCORRECT_DATA_TEXT = 'Некорректные данные';

export const createUser = async (
  req: Request<any, any, IUser>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, about, avatar } = req.body;

    if (!name || !about || !avatar) {
      throw new ClientError(INCORRECT_DATA_TEXT);
    }

    const user = await User.create({
      name,
      about,
      avatar,
    });

    res.status(201).send({ status: 'success', user });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});

    res.send({ status: 'success', users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request<IUserId>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new ClientError('Некорректный ID пользователя');
    }

    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    res.send({ status: 'success', user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request<any, any, Partial<IUser>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updateInfo = req.body;
    // @ts-ignore
    const { _id: id } = req.user;

    if (!updateInfo || Object.keys(updateInfo).length === 0) {
      throw new ClientError(INCORRECT_DATA_TEXT);
    }

    const user = await User.findByIdAndUpdate(id, updateInfo, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    res.send({ status: 'success', user });
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar = async (req: Request<any, any, Pick<IUser, 'avatar'>>, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    // @ts-ignore
    const { _id: id } = req.user;

    if (!avatar) {
      throw new ClientError(INCORRECT_DATA_TEXT);
    }

    const user = await User.findByIdAndUpdate(id, { avatar }, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    res.send({ status: 'success', user });
  } catch (error) {
    next(error);
  }
};
