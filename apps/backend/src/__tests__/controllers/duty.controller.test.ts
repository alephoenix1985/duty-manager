import { Request, Response } from "express";
import dutyController from "../../controllers/duty.controller";
import dutyDao from "../../daos/duty.dao";
import { Duty } from "../../daos/duty.dao";

jest.mock("../../daos/duty.dao");

describe("Duty Controller", () => {
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn(() => ({
      json: jsonMock,
      send: sendMock,
    }));
    res = {
      status: statusMock,
    };
  });

  describe("getDuties", () => {
    it("should return a list of duties and a total count", async () => {
      const mockDuties: Duty[] = [
        { id: "1", name: "Test Duty 1" },
        { id: "2", name: "Test Duty 2" },
      ];
      const mockTotalCount = 2;
      (dutyDao.findAll as jest.Mock).mockResolvedValue({
        duties: mockDuties,
        totalCount: mockTotalCount,
      });

      const req = { query: { page: "1", limit: "10" } } as Partial<Request>;
      await dutyController.getDuties(req as Request, res as Response);

      expect(dutyDao.findAll).toHaveBeenCalledWith(
        { limit: 10, offset: 0 },
        { sortBy: "id", order: "ASC" },
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        duties: mockDuties,
        totalCount: mockTotalCount,
      });
    });

    it("should handle errors", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (dutyDao.findAll as jest.Mock).mockRejectedValue(new Error("DAO Error"));
      const req = { query: {} } as Partial<Request>;
      await dutyController.getDuties(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(sendMock).toHaveBeenCalledWith("Server error");

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getDutyById", () => {
    it("should return a single duty when found", async () => {
      const mockDuty: Duty = { id: "1", name: "Test Duty" };
      (dutyDao.findById as jest.Mock).mockResolvedValue(mockDuty);

      const req = { params: { id: "1" } } as Partial<Request>;
      await dutyController.getDutyById(req as Request, res as Response);

      expect(dutyDao.findById).toHaveBeenCalledWith("1");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockDuty);
    });

    it("should return 404 when duty is not found", async () => {
      (dutyDao.findById as jest.Mock).mockResolvedValue(null);
      const req = { params: { id: "999" } } as Partial<Request>;
      await dutyController.getDutyById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith("Duty not found");
    });
  });

  describe("createDuty", () => {
    it("should create a new duty and return it", async () => {
      const newDuty: Duty = { id: "1", name: "New Duty" };
      (dutyDao.create as jest.Mock).mockResolvedValue(newDuty);

      const req = { body: { name: "New Duty" } } as Partial<Request>;
      await dutyController.createDuty(req as Request, res as Response);

      expect(dutyDao.create).toHaveBeenCalledWith({ name: "New Duty" });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(newDuty);
    });

    it("should return 400 if name is not provided", async () => {
      const req = { body: {} } as Partial<Request>;
      await dutyController.createDuty(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith("Name is required");
    });
  });

  describe("updateDuty", () => {
    it("should update a duty and return it", async () => {
      const updatedDuty: Duty = { id: "1", name: "Updated Duty" };
      (dutyDao.update as jest.Mock).mockResolvedValue(updatedDuty);

      const req = {
        params: { id: "1" },
        body: { name: "Updated Duty" },
      } as Partial<Request>;
      await dutyController.updateDuty(req as Request, res as Response);

      expect(dutyDao.update).toHaveBeenCalledWith("1", {
        name: "Updated Duty",
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedDuty);
    });

    it("should return 404 if duty to update is not found", async () => {
      (dutyDao.update as jest.Mock).mockResolvedValue(null);
      const req = {
        params: { id: "999" },
        body: { name: "Non-existent" },
      } as Partial<Request>;
      await dutyController.updateDuty(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith("Duty not found");
    });
  });

  describe("deleteDuty", () => {
    it("should delete a duty and return 204", async () => {
      (dutyDao.remove as jest.Mock).mockResolvedValue(1);
      const req = { params: { id: "1" } } as Partial<Request>;
      await dutyController.deleteDuty(req as Request, res as Response);

      expect(dutyDao.remove).toHaveBeenCalledWith("1");
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it("should return 404 if duty to delete is not found", async () => {
      (dutyDao.remove as jest.Mock).mockResolvedValue(0);
      const req = { params: { id: "999" } } as Partial<Request>;
      await dutyController.deleteDuty(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith("Duty not found");
    });
  });
});
