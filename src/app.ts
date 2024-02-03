// TODO: type narrowing
import { celebrate, Joi } from 'celebrate';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import path from 'path';

import { createUser, loginUser } from './controllers/user';
import auth from './middlewares/auth';
import errorMiddleware from './middlewares/error';
import { errorLogger, requestLogger } from './middlewares/logger';
import limiter from './middlewares/rateLimit';
import cardRoutes from './routes/card';
import userRoutes from './routes/user';

const { PORT = 3001 } = process.env;
const app = express();

app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
app.use(limiter);

mongoose.connect(process.env.DATABASE_URL || '');

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
