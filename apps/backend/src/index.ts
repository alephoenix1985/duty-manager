import express, { Request, Response } from "express";
import cors from "cors";
import dutyController from "./controllers/duty.controller";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the backend!");
});

app.get("/duties", dutyController.getDuties);
app.get("/duties/:id", dutyController.getDutyById);
app.post("/duties", dutyController.createDuty);
app.put("/duties/:id", dutyController.updateDuty);
app.delete("/duties/:id", dutyController.deleteDuty);

export default app;
