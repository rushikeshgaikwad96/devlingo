import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
    type: "multiple-choice" | "fill-blank" | "reorder";
    question: string;
    options?: string[];
    correct: string;
    xpReward: number;
}

export interface IExplanation {
    description: string;
    syntax: string;
    exampleCode: string;
    exampleOutput: string;
}

export interface ILesson extends Document {
    title: string;
    language: string;
    topic: string;
    order: number;
    explanation?: IExplanation;
    questions: IQuestion[];
    isPublished: boolean;
}

const QuestionSchema = new Schema<IQuestion>({
    type: {
        type: String,
        enum: ["multiple-choice", "fill-blank", "reorder"],
        required: true,
    },
    question: { type: String, required: true },
    options: { type: [String], default: []},
    correct: { type: String, required: true },
    xpReward: { type: Number, default: 10 },
});

const ExplanationSchema = new Schema<IExplanation>({
    description: { type: String, required: true },
    syntax: { type: String, required: true },
    exampleCode: { type: String, required: true },
    exampleOutput: { type: String, required: true },
});

const LessonSchema = new Schema<ILesson>(
    {
        title:  { type: String, required: true },
        language:  { type: String, required: true },
        topic: { type: String, required: true },
        order:  { type: Number, required: true },
        explanation: { type: ExplanationSchema },
        questions: { type: [QuestionSchema], default: [] },
        isPublished: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<ILesson>("Lesson", LessonSchema);

