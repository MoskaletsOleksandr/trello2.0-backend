import backgrounds from '../data/backgrounds/backgrounds.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import Board from '../models/board.js';
import Card from '../models/card.js';
import Column from '../models/column.js';

const getAllBoards = async (req, res, next) => {
  const { id } = req.user;
  const boards = await Board.find({ ownerId: id });
  res.status(200).json(boards);
};

const getBoardById = async (req, res, next) => {
  const { boardId } = req.params;
  const board = await Board.findById(boardId);

  if (!board) {
    throw HttpError(404, 'An error occurred. Board not found');
  }

  res.status(200).json(board);
};

const createNewBoard = async (req, res, next) => {
  const { id } = req.user;
  const { title, backgroundId } = req.body;
  const normalizedTitle = title.trim();

  const board = await Board.findOne({ title: normalizedTitle, ownerId: id });
  if (board) {
    throw HttpError(409, 'A board with the same title already exists');
  }

  const background =
    backgrounds.find((background) => background._id === backgroundId) || null;

  const newBoard = await Board.create({
    ...req.body,
    title: normalizedTitle,
    ownerId: `${id}`,
    background,
  });

  res.status(201).json(newBoard);
};

const updateBoardById = async (req, res, next) => {
  const { id } = req.user;
  const { boardId } = req.params;
  const { title, icon, backgroundId } = req.body;
  const normalizedTitle = title.trim();

  const currentBoard = await Board.findById(boardId);

  if (!currentBoard) {
    throw HttpError(404, 'An error occurred. Board not found');
  }

  const board = await Board.findOne({ title: normalizedTitle, ownerId: id });
  if (board) {
    throw HttpError(409, 'A board with the same title already exists');
  }

  const updatedFields = {};
  if (title && normalizedTitle !== currentBoard.title) {
    updatedFields.title = normalizedTitle;
  }
  if (icon && icon !== currentBoard.icon) {
    updatedFields.icon = icon;
  }
  if (backgroundId && backgroundId !== currentBoard.background?._id) {
    const newBackground =
      backgrounds.find((background) => background._id === backgroundId) || null;
    if (newBackground !== undefined) {
      updatedFields.background = newBackground;
    } else {
      throw HttpError(400, 'An error occurred. Invalid background ID');
    }
  }

  if (Object.keys(updatedFields).length === 0) {
    throw HttpError(400, 'No fields to update');
  }

  const updatedBoard = await Board.findByIdAndUpdate(boardId, updatedFields, {
    new: true,
  });

  res.status(200).json(updatedBoard);
};

const deleteBoardById = async (req, res, next) => {
  const { boardId } = req.params;

  const deletedBoard = await Board.findByIdAndDelete(boardId);
  if (!deletedBoard) {
    throw HttpError(404, 'An error occurred. Board not found');
  }

  await Column.deleteMany({ boardId });
  await Card.deleteMany({ boardId });

  res.status(204).json('No content');
};

const getBackgroundsPreviews = (req, res) => {
  const data = backgrounds.map((background) => ({
    _id: background._id,
    previewURL: background.previewURL,
  }));

  if (data.length === 0) {
    throw HttpError(404, 'An error occurred. Backgrounds not found');
  }

  res.status(200).json(data);
};

export default {
  getAllBoards: ctrlWrapper(getAllBoards),
  createNewBoard: ctrlWrapper(createNewBoard),
  getBoardById: ctrlWrapper(getBoardById),
  updateBoardById: ctrlWrapper(updateBoardById),
  deleteBoardById: ctrlWrapper(deleteBoardById),
  getBackgroundsPreviews: ctrlWrapper(getBackgroundsPreviews),
};
