import dutyDao, { Duty } from "../../daos/duty.dao";
import pool from "../../db";

jest.mock("../../db", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

jest.mock("uuid", () => ({
  v4: () => "mock-uuid",
}));

describe("Duty DAO", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return duties and total count", async () => {
      const mockDuties: Duty[] = [{ id: "1", name: "Test Duty" }];
      const mockCount = { count: "1" };
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockCount] })
        .mockResolvedValueOnce({ rows: mockDuties });

      const result = await dutyDao.findAll();

      expect(pool.query).toHaveBeenCalledWith("SELECT COUNT(*) FROM duties");
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM duties ORDER BY id ASC LIMIT $1 OFFSET $2",
        [10, 0],
      );
      expect(result).toEqual({ duties: mockDuties, totalCount: 1 });
    });
  });

  describe("findById", () => {
    it("should return a duty if found", async () => {
      const mockDuty: Duty = { id: "1", name: "Test Duty" };
      (pool.query as jest.Mock).mockResolvedValue({ rows: [mockDuty] });

      const result = await dutyDao.findById("1");

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM duties WHERE id = $1",
        ["1"],
      );
      expect(result).toEqual(mockDuty);
    });

    it("should return null if not found", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await dutyDao.findById("999");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new duty and return it", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const newDutyData = { name: "New Duty" };
      const result = await dutyDao.create(newDutyData);

      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO duties (id, name) VALUES ($1, $2)",
        ["mock-uuid", "New Duty"],
      );
      expect(result).toEqual({ id: "mock-uuid", name: "New Duty" });
    });
  });

  describe("update", () => {
    it("should update a duty and return it", async () => {
      const updatedDuty: Duty = { id: "1", name: "Updated Duty" };
      (pool.query as jest.Mock).mockResolvedValue({ rows: [updatedDuty] });

      const result = await dutyDao.update("1", { name: "Updated Duty" });

      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE duties SET name = $1 WHERE id = $2 RETURNING *",
        ["Updated Duty", "1"],
      );
      expect(result).toEqual(updatedDuty);
    });
  });

  describe("remove", () => {
    it("should delete a duty and return the row count", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });

      const result = await dutyDao.remove("1");

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM duties WHERE id = $1",
        ["1"],
      );
      expect(result).toBe(1);
    });
  });
});
