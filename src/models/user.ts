import mongoose from 'mongoose';
import { isEmail, isURL } from 'validator';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => isURL(value),
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => isEmail(value),
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
}, {
  versionKey: false,
  timestamps: true,
});

export default mongoose.model('user', userSchema);
