import express, { type Request, type Response } from "express";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";

const app = express();

connectDb();

app.get("/", (req: Request, res: Response) =>
  res.send(`Hello from server from port - ${ENV.PORT}`),
);

app.listen(ENV.PORT, () =>
  console.log(`Server is running on PORT:${ENV.PORT}`),
);
