import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId, isValidObjectId } from 'mongoose';

import AuthError from '../errors/auth';
import ClientError from '../errors/client';
import NotFoundError from '../errors/notFound';
import { IRequestWithUserID } from '../middlewares/auth';
import User, { IUser } from '../models/user';

interface IUserId {
  id: ObjectId;
}

type TUpdateUserData = Partial<Pick<IUser, 'name' | 'about' | 'avatar' | 'email'>>;

const NOT_FOUND_TEXT = 'Запрашиваемый пользователь не найден';
const INCORRECT_DATA_TEXT = 'Некорректные данные';

export const createUser = async (
  req: Request<any, any, IUser>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    if (!name || !about || !avatar || !email || !password) {
      throw new ClientError(INCORRECT_DATA_TEXT);
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    res.status(201).send({ status: 'success', user });
  } catch (error) {
    if (error.code === 11000) {
      error.statusCode = 409;
      error.message = 'Пользователь с таким email уже существует';
    }

    next(error);
  }
};

export const loginUser = async (
  req: Request<any, any, Pick<IUser, 'email' | 'password'>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ClientError(INCORRECT_DATA_TEXT);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    const isSuccess = await bcrypt.compare(password, (user as Required<IUser>).password);

    if (!isSuccess) {
      throw new AuthError(INCORRECT_DATA_TEXT);
    }

    const { _id: id } = user;

    const token = jwt.sign({ id }, 'some-secret-key', { expiresIn: '7d' });

    user.password = undefined;

    res.cookie('session_token', token, { httpOnly: true });
    res.send({ status: 'success', user });
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

export const getUserProfile = async (
  req: IRequestWithUserID,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.user?.id;
    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    res.send({ status: 'success', user });
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
  req: Request<any, any, TUpdateUserData>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updateInfo = req.body;
    const id = (req as IRequestWithUserID).user?.id;

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

export const updateUserAvatar = async (
  req: Request<any, any, Pick<IUser, 'avatar'>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { avatar } = req.body;
    const id = (req as IRequestWithUserID).user?.id;

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
