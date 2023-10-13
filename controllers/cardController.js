import ctrlWrapper from '../decorators/ctrlWrapper.js';
import {
  deadlinePattern,
  getBoardCardsByOwnerAndBoard,
} from '../helpers/cardService.js';
import { getBoardColumnsByOwnerAndBoard } from '../helpers/columnService.js';
import HttpError from '../helpers/HttpError.js';
import Card from '../models/card.js';

const getBoardCards = async (req, res) => {
  const { id } = req.user;
  const { boardId } = req.params;

  const boardColumns = await getBoardColumnsByOwnerAndBoard(id, boardId);
  const boardCards = await Promise.all(
    boardColumns.map(async (column) => {
      const cards = await Card.find({
        ownerId: id,
        boardId,
        columnId: column._id,
      });
      cards.sort((a, b) => a.order - b.order);
      return {
        columnId: column._id,
        cards: cards,
      };
    })
  );

  res.status(200).json(boardCards);
};

const createNewCard = async (req, res) => {
  const { id } = req.user;
  const { boardId, columnId, deadline } = req.body;

  if (!deadline.match(deadlinePattern)) {
    throw HttpError(400, 'Invalid date');
  }

  const columnCards = await Card.find({ ownerId: id, boardId, columnId });
  const maxOrder = columnCards.reduce((max, card) => {
    return card.order > max ? card.order : max;
  }, 0);

  const newCard = await Card.create({
    ...req.body,
    ownerId: id,
    order: maxOrder + 1,
  });

  res.status(201).json(newCard);
};

const updateCardById = async (req, res) => {
  const { cardId } = req.params;
  const { title, text, priority, deadline, boardId, columnId } = req.body;
  const normalizedTitle = title.trim();

  const cardToUpdate = await Card.findById(cardId);

  if (!cardToUpdate) {
    throw HttpError(404, 'Card not found');
  }

  const updatedFields = {};
  if (title || normalizedTitle !== cardToUpdate.title) {
    updatedFields.title = normalizedTitle;
  }
  if (text && text !== cardToUpdate.text) {
    updatedFields.text = text;
  }
  if (priority && priority !== cardToUpdate.priority) {
    updatedFields.priority = priority;
  }
  if (
    deadline &&
    deadline !== cardToUpdate.deadline &&
    deadline.match(deadlinePattern)
  ) {
    updatedFields.deadline = deadline;
  }

  if (Object.keys(updatedFields).length === 0) {
    throw HttpError(400, 'No fields to update');
  }

  const updatedCard = await Card.findByIdAndUpdate(cardId, updatedFields, {
    new: true,
  });

  res.status(200).json(updatedCard);
};

const deleteCardById = async (req, res, next) => {
  const { id } = req.user;
  const { cardId } = req.params;

  const deletedCard = await Card.findByIdAndDelete(cardId);
  if (!deletedCard) {
    throw HttpError(404, 'Card not found');
  }

  // const columnsToShift = await Column.find({
  //   order: { $gte: deletedColumn.order },
  // });

  // await Promise.all(
  //   columnsToShift.map(async (column) => {
  //     column.order = column.order - 1;
  //     await column.save();
  //   })
  // );

  // const boardId = deletedColumn.boardId;
  // await Card.deleteMany({ columnId });
  // const boardColumns = await getBoardColumnsByOwnerAndBoard(id, boardId);

  // res.status(200).json(boardColumns);
};

// // ok
// const deleteTask = async (req, res) => {
//   try {
//     const { taskId } = req.params;

//     const task = await Task.findById(taskId);

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
//     await Task.findByIdAndDelete(taskId);

//     res.status(200).json(task);
//   } catch (error) {
//     return res.status(404).json({ message: error.message });
//   }
// };

// // ok
// const moveTask = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const { newColumnId } = req.body;

//     const task = await Task.findById(taskId);

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
//     const updateTask = await Task.findByIdAndUpdate(
//       taskId,
//       { columnId: newColumnId },
//       { new: true }
//     );

//     res.status(200).json(updateTask);
//   } catch (error) {
//     return res.status(404).json({ message: error.message });
//   }
// };

// // ok
// const getTasksByPriority = async (req, res) => {
//   try {
//     const { boardId, priority } = req.params;

//     const filteredTasks = await Task.find({ boardId, priority });

//     res.status(200).json(filteredTasks);
//   } catch (error) {
//     console.error(error);
//     return res.status(404).json({ message: error.message });
//   }
// };

export default {
  getBoardCards: ctrlWrapper(getBoardCards),
  createNewCard: ctrlWrapper(createNewCard),
  updateCardById: ctrlWrapper(updateCardById),
  deleteCardById: ctrlWrapper(deleteCardById),
};
