import { Response } from "express";
import Progress from "../models/Progress";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";

export const getUserProgress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const progress = await Progress.find({ userId: req.userId })
      .populate("lessonId", "title language")
      .sort({ completedAt: -1 });

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getLeaderboard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find()
      .sort({ xp: -1 })
      .limit(10)
      .select("username xp streak");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};