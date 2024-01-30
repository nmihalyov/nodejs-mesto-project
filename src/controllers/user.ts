import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';

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

    res.status(201).send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getUserById = async (req: Request<IUserId>, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      res.send(user);
    } else {
      res.status(500).send({ error: 'No user with such ID was found' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
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

    if (user) {
      res.send(user);
    } else {
      res.status(500).send({ error: 'No user with such ID was found' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
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

    if (user) {
      res.send(user);
    } else {
      res.status(500).send({ error: 'No user with such ID was found' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
