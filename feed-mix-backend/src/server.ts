import express, { type Request, type Response } from "express";
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());

// @ts-expect-error unused parameter
app.get("/", (req: Request, res: Response) =>
  res.send(`Hello from server from port - ${ENV.PORT}`),
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

const startServer = async () => {
  try {
    await connectDb();

    // listen for local development
    if (ENV.NODE_ENV === "development") {
      app.listen(ENV.PORT, () =>
        console.log("Server is up and running on PORT:", ENV.PORT),
      );
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
