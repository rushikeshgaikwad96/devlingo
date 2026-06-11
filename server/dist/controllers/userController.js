"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getUserStats = exports.restoreHearts = exports.loseHeart = exports.getLeaderboard = exports.getUserProgress = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Progress_1 = __importDefault(require("../models/Progress"));
const User_1 = __importDefault(require("../models/User"));
const Lesson_1 = __importDefault(require("../models/Lesson"));
const getUserProgress = async (req, res) => {
    try {
        const progress = await Progress_1.default.find({ userId: req.userId })
            .populate("lessonId", "title language")
            .sort({ completedAt: -1 });
        res.status(200).json(progress);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getUserProgress = getUserProgress;
const getLeaderboard = async (req, res) => {
    try {
        const { type } = req.query; // "weekly" or "all-time"
        const currentUserIdStr = req.userId?.toString();
        let leadersList = [];
        if (type === "weekly") {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            // Aggregate progress documents from the last 7 days
            leadersList = await User_1.default.aggregate([
                {
                    $lookup: {
                        from: "progresses",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$userId", "$$userId"] },
                                            { $eq: ["$completed", true] },
                                            { $gte: ["$completedAt", sevenDaysAgo] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "recentProgress"
                    }
                },
                {
                    $addFields: {
                        weeklyXP: { $sum: "$recentProgress.xpEarned" }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        streak: 1,
                        allTimeXP: "$xp",
                        xp: "$weeklyXP", // Project weeklyXP as 'xp' for frontend compatibility
                    }
                },
                {
                    $sort: { xp: -1, allTimeXP: -1, username: 1 }
                }
            ]);
        }
        else {
            // Default: "all-time"
            leadersList = await User_1.default.find()
                .sort({ xp: -1, username: 1 })
                .select("_id username xp streak")
                .lean();
        }
        const currentUserIndex = leadersList.findIndex((u) => u._id.toString() === currentUserIdStr);
        const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : null;
        const top10 = leadersList.slice(0, 10).map((u) => ({
            _id: u._id,
            username: u.username,
            xp: u.xp,
            streak: u.streak,
        }));
        const currentUserData = currentUserIndex !== -1 ? {
            rank: currentUserRank,
            _id: leadersList[currentUserIndex]._id,
            username: leadersList[currentUserIndex].username,
            xp: leadersList[currentUserIndex].xp,
            streak: leadersList[currentUserIndex].streak,
        } : null;
        res.status(200).json({
            leaders: top10,
            currentUser: currentUserData,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getLeaderboard = getLeaderboard;
const loseHeart = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user.hearts > 0) {
            user.hearts -= 1;
            await user.save();
        }
        res.status(200).json({ hearts: user.hearts });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.loseHeart = loseHeart;
const restoreHearts = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.hearts = 5;
        user.lastHeartsRestore = new Date();
        await user.save();
        res.status(200).json({ hearts: user.hearts });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.restoreHearts = restoreHearts;
const getUserStats = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // 1. totalLessonsCompleted
        const totalLessonsCompleted = await Progress_1.default.countDocuments({
            userId: req.userId,
            completed: true,
        });
        // 2. languagesStarted
        // Find all published lessons to get totals per language
        const allLessons = await Lesson_1.default.find({ isPublished: true });
        const languageTotals = {};
        allLessons.forEach((l) => {
            languageTotals[l.language] = (languageTotals[l.language] || 0) + 1;
        });
        // Find all completed progresses populated with lesson info
        const progresses = await Progress_1.default.find({
            userId: req.userId,
            completed: true,
        }).populate("lessonId");
        const languageCompleted = {};
        progresses.forEach((p) => {
            if (p.lessonId && p.lessonId.language) {
                const lang = p.lessonId.language;
                languageCompleted[lang] = (languageCompleted[lang] || 0) + 1;
            }
        });
        // Compile languagesStarted array
        const languagesStarted = Object.keys(languageCompleted).map((lang) => ({
            language: lang,
            lessonsCompleted: languageCompleted[lang],
            totalLessons: languageTotals[lang] || 0,
        }));
        res.status(200).json({
            totalLessonsCompleted,
            totalXP: user.xp,
            currentStreak: user.streak,
            longestStreak: user.longestStreak || 0,
            languagesStarted,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getUserStats = getUserStats;
const updateProfile = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username || username.trim() === "") {
            res.status(400).json({ message: "Username is required" });
            return;
        }
        const trimmedUsername = username.trim();
        // Check if another user has this username
        const existing = await User_1.default.findOne({
            username: trimmedUsername,
            _id: { $ne: new mongoose_1.default.Types.ObjectId(req.userId) },
        });
        if (existing) {
            res.status(400).json({ message: "Username already taken" });
            return;
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(req.userId), { $set: { username: trimmedUsername } }, { new: true }).select("-password");
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.updateProfile = updateProfile;
