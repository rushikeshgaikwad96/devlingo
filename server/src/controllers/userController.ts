import { Response } from "express";
import Progress from "../models/Progress";
import { AuthRequest } from "../middleware/authMiddleware";

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