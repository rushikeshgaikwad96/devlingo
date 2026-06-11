import mongoose, { Document, Schema } from "mongoose";

export interface IProgress extends Document {
    userId: mongoose.Types.ObjectId;
    lessonId: mongoose.Types.ObjectId;
    completed: boolean;
    score: number;
    xpEarned: number;
    completedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
    {
        userId:   { type: Schema.Types.ObjectId, ref: "User", required: true },
        lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
        completed: { type: Boolean, default: false },
        score: { type: Number, default: 0 },
        xpEarned: { type: Number, default: 0 },
        completedAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<IProgress>("Progress", ProgressSchema);