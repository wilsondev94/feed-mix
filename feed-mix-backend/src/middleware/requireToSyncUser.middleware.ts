import type { ExpressRequestWithAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

export const requireToSyncUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const clerkReq = req as unknown as ExpressRequestWithAuth;

  if (!clerkReq.auth().isAuthenticated) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
};
