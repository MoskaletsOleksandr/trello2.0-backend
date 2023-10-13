import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { getBoardColumnsByOwnerAndBoard } from '../helpers/columnService.js';
import HttpError from '../helpers/HttpError.js';
import Card from '../models/card.js';
import Column from '../models/column.js';

const getBoardColumns = async (req, res, next) => {
  const { id } = req.user;
  const { boardId } = req.params;

  const boardColumns = await getBoardColumnsByOwnerAndBoard(id, boardId);

  res.status(200).json(boardColumns);
};

const createNewColumn = async (req, res, next) => {
  const { id } = req.user;
  const { title, boardId } = req.body;
  const normalizedTitle = title.trim();

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
  const { columnId } = req.params;
  const { title } = req.body;
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

const moveColumnById = async (req, res, next) => {
  const { id } = req.user;
  const { columnId } = req.params;
  const { oldOrder, newOrder } = req.body;

  const columnToUpdate = await Column.findById(columnId);

  if (!columnToUpdate) {
    throw HttpError(404, 'Column not found');
  }

  if (!newOrder || newOrder === columnToUpdate.order) {
    throw HttpError(400, 'No data to update');
  }

  const boardId = columnToUpdate.boardId;
  const boardColumnsCount = await Column.countDocuments({
    ownerId: id,
    boardId,
  });

  if (newOrder > boardColumnsCount) {
    throw HttpError(
      400,
      'New order is greater than the number of columns on the board'
    );
  }

  const range =
    oldOrder < newOrder
      ? { $gt: oldOrder, $lte: newOrder }
      : { $gte: newOrder, $lt: oldOrder };

  const columnsInRange = await Column.find({
    boardId,
    order: range,
  });

  await columnToUpdate.updateOne({ order: newOrder });

  const updates = columnsInRange.map(async (column) => {
    if (oldOrder < newOrder) {
      column.order -= 1;
    } else {
      column.order += 1;
    }
    await column.save();
  });

  await Promise.all(updates);

  const boardColumns = await getBoardColumnsByOwnerAndBoard(id, boardId);

  res.status(200).json(boardColumns);
};

const deleteColumnById = async (req, res, next) => {
  const { id } = req.user;
  const { columnId } = req.params;

  const deletedColumn = await Column.findByIdAndDelete(columnId);
  if (!deletedColumn) {
    throw HttpError(404, 'Column not found');
  }
  const boardId = deletedColumn.boardId;

  const columnsToShift = await Column.find({
    boardId,
    order: { $gt: deletedColumn.order },
  });

  await Promise.all(
    columnsToShift.map(async (column) => {
      column.order = column.order - 1;
      await column.save();
    })
  );

  await Card.deleteMany({ columnId });
  const boardColumns = await getBoardColumnsByOwnerAndBoard(id, boardId);

  res.status(200).json(boardColumns);
};

export default {
  getBoardColumns: ctrlWrapper(getBoardColumns),
  createNewColumn: ctrlWrapper(createNewColumn),
  updateColumnById: ctrlWrapper(updateColumnById),
  moveColumnById: ctrlWrapper(moveColumnById),
  deleteColumnById: ctrlWrapper(deleteColumnById),
};
