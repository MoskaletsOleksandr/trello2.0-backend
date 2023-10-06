import ctrlWrapper from '../decorators/ctrlWrapper.js';
import Board from '../models/board.js';

const getAllBoards = async (req, res, next) => {
  const { id } = req.user;
  const boards = await Board.find({ ownerId: id });
  res.status(200).json(boards);
};

const createNewBoard = async (req, res, next) => {
  const { id } = req.user;
  const { title } = req.body;

  const board = await Board.findOne({ title });
  if (board) {
    throw HttpError(409, 'A board with the same title already exists');
  }

  const newBoard = await Board.create({
    ...req.body,
    ownerId: `${id}`,
  });

  res.status(201).json(newBoard);
};

export default {
  getAllBoards: ctrlWrapper(getAllBoards),
  createNewBoard: ctrlWrapper(createNewBoard),
};

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const candidate = await User.findOne({ email });
  if (candidate) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  const payload = createPayload(newUser._id);
  const tokens = generateTokens(payload);
  await saveToken(newUser._id, tokens.refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.status(201).json({
    user: {
      id: newUser._id,
      name,
      email,
    },
    ...tokens,
  });
};
