import { Response } from "express";
import Lesson from "../models/Lesson";
import Progress from "../models/Progress";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// GET all lessons for a language
export const getLessons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { language } = req.params;

    const lessons = await Lesson.find({ language, isPublished: true })
      .sort({ order: 1 })
      .select("-questions");

    const progress = await Progress.find({ userId: req.userId });

    const completedLessonIds = progress
      .filter(p => p.completed)
      .map(p => p.lessonId.toString());

    const lessonsWithProgress = lessons.map((lesson, index) => ({
      ...lesson.toObject(),
      isCompleted: completedLessonIds.includes(lesson._id.toString()),
      isLocked: index > 0 && !completedLessonIds.includes(lessons[index - 1]._id.toString()),
    }));

    res.status(200).json(lessonsWithProgress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// GET single lesson with questions
export const getLessonById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// POST complete a lesson
export const completeLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId, score } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    // check if already completed
    const existingProgress = await Progress.findOne({
      userId: req.userId,
      lessonId,
    });

    if (existingProgress) {
      res.status(400).json({ message: "Lesson already completed" });
      return;
    }

    // calculate XP earned
    const xpEarned = lesson.questions.reduce(
      (total, q) => total + q.xpReward, 0
    );

    // save progress
    await Progress.create({
      userId: req.userId,
      lessonId,
      completed: true,
      score,
      completedAt: new Date(),
    });

    // update user XP and streak
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $inc: { xp: xpEarned },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Lesson completed!",
      xpEarned,
      totalXp: user?.xp,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};