import { PaginationInput } from '../pagination/pagination.input';

export default function getPaginatedData(
  pagination: PaginationInput,
  idField = 'id'
) {
  return {
    cursor: {
      [idField]: pagination.cursor,
    },
    take: pagination.take,
  };
}
