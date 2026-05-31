import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

export const getPosts: RequestHandler = asyncHandler(
  // @ts-expect-error unused parameter
  async (req, res) => {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username firstName lastName profilePicture",
        },
      });

    res.status(200).json({ posts });
  },
);

export const getPost: RequestHandler = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.status(200).json({ post });
});

export const getUserPosts: RequestHandler = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  res.status(200).json({ posts });
});

export const createPost: RequestHandler<{}, {}, { content: string }> =
  asyncHandler(async (req, res) => {
    const user = req.user;
    const { content } = req.body;
    const imageFile = req.file;

    if (!content && !imageFile) {
      res.status(400).json({ error: "Post must contain either text or image" });
      return;
    }

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    let imageUrl = "";

    // upload image to Cloudinary if provided
    if (imageFile) {
      try {
        // convert buffer to base64 for cloudinary
        const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString(
          "base64",
        )}`;

        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
          folder: "social_media_posts",
          resource_type: "image",
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto" },
            { format: "auto" },
          ],
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        res.status(400).json({ error: "Failed to upload image" });
        return;
      }
    }

    const post = await Post.create({
      user: user._id,
      content: content ?? "",
      image: imageUrl,
    });

    res.status(201).json({ post });
  });

export const likePost: RequestHandler = asyncHandler(async (req, res) => {
  const user = req.user;
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!user || !post) {
    res.status(404).json({ error: "User or post not found" });
    return;
  }

  const isLiked = post.likes.includes(user._id);

  if (isLiked) {
    // unlike
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: user._id },
    });
  } else {
    // like
    await Post.findByIdAndUpdate(postId, {
      $push: { likes: user._id },
    });

    // create notification if a user is not liking his/her own post
    if (post.user.toString() !== user._id.toString()) {
      await Notification.create({
        from: user._id,
        to: post.user,
        type: "like",
        post: postId,
      });
    }
  }

  res.status(200).json({
    message: isLiked ? "Post unliked successfully" : "Post liked successfully",
  });
});

export const deletePost: RequestHandler = asyncHandler(async (req, res) => {
  const user = req.user;
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!user || !post) {
    res.status(404).json({ error: "User or post not found" });
    return;
  }

  if (post.user.toString() !== user._id.toString()) {
    res.status(403).json({ error: "You can only delete your own posts" });
    return;
  }

  // delete all comments on this post
  await Comment.deleteMany({ post: postId });

  // delete the post
  await Post.findByIdAndDelete(postId);

  res.status(200).json({ message: "Post deleted successfully" });
});
