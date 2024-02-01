import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import { createUser, loginUser } from './controllers/user';
import auth from './middlewares/auth';
import errorMiddleware from './middlewares/error';
import cardRoutes from './routes/card';
import userRoutes from './routes/user';

const { PORT = 3001 } = process.env;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', createUser);
app.post('/signin', loginUser);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.use(errorMiddleware);

app.listen(Number(PORT), () => {
  console.log(`Server is listening on port ${PORT}`);
});
