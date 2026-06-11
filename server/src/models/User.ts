import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    xp: number;
    streak: number;
    longestStreak: number;
    hearts: number;
    badges: string[];
    lastHeartsRestore: Date;
    lastLanguage: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, trim: true },
        email:    { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, minlength: 6 },
        xp:       { type: Number, default: 0 },
        streak:   { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        hearts:   { type: Number, default: 5 },
        badges:   { type: [String], default: [] },
        lastHeartsRestore: { type: Date, default: Date.now },
        lastLanguage: { type: String, default: "" },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);

