import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import Column from '../models/column.js';

const getBoardColumns = async (req, res, next) => {
  const { id } = req.user;
  const { boardId } = req.params;

  //   const userColumns = await Column.find({ ownerId: id });
  //   const boardColumns = userColumns.map((column) => column.boardId === boardId);
  const boardColumns = await Column.find({ ownerId: id, boardId });

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

// const updateBoardById = async (req, res, next) => {
//   const { boardId } = req.params;
//   const { title, icon, backgroundId } = req.body;
//   const normalizedTitle = title.trim();

//   const currentBoard = await Board.findById(boardId);

//   if (!currentBoard) {
//     throw HttpError(404, 'Board not found');
//   }

//   const updatedFields = {};
//   if (title && normalizedTitle !== currentBoard.title) {
//     updatedFields.title = normalizedTitle;
//   }
//   if (icon && icon !== currentBoard.icon) {
//     updatedFields.icon = icon;
//   }
//   if (backgroundId && backgroundId !== currentBoard.background?._id) {
//     const newBackground =
//       backgrounds.find((background) => background._id === backgroundId) || null;
//     if (newBackground !== undefined) {
//       updatedFields.background = newBackground;
//     } else {
//       throw HttpError(400, 'Invalid background ID');
//     }
//   }

//   if (Object.keys(updatedFields).length === 0) {
//     return res.status(400).json({ message: 'No fields to update' });
//   }

//   const updatedBoard = await Board.findByIdAndUpdate(boardId, updatedFields, {
//     new: true,
//   });

//   res.status(200).json(updatedBoard);
// };

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
  //   updateBoardById: ctrlWrapper(updateBoardById),
  //   deleteBoardById: ctrlWrapper(deleteBoardById),
};
