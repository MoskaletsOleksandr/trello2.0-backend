import ctrlWrapper from '../decorators/ctrlWrapper.js';
import {
  deadlinePattern,
  getColomnCardsByOwnerAndColumn,
  getColomnCardsByOwnerAndColumnQuantity,
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
  const { newColumnId, newOrderInColumn } = req.body;
  let updatedColumns;

  const cardToUpdate = await Card.findById(cardId);
  if (!cardToUpdate) {
    throw HttpError(404, 'Card not found');
  }

  const oldColumnId = cardToUpdate.columnId;
  if (!newColumnId || !newOrderInColumn) {
    throw HttpError(400, 'No data to update');
  }

  const oldOrderInColumn = cardToUpdate.order;
  if (newColumnId === oldColumnId && newOrderInColumn === oldOrderInColumn) {
    throw HttpError(400, 'No data to update');
  }

  const oldColumnCardsQuantity = await getColomnCardsByOwnerAndColumnQuantity(
    id,
    oldColumnId
  );

  const newColumnCardsQuantity = await getColomnCardsByOwnerAndColumnQuantity(
    id,
    newColumnId
  );

  if (newColumnId === oldColumnId && newOrderInColumn === 'last') {
    if (oldOrderInColumn === oldColumnCardsQuantity) {
      throw HttpError(400, 'No data to update');
    }

    const oldColumnCardsToShift = await Card.find({
      columnId: oldColumnId,
      order: { $gt: oldOrderInColumn },
    });

    const cardToUpdateNewOrder = oldColumnCardsQuantity;
    await cardToUpdate.updateOne({
      order: cardToUpdateNewOrder,
    });

    await Promise.all(
      oldColumnCardsToShift.map(async (card) => {
        card.order = card.order - 1;
        await card.save();
      })
    );

    const oldColumnCards = await getColomnCardsByOwnerAndColumn(
      id,
      oldColumnId
    );

    updatedColumns = [oldColumnCards];
  }

  if (newColumnId === oldColumnId && newOrderInColumn !== 'last') {
    if (newOrderInColumn > oldColumnCardsQuantity) {
      throw HttpError(
        400,
        'New order is greater than the number of cards in the column'
      );
    }

    const range =
      oldOrderInColumn < newOrderInColumn
        ? { $gt: oldOrderInColumn, $lte: newOrderInColumn }
        : { $gte: newOrderInColumn, $lt: oldOrderInColumn };

    const cardsInRange = await Card.find({
      columnId: oldColumnId,
      order: range,
    });

    await cardToUpdate.updateOne({ order: newOrderInColumn });

    const updates = cardsInRange.map(async (card) => {
      if (oldOrderInColumn < newOrderInColumn) {
        card.order -= 1;
      } else {
        card.order += 1;
      }
      await card.save();
    });

    await Promise.all(updates);

    const oldColumnCards = await getColomnCardsByOwnerAndColumn(
      id,
      oldColumnId
    );

    updatedColumns = [oldColumnCards];
  }

  if (newColumnId !== oldColumnId && newOrderInColumn === 'last') {
    const oldColumnCardsToShift = await Card.find({
      columnId: oldColumnId,
      order: { $gt: oldOrderInColumn },
    });

    await Promise.all(
      oldColumnCardsToShift.map(async (card) => {
        card.order = card.order - 1;
        await card.save();
      })
    );

    const cardToUpdateNewOrder = newColumnCardsQuantity + 1;
    await cardToUpdate.updateOne({
      order: cardToUpdateNewOrder,
      columnId: newColumnId,
    });

    const oldColumnCards = await getColomnCardsByOwnerAndColumn(
      id,
      oldColumnId
    );
    const newColumnCards = await getColomnCardsByOwnerAndColumn(
      id,
      newColumnId
    );

    updatedColumns = [oldColumnCards, newColumnCards];
  }

  if (newColumnId !== oldColumnId && newOrderInColumn !== 'last') {
    if (newOrderInColumn > newColumnCardsQuantity) {
      throw HttpError(
        400,
        'New order is greater than the number of cards in the column'
      );
    }

    const oldColumnCardsToShift = await Card.find({
      columnId: oldColumnId,
      order: { $gt: oldOrderInColumn },
    });

    await Promise.all(
      oldColumnCardsToShift.map(async (card) => {
        card.order = card.order - 1;
        await card.save();
      })
    );

    const newColumnCardsToShift = await Card.find({
      columnId: newColumnId,
      order: { $gte: newOrderInColumn },
    });

    await Promise.all(
      newColumnCardsToShift.map(async (card) => {
        card.order = card.order + 1;
        await card.save();
      })
    );

    await cardToUpdate.updateOne({
      order: newOrderInColumn,
      columnId: newColumnId,
    });

    const oldColumnCards = await getColomnCardsByOwnerAndColumn(
      id,
      oldColumnId
    );
    const newColumnCards = await getColomnCardsByOwnerAndColumn(
      id,
      newColumnId
    );

    updatedColumns = [oldColumnCards, newColumnCards];
  }

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
