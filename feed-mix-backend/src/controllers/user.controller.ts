import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import type { Request, RequestHandler, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";

export const getUserProfile: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  },
);

export const createUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    // check if user already exists in mongodb
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
      res
        .status(200)
        .json({ user: existingUser, message: "User already exists" });
      return;
    }

    // create new user from Clerk data
    const clerkUser = await clerkClient.users.getUser(userId);

    const userData = {
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      username: clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] ?? "",
      profilePicture: clerkUser.imageUrl,
    };

    // Create user in database
    const user = await User.create(userData);

    res.status(201).json({ user, message: "User created successfully" });
  },
);

export const updateProfile: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);

    const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, {
      new: true,
    });

    if (!user) {
      res.status(404).json({ error: "User not found fgsffh" });
      return;
    }

    res.status(200).json({ user });
  },
);

export const getCurrentUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  },
);
