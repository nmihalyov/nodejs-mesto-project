import mongoose, { ObjectId } from 'mongoose';
import { isURL } from 'validator';

export interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => isURL(value),
      message: 'Некорректный формат URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
  timestamps: true,
});

export default mongoose.model('card', cardSchema);
