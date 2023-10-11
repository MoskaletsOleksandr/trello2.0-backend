import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import Column from '../models/column.js';

const getBoardColumns = async (req, res, next) => {
  const { id } = req.user;
  const { boardId } = req.params;

  //   const userColumns = await Column.find({ ownerId: id });
  //   const boardColumns = userColumns.map((column) => column.boardId === boardId);
  const boardColumns = await Column.find({ ownerId: id, boardId });
  boardColumns.sort((a, b) => a.order - b.order);

  res.status(200).json(boardColumns);
};

const createNewColumn = async (req, res, next) => {
  const { id } = req.user;
  const { title, boardId } = req.body;
  const normalizedTitle = title.trim();

  //   const userColumns = await Column.find({ ownerId: id });
  //   const boardColumns = userColumns.map((column) => column.boardId === boardId);
  const boardColumns = await Column.find({ ownerId: id, boardId });

  const column = boardColumns.find(
    (column) => column.title === normalizedTitle
  );
  if (column) {
    throw HttpError(
      409,
      'A column with the same title already exists on this board'
    );
  }

  const maxOrder = boardColumns.reduce((max, column) => {
    return column.order > max ? column.order : max;
  }, 0);

  const newColumn = await Column.create({
    title: normalizedTitle,
    boardId,
    ownerId: id,
    order: maxOrder + 1,
  });

  res.status(201).json(newColumn);
};

const updateColumnById = async (req, res, next) => {
  const { title, columnId } = req.body;
  const normalizedTitle = title.trim();

  const columnToUpdate = await Column.findById(columnId);

  if (!columnToUpdate) {
    throw HttpError(404, 'Column not found');
  }

  if (!title || normalizedTitle === columnToUpdate.title) {
    throw HttpError(400, 'No data to update');
  }

  const newTitle = normalizedTitle;
  const updatedColumn = await Column.findByIdAndUpdate(
    columnId,
    { title: newTitle },
    { new: true }
  );

  res.status(200).json(updatedColumn);
};

// const deleteBoardById = async (req, res, next) => {
//   const { boardId } = req.params;

//   const deletedBoard = await Board.findByIdAndDelete(boardId);
//   if (!deletedBoard) {
//     throw HttpError(404, 'Board not found');
//   }

//   res.status(204).json('No content');
// };

export default {
  getBoardColumns: ctrlWrapper(getBoardColumns),
  createNewColumn: ctrlWrapper(createNewColumn),
  updateColumnById: ctrlWrapper(updateColumnById),
  //   deleteBoardById: ctrlWrapper(deleteBoardById),
};
