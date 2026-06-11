"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeLesson = exports.getLessonById = exports.getLessons = void 0;
const Lesson_1 = __importDefault(require("../models/Lesson"));
const Progress_1 = __importDefault(require("../models/Progress"));
const User_1 = __importDefault(require("../models/User"));
// GET all lessons for a language
const getLessons = async (req, res) => {
    try {
        const { language } = req.params;
        // Update user's last language if authenticated
        if (req.userId) {
            await User_1.default.findByIdAndUpdate(req.userId, { $set: { lastLanguage: language } });
        }
        const lessons = await Lesson_1.default.find({ language, isPublished: true })
            .sort({ order: 1 })
            .select("-questions");
        const progress = req.userId ? await Progress_1.default.find({ userId: req.userId }) : [];
        const completedLessonIds = progress
            .filter(p => p.completed)
            .map(p => p.lessonId.toString());
        const lessonsWithProgress = lessons.map((lesson, index) => ({
            ...lesson.toObject(),
            isCompleted: completedLessonIds.includes(lesson._id.toString()),
            isLocked: req.userId
                ? (index > 0 && !completedLessonIds.includes(lessons[index - 1]._id.toString()))
                : false, // Unlock all lessons for public exploration!
        }));
        res.status(200).json(lessonsWithProgress);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getLessons = getLessons;
// GET single lesson with questions
const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson_1.default.findById(req.params.id);
        if (!lesson) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }
        res.status(200).json(lesson);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getLessonById = getLessonById;
// POST complete a lesson
const completeLesson = async (req, res) => {
    try {
        const { lessonId, score } = req.body;
        const lesson = await Lesson_1.default.findById(lessonId);
        if (!lesson) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }
        // check if already completed
        const existingProgress = await Progress_1.default.findOne({
            userId: req.userId,
            lessonId,
        });
        if (existingProgress) {
            res.status(400).json({ message: "Lesson already completed" });
            return;
        }
        // calculate XP
        const xpEarned = lesson.questions.reduce((total, q) => total + q.xpReward, 0);
        // save progress
        await Progress_1.default.create({
            userId: req.userId,
            lessonId,
            completed: true,
            score,
            xpEarned,
            completedAt: new Date(),
        });
        // --- STREAK LOGIC ---
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        // find last completed lesson before today
        const lastProgress = await Progress_1.default.findOne({
            userId: req.userId,
            completed: true,
            completedAt: { $lt: today },
        }).sort({ completedAt: -1 });
        let newStreak = 1; // default start
        if (lastProgress) {
            const lastDate = new Date(lastProgress.completedAt);
            lastDate.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            const currentUser = await User_1.default.findById(req.userId);
            if (diffDays === 1) {
                // completed yesterday — continue streak
                newStreak = (currentUser?.streak ?? 0) + 1;
            }
            else if (diffDays === 0) {
                // already did a lesson today — keep streak
                newStreak = currentUser?.streak ?? 1;
            }
            else {
                // missed days — reset to 1
                newStreak = 1;
            }
        }
        // find user to calculate longestStreak update
        const currentUser = await User_1.default.findById(req.userId);
        const updatedLongestStreak = Math.max(currentUser?.longestStreak ?? 0, newStreak);
        // update user
        const user = await User_1.default.findByIdAndUpdate(req.userId, {
            $inc: { xp: xpEarned },
            $set: { streak: newStreak, longestStreak: updatedLongestStreak },
        }, { new: true });
        res.status(200).json({
            message: "Lesson completed!",
            xpEarned,
            totalXp: user?.xp,
            streak: user?.streak,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.completeLesson = completeLesson;
