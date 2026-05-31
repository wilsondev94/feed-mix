import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import Notification from "../models/notification.model.js";

export const getNotifications: RequestHandler = asyncHandler(
  async (req, res) => {
    const user = req.user;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const notifications = await Notification.find({ to: user._id })
      .sort({ createdAt: -1 })
      .populate("from", "username firstName lastName profilePicture")
      .populate("post", "content image")
      .populate("comment", "content");

    res.status(200).json({ notifications });
  },
);

export const deleteNotification: RequestHandler = asyncHandler(
  async (req, res) => {
    const user = req.user;
    const { notificationId } = req.params;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      to: user._id,
    });

    if (!notification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  },
);
