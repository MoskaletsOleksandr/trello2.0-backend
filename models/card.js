import { Schema, model } from 'mongoose';

const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'without'],
    },
    deadline: {
      type: String,
      required: true,
    },
    columnId: {
      type: String,
      required: true,
    },
    boardId: {
      type: String,
    },
    ownerId: {
      type: String,
    },
    order: {
      type: Number,
    },
  },
  { versionKey: false, timestamps: true }
);

const Card = model('card', cardSchema);

export default Card;
