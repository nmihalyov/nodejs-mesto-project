import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';

import cardRoutes from './routes/card';
import userRoutes from './routes/user';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Временное решение авторизации
app.use((req: Request, _: Response, next: NextFunction) => {
  // @ts-ignore
  req.user = {
    _id: '65b6958baa2624dfaba2955d',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(Number(PORT), () => {
  console.log(`Server is listening on port ${PORT}`);
});
