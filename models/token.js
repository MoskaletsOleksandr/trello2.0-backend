import { Schema, model } from 'mongoose';

const tokenSchema = new Schema({
  refreshToken: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Token = model('token', tokenSchema);

export default Token;
