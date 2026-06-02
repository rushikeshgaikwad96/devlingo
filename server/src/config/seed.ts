import mongoose from "mongoose";
import dotenv from "dotenv";
import Lesson from "../models/Lesson";

dotenv.config();

const seedLesson = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);

  await Lesson.deleteMany({});

  await Lesson.create({
    title: "Variables in JavaScript",
    language: "javascript",
    topic: "basics",
    order: 1,
    isPublished: true,
    questions: [
      {
        type: "multiple-choice",
        question: "Which keyword declares a variable that cannot be reassigned?",
        options: ["var", "let", "const", "int"],
        correct: "const",
        xpReward: 10,
      },
      {
        type: "fill-blank",
        question: "Complete: ___ name = 'DevLingo'; (use let)",
        correct: "let",
        xpReward: 10,
      },
      {
        type: "multiple-choice",
        question: "What does 'var' stand for?",
        options: ["variable", "variant", "various", "value"],
        correct: "variable",
        xpReward: 10,
      },
    ],
  });

  console.log("Database seeded!");
  process.exit(0);
};

seedLesson();