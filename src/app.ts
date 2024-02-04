import cookieParser from 'cookie-parser';
import 'dotenv/config';
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

const { PORT = 3001 } = process.env;
const app = express();

app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
app.use(rateLimiter);

mongoose.connect(process.env.DATABASE_URL || '');

app.use('/', rootRouter);

app.use(errorLogger);
app.use(errorMiddleware);

app.listen(Number(PORT), () => {
  console.log(`Server is listening on port ${PORT}`);
});
