import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import jwt from 'jsonwebtoken';
import { Error, ObjectId } from 'mongoose';

import {
  AuthError,
  ClientError,
  ConflictError,
  NotFoundError,
} from '../errors';
import { escapeChars, getPrivateKey } from '../helpers';
import { User, type IUser } from '../models';

export interface IUserId {
  id: ObjectId;
}

type TUpdateUserDataOld = Partial<Pick<IUser, 'name' | 'about'>>;
type TUpdateUserData = Partial<Pick<IUser, 'name' | 'about' | 'avatar'>>;

const NOT_FOUND_TEXT = 'Запрашиваемый пользователь не найден';
const INCORRECT_ID_TEXT = 'Некорректный формат ID';
const INCORRECT_DATA_TEXT = 'Некорректные данные';

const getUserData = async (
  id: ObjectId | string | undefined,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(id).orFail(new NotFoundError(NOT_FOUND_TEXT));

    res.send({ status: 'success', user });
  } catch (error) {
    if (error instanceof Error.CastError) {
      next(new ClientError(INCORRECT_ID_TEXT));
      return;
    }

    next(error);
  }
};

const updateUserData = async (
  id: ObjectId | string | undefined,
  data: TUpdateUserData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const escapedData = escapeChars(data);

    const user = await User.findByIdAndUpdate(id, escapedData, {
      new: true,
      runValidators: true,
    }).orFail(new NotFoundError(NOT_FOUND_TEXT));

    res.send({ status: 'success', user });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      next(new ClientError(error.message));
      return;
    }

    next(error);
  }
};

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

    const hash = await bcrypt.hash(password, 10);
    const escapedData = escapeChars({
      name,
      about,
      avatar,
      email,
    });

    const user = await User.create({
      ...escapedData,
      password: hash,
    });

    res.status(constants.HTTP_STATUS_CREATED).send({ status: 'success', user });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      next(new ClientError(error.message));
      return;
    }

    if (error.code === 11000) {
      next(new ConflictError('Пользователь с таким E-mail уже существует'));
      return;
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

    const user = await User.findOne({ email })
      .orFail(new AuthError(INCORRECT_DATA_TEXT))
      .select('+password');

    const isSuccess = await bcrypt.compare(password, user.password);

    if (!isSuccess) {
      throw new AuthError(INCORRECT_DATA_TEXT);
    }

    const { _id: id } = user;
    const privateKey = getPrivateKey();
    const token = jwt.sign({ id }, privateKey, { expiresIn: '7d' });
    const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 7;

    (user as Partial<IUser>).password = undefined;

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
  getUserData(req.user?.id || '', res, next);
};

export const getUserById = async (req: Request<IUserId>, res: Response, next: NextFunction) => {
  getUserData(req.params.id, res, next);
};

export const updateUser = async (
  req: Request<any, any, TUpdateUserDataOld>,
  res: Response,
  next: NextFunction,
) => {
  updateUserData(req.user?.id, req.body, res, next);
};

export const updateUserAvatar = async (
  req: Request<any, any, Pick<IUser, 'avatar'>>,
  res: Response,
  next: NextFunction,
) => {
  updateUserData(req.user?.id, req.body, res, next);
};
