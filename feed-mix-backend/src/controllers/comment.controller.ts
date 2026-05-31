import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model.js";

export const getComments: RequestHandler = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture");

  res.status(200).json({ comments });
});
