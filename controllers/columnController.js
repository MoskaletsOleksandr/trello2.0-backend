import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import Column from '../models/column.js';

// винести в окрему функцію наступний код
//   const boardId = columnToUpdate.boardId;
//   const boardColumns = await Column.find({ ownerId: id, boardId });
// boardColumns.sort((a, b) => a.order - b.order);

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

// написати перевірку, які рахує кількість колонок на дошці і видає помилку, якщо новий порядковий номер
// більше, ніж кількість колонок
const moveColumnById = async (req, res, next) => {
  const { id } = req.user;
  const { columnId } = req.params;
  const { newOrder } = req.body;

  const columnToUpdate = await Column.findById(columnId);

  if (!columnToUpdate) {
    throw HttpError(404, 'Column not found');
  }

  if (!newOrder || newOrder === columnToUpdate.order) {
    throw HttpError(400, 'No data to update');
  }

  await columnToUpdate.updateOne({ order: newOrder });

  const boardId = columnToUpdate.boardId;
  const boardColumns = await Column.find({ ownerId: id, boardId });
  boardColumns.sort((a, b) => a.order - b.order);

  res.status(200).json(boardColumns);
};

const deleteColumnById = async (req, res, next) => {
  const { id } = req.user;
  const { columnId } = req.params;

  const deletedColumn = await Column.findByIdAndDelete(columnId);
  if (!deletedColumn) {
    throw HttpError(404, 'Column not found');
  }

  // Отримуємо всі наступні колонки, які мають більший порядковий номер
  const columnsToShift = await Column.find({
    order: { $gte: deletedColumn.order },
  });

  // Оновлюємо порядкові номери цих колонок
  // columnsToShift.forEach(async (column) => {
  //   column.order = column.order - 1;
  //   await column.save();
  // });
  await Promise.all(
    columnsToShift.map(async (column) => {
      column.order = column.order - 1;
      await column.save();
    })
  );

  const boardId = deletedColumn.boardId;
  const boardColumns = await Column.find({ ownerId: id, boardId });
  boardColumns.sort((a, b) => a.order - b.order);

  res.status(200).json(boardColumns);
};

export default {
  getBoardColumns: ctrlWrapper(getBoardColumns),
  createNewColumn: ctrlWrapper(createNewColumn),
  updateColumnById: ctrlWrapper(updateColumnById),
  moveColumnById: ctrlWrapper(moveColumnById),
  deleteColumnById: ctrlWrapper(deleteColumnById),
};
