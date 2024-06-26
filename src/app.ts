import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';

import {
  errorLogger,
  errorMiddleware,
  rateLimiter,
  requestLogger,
} from './middlewares';
import rootRouter from './routes';

dotenv.config({ path: `.env${process.env.NODE_ENV === 'dev' ? '.dev' : ''}` });

const { SERVER_PORT = 3001, DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(cors({
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: '*',
}));

app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
app.use(rateLimiter);

mongoose.connect(DATABASE_URL);

app.use('/', rootRouter);

app.use(errorLogger);
app.use(errorMiddleware);

app.listen(Number(SERVER_PORT), () => {
  console.log(`Server is listening on port ${SERVER_PORT}`);
});
