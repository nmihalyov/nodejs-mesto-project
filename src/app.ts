import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import userRoutes from './routes/user';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', userRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(Number(PORT), () => {
  console.log(`Server is listening on port ${PORT}`);
});
