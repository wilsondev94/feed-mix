import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

export const getComments: RequestHandler = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture");

  res.status(200).json({ comments });
});

export const createComment: RequestHandler = asyncHandler(async (req, res) => {
  const user = req.user;
  const { postId } = req.params;
  const { content } = req.body as { content: string };

  if (!content || content.trim() === "") {
    res.status(400).json({ error: "Comment content is required" });
    return;
  }

  const post = await Post.findById(postId);

  if (!user || !post) {
    res.status(404).json({ error: "User or post not found" });
    return;
  }

  const comment = await Comment.create({
    user: user._id,
    post: postId,
    content,
  });

  // link the comment to the post
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
  });

  // create notification if a user is not commenting on his/her own post
  if (post.user.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "comment",
      post: postId,
      comment: comment._id,
    });
  }

  res.status(201).json({ comment });
});
