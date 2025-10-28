import { Request, Response } from "express";
import dutyDao from "../daos/duty.dao";
import { getPaginationParams, getSortParams } from "../helpers/query.helper";

/**
 * Gets all duties with pagination and sorting.
 * @param req The Express request object. Expected query parameters: page, limit, sortBy, order.
 * @param res The Express response object. Returns a list of duties and total count.
 */
const getDuties = async (req: Request, res: Response) => {
  try {
    const allowedSortBy = ["id", "name"];
    const pagination = getPaginationParams(req);
    const sort = getSortParams(req, allowedSortBy, "id");
    const { duties, totalCount } = await dutyDao.findAll(pagination, sort);
    res.status(200).json({ duties, totalCount });
  } catch (error) {
    console.error("Error getting duties:", error);
    res.status(500).send("Server error");
  }
};

/**
 * Gets a single duty by its ID.
 * @param req The Express request object. Expected URL parameter: id.
 * @param res The Express response object. Returns the duty or 404 if not found.
 */
const getDutyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const duty = await dutyDao.findById(id);
    if (!duty) {
      return res.status(404).send("Duty not found");
    }
    res.status(200).json(duty);
  } catch (error) {
    console.error(`Error getting duty ${id}:`, error);
    res.status(500).send("Server error");
  }
};

/**
 * Creates a new duty.
 * @param req The Express request object. Expected body: { name: string }.
 * @param res The Express response object. Returns the newly created duty.
 */
const createDuty = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Name is required");
  }

  try {
    const newDuty = await dutyDao.create({ name });
    res.status(201).json(newDuty);
  } catch (error) {
    console.error("Error creating duty:", error);
    res.status(500).send("Server error");
  }
};

/**
 * Updates an existing duty.
 * @param req The Express request object. Expected URL parameter: id. Expected body: { name: string }.
 * @param res The Express response object. Returns the updated duty or 404 if not found.
 */
const updateDuty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedDuty = await dutyDao.update(id, { name });
    if (!updatedDuty) {
      return res.status(404).send("Duty not found");
    }
    res.status(200).json(updatedDuty);
  } catch (error) {
    console.error(`Error updating duty ${id}:`, error);
    res.status(500).send("Server error");
  }
};

/**
 * Deletes a duty.
 * @param req The Express request object. Expected URL parameter: id.
 * @param res The Express response object. Returns 204 No Content or 404 if not found.
 */
const deleteDuty = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedCount = await dutyDao.remove(id);
    if (deletedCount === 0) {
      return res.status(404).send("Duty not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting duty ${id}:`, error);
    res.status(500).send("Server error");
  }
};

export default { getDuties, getDutyById, createDuty, updateDuty, deleteDuty };
