import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';

import { createUser, loginUser } from './controllers/user';
import NotFoundError from './errors/notFound';
import auth from './middlewares/auth';
import errorMiddleware from './middlewares/error';
import { errorLogger, requestLogger } from './middlewares/logger';
import limiter from './middlewares/rateLimit';
import cardRoutes from './routes/card';
import userRoutes from './routes/user';
import { signInValidator, signUpValidator } from './validators/user';

const { PORT = 3001 } = process.env;
const app = express();

app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
app.use(limiter);

mongoose.connect(process.env.DATABASE_URL || '');

app.post('/signup', signUpValidator, createUser);
app.post('/signin', signInValidator, loginUser);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Несуществующий маршрут'));
});

app.use(errorLogger);
app.use(errorMiddleware);

app.listen(Number(PORT), () => {
  console.log(`Server is listening on port ${PORT}`);
});
