import { Schema, model } from 'mongoose';

const tokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deviceId: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Token = model('token', tokenSchema);

export default Token;
