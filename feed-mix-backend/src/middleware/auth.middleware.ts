import type { NextFunction, Request, Response } from "express";
import type { ExpressRequestWithAuth } from "@clerk/express";
import User from "../models/user.model.js";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const clerkReq = req as unknown as ExpressRequestWithAuth;
  if (!clerkReq.auth().isAuthenticated) {
    res.status(400).json({ message: "Unauthorized - you must be logged in" });
    return;
  }

  const { userId } = clerkReq.auth();
  const user = await User.findOne({ clerkId: userId })
    .select(
      "_id username profilePicture firstName lastName bannerImage bio location createdAt followers following",
    )
    .lean();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  req.user = user;

  next();
};
