import type { Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary.js";

export const getPosts: RequestHandler = asyncHandler(
  // @ts-expect-error unused parameter
  async (req: Request, res: Response) => {
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

export const getPost: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

export const getUserPosts: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

export const createPost: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const { content } = req.body;
    const imageFile = req.file;

    if (!content && !imageFile) {
      res.status(400).json({ error: "Post must contain either text or image" });
      return;
    }

    const user = await User.findOne({ clerkId: userId });
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
      content: content || "",
      image: imageUrl,
    });

    res.status(201).json({ post });
  },
);
