import ctrlWrapper from '../decorators/ctrlWrapper.js';
import { getBoardCardsByOwnerAndBoard } from '../helpers/cardService.js';
import { getBoardColumnsByOwnerAndBoard } from '../helpers/columnService.js';
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
  const { boardId, columnId } = req.body;

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

// // ok
// const updateTask = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const { title, text, priority, deadline, boardId, columnId } = req.body;

//     const task = await Task.findById(taskId);
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }
//     const updateTask = await Task.findByIdAndUpdate(
//       taskId,
//       { ...req.body },
//       { new: true }
//     );
//     res.status(200).json(updateTask);
//   } catch (error) {
//     console.error(error);
//     return res.status(404).json({ message: error.message });
//   }
// };

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
};
