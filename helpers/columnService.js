import Column from '../models/column.js';

export const getBoardColumnsByOwnerAndBoard = async (ownerId, boardId) => {
  const boardColumns = await Column.find({ ownerId, boardId });
  boardColumns.sort((a, b) => a.order - b.order);
  return boardColumns;
};
