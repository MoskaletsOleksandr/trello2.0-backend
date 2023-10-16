import ctrlWrapper from '../decorators/ctrlWrapper.js';
import {
  deadlinePattern,
  getColomnCardsByOwnerAndColumn,
  getColomnCardsByOwnerAndColumnQuantity,
} from '../helpers/cardService.js';
import { getBoardColumnsByOwnerAndBoard } from '../helpers/columnService.js';
import HttpError from '../helpers/HttpError.js';
import Card from '../models/card.js';
import Column from '../models/column.js';

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
  if (title && normalizedTitle !== cardToUpdate.title) {
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

const moveCardById = async (req, res, next) => {
  const { id } = req.user;
  const { cardId } = req.params;
  const { newColumnId } = req.body;

  const cardToUpdate = await Card.findById(cardId);
  if (!cardToUpdate) {
    throw HttpError(404, 'Card not found');
  }

  const oldColumnId = cardToUpdate.columnId;
  if (!newColumnId || newColumnId === oldColumnId) {
    throw HttpError(400, 'No data to update');
  }

  const newColumn = await Column.findById(newColumnId);
  if (!newColumn) {
    throw HttpError(404, 'The target column does not exist');
  }

  const oldColumnCardsToShift = await Card.find({
    columnId: oldColumnId,
    order: { $gt: cardToUpdate.order },
  });

  const newColumnCardsQuantity = await getColomnCardsByOwnerAndColumnQuantity(
    id,
    newColumnId
  );
  const cardToUpdateNewOrder = newColumnCardsQuantity + 1;
  await cardToUpdate.updateOne({
    columnId: newColumnId,
    order: cardToUpdateNewOrder,
  });

  await Promise.all(
    oldColumnCardsToShift.map(async (card) => {
      card.order = card.order - 1;
      await card.save();
    })
  );

  const oldColumnCards = await getColomnCardsByOwnerAndColumn(id, oldColumnId);
  const newColumnCards = await getColomnCardsByOwnerAndColumn(id, newColumnId);

  const updatedColumns = [oldColumnCards, newColumnCards];

  res.status(200).json(updatedColumns);
};

const deleteCardById = async (req, res, next) => {
  const { id } = req.user;
  const { cardId } = req.params;

  const deletedCard = await Card.findByIdAndDelete(cardId);
  if (!deletedCard) {
    throw HttpError(404, 'Card not found');
  }

  const columnId = deletedCard.columnId;

  const cardsToShift = await Card.find({
    columnId,
    order: { $gt: deletedCard.order },
  });

  await Promise.all(
    cardsToShift.map(async (card) => {
      card.order = card.order - 1;
      await card.save();
    })
  );

  const columnCards = await getColomnCardsByOwnerAndColumn(id, columnId);

  res.status(200).json(columnCards);
};

export default {
  getBoardCards: ctrlWrapper(getBoardCards),
  createNewCard: ctrlWrapper(createNewCard),
  updateCardById: ctrlWrapper(updateCardById),
  moveCardById: ctrlWrapper(moveCardById),
  deleteCardById: ctrlWrapper(deleteCardById),
};
