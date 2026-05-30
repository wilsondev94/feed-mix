import type { NextFunction, Request, Response } from "express";
import type { ExpressRequestWithAuth } from "@clerk/express";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const clerkReq = req as unknown as ExpressRequestWithAuth;
  if (!clerkReq.auth().isAuthenticated) {
    res.status(400).json({ message: "Unauthorized - you must be logged in" });
  }

  next();
};
