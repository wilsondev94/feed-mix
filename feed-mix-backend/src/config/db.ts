import mongoose from "mongoose";
import { ENV } from "./env.js";
import dns from "dns";

if (process.env.NODE_ENV === "development") {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

export const connectDb = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI ?? "");
    console.log("Connected to DB successfully!");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
