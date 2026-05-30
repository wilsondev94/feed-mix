import dotenv from "dotenv";

dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const ENV = {
  PORT: process.env.PORT ?? "5000",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  CLERK_PUBLISHABLE_KEY: requireEnv("CLERK_PUBLISHABLE_KEY"),
  CLERK_SECRET_KEY: requireEnv("CLERK_SECRET_KEY"),
  ARCJET_ENV: process.env.ARCJET_ENV ?? "development",
  ARCJET_KEY: requireEnv("ARCJET_KEY"),
  CLOUDINARY_CLOUD_NAME: requireEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),
  MONGO_URI: requireEnv("MONGO_URI"),
};
