import { Request, Response } from 'express';
import { ObjectId, isValidObjectId } from 'mongoose';

import User, { IUser } from '../models/user';

interface IUserId {
  id: ObjectId;
}

export const createUser = async (req: Request<any, any, IUser>, res: Response) => {
  try {
    const { name, about, avatar } = req.body;

    const user = await User.create({
      name,
      about,
      avatar,
    });

    if (!name || !about || !avatar) {
      res.status(400).send({ status: 'error', message: 'Некорректные данные' });
      return;
    }

    res.status(201).send({ status: 'success', user });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};

export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find({});

    res.send({ status: 'success', users });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};

export const getUserById = async (req: Request<IUserId>, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!isValidObjectId(id)) {
      res.status(400).send({ status: 'error', message: 'Некорректный ID пользователя' });
      return;
    }

    if (!user) {
      res.status(404).send({ status: 'error', message: 'Запрашиваемый пользователь не найден' });
      return;
    }

    res.send({ status: 'success', user });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};

export const updateUser = async (req: Request<any, any, Partial<IUser>>, res: Response) => {
  try {
    const updateInfo = req.body;
    // @ts-ignore
    const { _id: id } = req.user;

    const user = await User.findByIdAndUpdate(id, updateInfo, {
      new: true,
      runValidators: true,
    });

    if (!updateInfo || Object.keys(updateInfo).length === 0) {
      res.status(400).send({ status: 'error', message: 'Некорректные данные' });
      return;
    }

    if (!user) {
      res.status(404).send({ status: 'error', message: 'Запрашиваемый пользователь не найден' });
      return;
    }

    res.send({ status: 'success', user });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};

export const updateUserAvatar = async (req: Request<any, any, Pick<IUser, 'avatar'>>, res: Response) => {
  try {
    const { avatar } = req.body;
    // @ts-ignore
    const { _id: id } = req.user;

    const user = await User.findByIdAndUpdate(id, { avatar }, {
      new: true,
      runValidators: true,
    });

    if (!avatar) {
      res.status(400).send({ status: 'error', message: 'Некорректные данные' });
      return;
    }

    if (!user) {
      res.status(404).send({ status: 'error', message: 'Запрашиваемый пользователь не найден' });
      return;
    }

    res.send({ status: 'success', user });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
};
