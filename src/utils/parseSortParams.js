// import { SORT_ORDER } from '../constants/index.js';

function parseSortBy(value) {
  if (typeof value !== 'string') {
    return '_id';
  }
  const keys = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavorite',
    'contactType',
    'createdAt',
    'updatedAt',
  ];

  if (!keys.includes(value)) {
    return '_id';
  }

  return value;
}

function parseSortOrder(value) {
  if (typeof value !== 'string') {
    return 'asc';
  }

  if (!['asc', 'desc'].includes(value)) {
    return 'asc';
  }

  return value;
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
