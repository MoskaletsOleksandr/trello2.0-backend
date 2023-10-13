import Card from '../models/card.js';

export const getBoardCardsByOwnerAndBoard = async (ownerId, boardId) => {
  const boardColumns = await Card.find({ ownerId, boardId });
  boardColumns.sort((a, b) => a.order - b.order);
  return boardColumns;
};

export const deadlinePattern = /\d{4}-\d{2}-\d{2}/;

export const getColomnCardsByOwnerAndColumn = async (ownerId, columnId) => {
  const columnCards = await Card.find({ ownerId, columnId });
  columnCards.sort((a, b) => a.order - b.order);

  const columnCardsObject = {
    columnId,
    cards: columnCards,
  };
  return columnCardsObject;
};

export const getColomnCardsByOwnerAndColumnQuantity = async (
  ownerId,
  columnId
) => {
  const columnCards = await Card.find({ ownerId, columnId });
  const columnCardsQuantity = columnCards.length;
  return columnCardsQuantity;
};
