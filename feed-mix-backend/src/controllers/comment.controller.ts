import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import mongoose from "mongoose";

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

  //   const comment = await Comment.create({
  //     user: user._id,
  //     post: postId,
  //     content,
  //   });

  //   // link the comment to the post
  //   await Post.findByIdAndUpdate(postId, {
  //     $push: { comments: comment._id },
  //   });

  //   // create notification if a user is not commenting on his/her own post
  //   if (post.user.toString() !== user._id.toString()) {
  //     await Notification.create({
  //       from: user._id,
  //       to: post.user,
  //       type: "comment",
  //       post: postId,
  //       comment: comment._id,
  //     });
  //   }

  //   res.status(201).json({ comment });

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const [comment] = await Comment.create(
        [{ user: user._id, post: postId, content }],
        { session },
      );

      await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment?._id } },
        { session },
      );

      if (post.user.toString() !== user._id.toString()) {
        await Notification.create(
          [
            {
              from: user._id,
              to: post.user,
              type: "comment",
              post: postId,
              comment: comment?._id,
            },
          ],
          { session },
        );
      }

      res.status(201).json({ comment });
    });
  } finally {
    await session.endSession();
  }
});

export const deleteComment: RequestHandler = asyncHandler(async (req, res) => {
  const user = req.user;
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!user || !comment) {
    res.status(404).json({ error: "User or comment not found" });
    return;
  }

  if (comment.user.toString() !== user._id.toString()) {
    res.status(403).json({ error: "You can only delete your own comments" });
    return;
  }

  //   // remove comment from post
  //   await Post.findByIdAndUpdate(comment.post, {
  //     $pull: { comments: commentId },
  //   });

  //   // delete the comment
  //   await Comment.findByIdAndDelete(commentId);

  //   await Notification.findByIdAndDelete({ comment: commentId });

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await Post.findByIdAndUpdate(
        comment.post,
        { $pull: { comments: commentId } },
        { session },
      );
      await Comment.findByIdAndDelete(commentId, { session });
      await Notification.deleteOne({ comment: commentId }, { session });
    });
  } finally {
    await session.endSession();
  }

  res.status(200).json({ message: "Comment deleted successfully" });
});
