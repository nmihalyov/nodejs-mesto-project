import bcrypt from 'bcryptjs';
import escape from 'escape-html';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId, isValidObjectId } from 'mongoose';

import AuthError from '../errors/auth';
import ClientError from '../errors/client';
import NotFoundError from '../errors/notFound';
import getPrivateKey from '../helpers/getPrivateKey';
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
      name: escape(name),
      about: escape(about),
      avatar: escape(avatar),
      email: escape(email),
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

    if (!user || !user.password) {
      throw new NotFoundError(NOT_FOUND_TEXT);
    }

    const isSuccess = await bcrypt.compare(password, user.password);

    if (!isSuccess) {
      throw new AuthError(INCORRECT_DATA_TEXT);
    }

    const { _id: id } = user;
    const privateKey = getPrivateKey();
    const token = jwt.sign({ id }, privateKey, { expiresIn: '7d' });
    const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 7;

    user.password = undefined;

    res.cookie('session_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: DAY_IN_MILLISECONDS,
    });
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

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
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
    const id = req.user?.id;

    if (!updateInfo || Object.keys(updateInfo).length === 0) {
      throw new ClientError(INCORRECT_DATA_TEXT);
    }

    const data: Record<string, string> = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(updateInfo)) {
      data[key] = escape(value);
    }

    const user = await User.findByIdAndUpdate(id, data, {
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
    const id = req.user?.id;

    if (!avatar) {
      throw new ClientError(INCORRECT_DATA_TEXT);
    }

    const user = await User.findByIdAndUpdate(id, {
      avatar: escape(avatar),
    }, {
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
