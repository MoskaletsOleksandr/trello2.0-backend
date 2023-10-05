import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import cookieParser from 'cookie-parser';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/users', userRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export default app;
