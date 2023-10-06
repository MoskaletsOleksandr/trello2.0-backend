import { Schema, model } from 'mongoose';

const boardSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    icon: {
      type: String,
    },
    background: {
      type: Object,
    },
    ownerId: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const Board = model('board', boardSchema);

export default Board;
