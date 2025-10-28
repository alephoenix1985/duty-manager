import { Request } from "express";
import { getPaginationParams, getSortParams } from "../../helpers/query.helper";

describe("Query Helper", () => {
  describe("getPaginationParams", () => {
    it("should return default values when no query params are provided", () => {
      const req = { query: {} } as Partial<Request>;
      const { limit, offset } = getPaginationParams(req as Request);
      expect(limit).toBe(10);
      expect(offset).toBe(0);
    });

    it("should parse page and limit from query params", () => {
      const req = { query: { page: "2", limit: "20" } } as Partial<Request>;
      const { limit, offset } = getPaginationParams(req as Request);
      expect(limit).toBe(20);
      expect(offset).toBe(20);
    });

    it("should use default values for non-numeric page and limit", () => {
      const req = { query: { page: "abc", limit: "xyz" } } as Partial<Request>;
      const { limit, offset } = getPaginationParams(req as Request);
      expect(limit).toBe(10);
      expect(offset).toBe(0);
    });

    it("should handle page 1 correctly", () => {
      const req = { query: { page: "1", limit: "50" } } as Partial<Request>;
      const { limit, offset } = getPaginationParams(req as Request);
      expect(limit).toBe(50);
      expect(offset).toBe(0);
    });
  });

  describe("getSortParams", () => {
    const allowedSortBy = ["id", "name", "createdAt"];
    const defaultSortBy = "createdAt";

    it("should return default sort params when no query params are provided", () => {
      const req = { query: {} } as Partial<Request>;
      const { sortBy, order } = getSortParams(
        req as Request,
        allowedSortBy,
        defaultSortBy,
      );
      expect(sortBy).toBe(defaultSortBy);
      expect(order).toBe("ASC");
    });

    it("should parse sortBy and order from query params", () => {
      const req = {
        query: { sortBy: "name", order: "desc" },
      } as Partial<Request>;
      const { sortBy, order } = getSortParams(
        req as Request,
        allowedSortBy,
        defaultSortBy,
      );
      expect(sortBy).toBe("name");
      expect(order).toBe("DESC");
    });

    it("should use default sortBy if the provided one is not allowed", () => {
      const req = {
        query: { sortBy: "invalidField", order: "desc" },
      } as Partial<Request>;
      const { sortBy, order } = getSortParams(
        req as Request,
        allowedSortBy,
        defaultSortBy,
      );
      expect(sortBy).toBe(defaultSortBy);
      expect(order).toBe("DESC");
    });

    it("should default to ASC for invalid order values", () => {
      const req = {
        query: { sortBy: "name", order: "invalidOrder" },
      } as Partial<Request>;
      const { sortBy, order } = getSortParams(
        req as Request,
        allowedSortBy,
        defaultSortBy,
      );
      expect(sortBy).toBe("name");
      expect(order).toBe("ASC");
    });

    it("should be case-insensitive for order", () => {
      const req = {
        query: { sortBy: "name", order: "DeSc" },
      } as Partial<Request>;
      const { sortBy, order } = getSortParams(
        req as Request,
        allowedSortBy,
        defaultSortBy,
      );
      expect(sortBy).toBe("name");
      expect(order).toBe("DESC");
    });
  });
});
