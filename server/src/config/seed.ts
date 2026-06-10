import mongoose from "mongoose";
import dotenv from "dotenv";
import Lesson from "../models/Lesson";

dotenv.config();

const seedLessons = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);

  await Lesson.deleteMany({});

  await Lesson.create([
    {
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
    },
    {
      title: "Functions in JavaScript",
      language: "javascript",
      topic: "basics",
      order: 2,
      isPublished: true,
      questions: [
        {
          type: "multiple-choice",
          question: "Which keyword is used to define a function?",
          options: ["func", "function", "def", "fn"],
          correct: "function",
          xpReward: 10,
        },
        {
          type: "fill-blank",
          question: "Complete: ___ myFunc() { } (use function keyword)",
          correct: "function",
          xpReward: 10,
        },
        {
          type: "multiple-choice",
          question: "What does a function return if no return statement is given?",
          options: ["0", "null", "undefined", "false"],
          correct: "undefined",
          xpReward: 10,
        },
      ],
    },
    {
      title: "Arrays in JavaScript",
      language: "javascript",
      topic: "data structures",
      order: 3,
      isPublished: true,
      questions: [
        {
          type: "multiple-choice",
          question: "How do you create an empty array in JavaScript?",
          options: ["array()", "{}", "[]", "<>"],
          correct: "[]",
          xpReward: 10,
        },
        {
          type: "multiple-choice",
          question: "Which method adds an element to the end of an array?",
          options: ["push()", "pop()", "shift()", "add()"],
          correct: "push()",
          xpReward: 10,
        },
        {
          type: "fill-blank",
          question: "To get array length: myArray.___ ",
          correct: "length",
          xpReward: 10,
        },
      ],
    },
  ]);

  console.log("Database seeded with 3 lessons!");
  process.exit(0);
};

seedLessons();