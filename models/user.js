import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'violet'],
      default: 'dark',
    },
    currentBoardId: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model('user', userSchema);

export default User;
