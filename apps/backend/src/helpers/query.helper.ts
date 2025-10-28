import { Request } from "express";

/**
 * @typedef {object} PaginationParams
 * @property {number} limit - The maximum number of items to return.
 * @property {number} offset - The number of items to skip before starting to return results.
 */
export interface PaginationParams {
  limit: number;
  offset: number;
}

/**
 * Extracts pagination parameters from the request query.
 * @param req - The Express request object.
 * @param defaultLimit - The default limit if not provided in the query.
 * @param maxLimit - The maximum allowed limit.
 * @returns Pagination parameters.
 */
export const getPaginationParams = (
  req: Request,
  defaultLimit = 10,
  maxLimit = 100,
): PaginationParams => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(
    parseInt(req.query.limit as string, 10) || defaultLimit,
    maxLimit,
  );
  const offset = (page - 1) * limit;
  return { limit, offset };
};

/**
 * @typedef {object} SortParams
 * @property {string} sortBy - The field to sort by.
 * @property {string} order - The sort order ('ASC' or 'DESC').
 */
export interface SortParams {
  sortBy: string;
  order: "ASC" | "DESC";
}

/**
 * Extracts sorting parameters from the request query.
 * @param req - The Express request object.
 * @param allowedSortBy - An array of allowed fields to sort by.
 * @param defaultSortBy - The default field to sort by.
 * @param defaultOrder - The default sort order.
 * @returns Sorting parameters.
 */
export const getSortParams = (
  req: Request,
  allowedSortBy: string[],
  defaultSortBy: string,
  defaultOrder: "ASC" | "DESC" = "ASC",
): SortParams => {
  const sortBy = allowedSortBy.includes(req.query.sortBy as string)
    ? (req.query.sortBy as string)
    : defaultSortBy;
  const order =
    (req.query.order as string)?.toUpperCase() === "DESC" ? "DESC" : "ASC";
  return { sortBy, order };
};
