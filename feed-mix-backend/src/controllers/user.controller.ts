import { clerkClient, type ExpressRequestWithAuth } from "@clerk/express";
import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// RequestHandler annotation required on exports, so that asyncHandler's inferred return type references non-portable internal Express paths
export const getUserProfile: RequestHandler = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(200).json({ user });
});

export const createUser: RequestHandler = asyncHandler(async (req, res) => {
  const clerkReq = req as unknown as ExpressRequestWithAuth;
  const { userId } = clerkReq.auth();

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
  const clerkUser = await clerkClient.users.getUser(userId.toString());

  const userData = {
    clerkId: userId,
    email: clerkUser.emailAddresses[0]?.emailAddress,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    username: clerkUser.emailAddresses[0]?.emailAddress.split("@")[0],
    profilePicture: clerkUser.imageUrl,
  };

  // Create user in database
  const user = await User.create(userData);

  res.status(201).json({ user, message: "User created successfully" });
});

export const updateProfile: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, {
    new: true,
  });

  if (!user) {
    res.status(404).json({ error: "User not found fgsffh" });
    return;
  }

  res.status(200).json({ user });
});

export const getCurrentUser: RequestHandler = asyncHandler(async (req, res) => {
  const user = req.user;
  // const user = await User.findOne({ clerkId: userId });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(200).json({ user });
});

export const followUser: RequestHandler = asyncHandler(async (req, res) => {
  const currentUser = req.user;
  const targetUserId = req.params.targetUserId as string;

  if (currentUser?._id.toString() === targetUserId) {
    res.status(400).json({ error: "You cannot follow yourself" });
    return;
  }

  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const targetObjectId = new mongoose.Types.ObjectId(targetUserId);

  const isFollowing = currentUser.following.includes(targetObjectId);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: currentUser._id },
    });

    // create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });
  }

  res.status(200).json({
    message: isFollowing
      ? "User unfollowed successfully"
      : "User followed successfully",
  });
});
