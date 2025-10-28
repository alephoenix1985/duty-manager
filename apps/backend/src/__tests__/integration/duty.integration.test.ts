import request from "supertest";
import app from "../../index";
import pool from "../../db";

describe("Duty API Integration Tests", () => {
  beforeAll(async () => {
    await pool.query("TRUNCATE TABLE duties RESTART IDENTITY");
  });

  afterAll(async () => {
    await pool.end();
  });

  let dutyId: string;

  it("should create a new duty", async () => {
    const response = await request(app)
      .post("/duties")
      .send({ name: "Integration Test Duty" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Integration Test Duty");
    dutyId = response.body.id;
  });

  it("should get a list of duties", async () => {
    const response = await request(app).get("/duties");

    expect(response.status).toBe(200);
    expect(response.body.duties).toBeInstanceOf(Array);
    expect(response.body.duties.length).toBe(1);
    expect(response.body.duties[0].name).toBe("Integration Test Duty");
    expect(response.body.totalCount).toBe(1);
  });

  it("should get a specific duty by id", async () => {
    const response = await request(app).get(`/duties/${dutyId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(dutyId);
    expect(response.body.name).toBe("Integration Test Duty");
  });

  it("should update a duty", async () => {
    const response = await request(app)
      .put(`/duties/${dutyId}`)
      .send({ name: "Updated Integration Test Duty" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Integration Test Duty");
  });

  it("should delete a duty", async () => {
    const response = await request(app).delete(`/duties/${dutyId}`);

    expect(response.status).toBe(204);
  });

  it("should return 404 for a deleted duty", async () => {
    const response = await request(app).get(`/duties/${dutyId}`);

    expect(response.status).toBe(404);
  });

  it("should return 404 for a non-existent duty", async () => {
    const response = await request(app).get("/duties/999999");
    expect(response.status).toBe(404);
  });
});
