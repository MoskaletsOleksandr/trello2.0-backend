import express from 'express';
import logger from 'morgan';
import userRouter from './routes/userRouter.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import boardsRouter from './routes/boardRouter.js';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'https://moskaletsoleksandr.github.io'],
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/users', userRouter);
app.use('/boards', boardsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export default app;
