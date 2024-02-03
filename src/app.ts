import { celebrate, Joi } from 'celebrate';
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import { createUser, loginUser } from './controllers/user';
import auth from './middlewares/auth';
import errorMiddleware from './middlewares/error';
import headers from './middlewares/headers';
import { errorLogger, requestLogger } from './middlewares/logger';
import cardRoutes from './routes/card';
import userRoutes from './routes/user';

const { PORT = 3001 } = process.env;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(headers);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).required(),
  }),
}), loginUser);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.use(errorLogger);
app.use(errorMiddleware);

app.listen(Number(PORT), () => {
  console.log(`Server is listening on port ${PORT}`);
});
