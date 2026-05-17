export const CATALOG_PAGE_SIZE = 9;

export function getTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0) {
    return 1;
  }
  return Math.ceil(totalItems / pageSize);
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number
): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function clampPage(page: number, totalPages: number): number {
  if (totalPages < 1) {
    return 1;
  }
  return Math.min(Math.max(1, page), totalPages);
}
