import { Schema, model } from 'mongoose';

const columnSchema = new Schema(
  {
    title: {
      type: String,
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

const Column = model('column', columnSchema);

export default Column;
