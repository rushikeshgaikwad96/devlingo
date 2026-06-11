"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        //check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already registered" });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        //create the user
        const user = await User_1.default.create({
            username,
            email,
            password: hashedPassword,
        });
        //create JWT token
        const token = jsonwebtoken_1.default.sign({
            id: user._id
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                xp: user.xp,
                streak: user.streak,
                longestStreak: user.longestStreak || 0,
                hearts: user.hearts,
                lastLanguage: user.lastLanguage || "",
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        //check password 
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        //create token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        // Restore hearts if 24 hours have passed since last restoration
        const now = new Date();
        const lastRestore = user.lastHeartsRestore || user.createdAt || now;
        const diffHours = (now.getTime() - new Date(lastRestore).getTime()) / (1000 * 60 * 60);
        if (diffHours >= 24) {
            user.hearts = 5;
            user.lastHeartsRestore = now;
            await user.save();
        }
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                xp: user.xp,
                streak: user.streak,
                longestStreak: user.longestStreak || 0,
                hearts: user.hearts,
                lastLanguage: user.lastLanguage || "",
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getMe = getMe;
