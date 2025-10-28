import pool from "../db";
import { v4 as uuidv4 } from "uuid";
import { PaginationParams, SortParams } from "../helpers/query.helper";

export interface Duty {
  id: string;
  name: string;
}

const findAll = async (
  pagination: PaginationParams = { limit: 10, offset: 0 },
  sort: SortParams = { sortBy: "id", order: "ASC" },
): Promise<{ duties: Duty[]; totalCount: number }> => {
  const { limit, offset } = pagination;
  const { sortBy, order } = sort;

  const countQuery = "SELECT COUNT(*) FROM duties";
  const { rows: countRows } = await pool.query<{ count: string }>(countQuery);
  const totalCount = parseInt(countRows[0].count, 10);

  const query = `SELECT * FROM duties ORDER BY ${sortBy} ${order} LIMIT $1 OFFSET $2`;
  const { rows } = await pool.query<Duty>(query, [limit, offset]);

  return { duties: rows, totalCount };
};

const findById = async (id: string): Promise<Duty | null> => {
  const { rows } = await pool.query<Duty>(
    "SELECT * FROM duties WHERE id = $1",
    [id],
  );
  return rows[0] || null;
};

const create = async (dutyData: Pick<Duty, "name">): Promise<Duty> => {
  const newDuty: Duty = {
    id: uuidv4(),
    name: dutyData.name,
  };
  await pool.query("INSERT INTO duties (id, name) VALUES ($1, $2)", [
    newDuty.id,
    newDuty.name,
  ]);
  return newDuty;
};

const update = async (
  id: string,
  dutyData: Partial<Omit<Duty, "id">>,
): Promise<Duty | null> => {
  const { name } = dutyData;
  const { rows } = await pool.query<Duty>(
    "UPDATE duties SET name = $1 WHERE id = $2 RETURNING *",
    [name, id],
  );
  return rows[0] || null;
};

const remove = async (id: string): Promise<number> => {
  const result = await pool.query("DELETE FROM duties WHERE id = $1", [id]);
  return result.rowCount ?? 0;
};

export default {
  findAll,
  findById,
  create,
  update,
  remove,
};
