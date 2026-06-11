import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Question } from "../types";
import { useAuthStore } from "../store/authStore";

interface FullLesson {
  _id: string;
  title: string;
  language: string;
  questions: Question[];
}

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateXP, updateStreak, updateHearts } = useAuthStore();

  const [lesson, setLesson] = useState<FullLesson | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shakeHearts, setShakeHearts] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/single/${id}`);
        setLesson(res.data);
      } catch {
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  if (loading) {
    return <LessonSkeleton />;
  }

  // OUT OF HEARTS LOCKOUT MODAL
  if (user && user.hearts <= 0) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="text-center max-w-sm bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-2xl animate-shake">
          <p className="text-6xl mb-4">💔</p>
          <h2 className="text-2xl font-bold text-white mb-2">Out of Hearts!</h2>
          <p className="text-gray-400 mb-6 text-sm">
            You are out of hearts. Come back tomorrow or restore them on your profile page to continue.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="w-full bg-primary hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-105"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  const question = lesson.questions[current];
  const total = lesson.questions.length;
  const progress = (current / total) * 100;

  const handleAnswer = async () => {
    const answer = question.type === "fill-blank" ? input.trim() : selected;
    const isCorrect = answer.toLowerCase() === question.correct.toLowerCase();
    setCorrect(isCorrect);
    setAnswered(true);
    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      // Wrong answer - trigger shake and call API
      setShakeHearts(true);
      setTimeout(() => setShakeHearts(false), 500);
      try {
        const res = await api.post("/users/lose-heart");
        updateHearts(res.data.hearts);
      } catch (err) {
        console.error("Failed to lose heart", err);
      }
    }
  };

  const handleNext = async () => {
    if (current + 1 < total) {
      setCurrent((c) => c + 1);
      setSelected("");
      setInput("");
      setAnswered(false);
      setCorrect(false);
    } else {
      try {
        const res = await api.post("/lessons/complete", {
          lessonId: lesson._id,
          score,
        });
        setXpEarned(res.data.xpEarned);
        updateXP(res.data.totalXp);
        updateStreak(res.data.streak);
        setFinished(true);
      } catch {
        setFinished(true);
      }
    }
  };

  // FINISHED SCREEN
  if (finished) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-8xl mb-6">🎉</p>
          <h1 className="text-4xl font-bold text-white mb-2">
            Lesson Complete!
          </h1>
          <p className="text-gray-400 mb-8">
            You answered {score}/{total} correctly
          </p>
          <div className="bg-gray-900 rounded-2xl p-6 mb-8 inline-block">
            <p className="text-primary text-5xl font-bold">+{xpEarned} XP</p>
            <p className="text-gray-400 mt-1">earned this lesson</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(`/learn/${lesson.language}`)}
              className="bg-primary hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition-all"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LESSON SCREEN
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">

      {/* Header */}
      <div className="px-8 py-4 flex items-center gap-4 border-b border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition-all text-xl"
        >
          ✕
        </button>
        <div className="flex-1 bg-gray-700 rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={`flex items-center gap-1.5 transition-all duration-300 ${shakeHearts ? "animate-shake text-danger" : ""}`}>
          <span className="text-danger text-xl">❤️</span>
          <span className="font-extrabold text-danger text-lg">{user?.hearts ?? 5}</span>
        </div>
        <span className="text-gray-400 text-sm ml-2">{current + 1}/{total}</span>
      </div>

      {/* Question */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-8 py-12">
        <p className="text-gray-400 uppercase text-sm font-bold mb-2 tracking-wider">
          {question.type === "multiple-choice"
            ? "Choose the correct answer"
            : "Fill in the blank"}
        </p>
        <h2 className="text-2xl font-bold mb-8">{question.question}</h2>

        {/* Multiple choice options */}
        {question.type === "multiple-choice" && (
          <div className="flex flex-col gap-3">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => !answered && setSelected(option)}
                className={`p-4 rounded-xl border-2 text-left font-semibold transition-all ${answered
                    ? option === question.correct
                      ? "border-primary bg-primary/20 text-primary"
                      : option === selected
                        ? "border-danger bg-danger/20 text-danger"
                        : "border-gray-700 text-gray-500"
                    : selected === option
                      ? "border-primary bg-primary/10"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Fill in the blank */}
        {question.type === "fill-blank" && (
          <input
            type="text"
            value={input}
            onChange={(e) => !answered && setInput(e.target.value)}
            placeholder="Type your answer..."
            className="w-full bg-gray-800 text-white px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-primary text-lg"
          />
        )}

        {/* Feedback */}
        {answered && (
          <div
            className={`mt-6 p-4 rounded-xl border ${correct
                ? "bg-primary/20 border-primary"
                : "bg-danger/20 border-danger"
              }`}
          >
            <p
              className={`font-bold text-lg ${correct ? "text-primary" : "text-danger"
                }`}
            >
              {correct ? "✓ Correct!" : "✗ Incorrect!"}
            </p>
            {!correct && (
              <p className="text-gray-300 mt-1">
                Correct answer:{" "}
                <span className="font-bold text-primary">{question.correct}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-gray-800">
        {!answered ? (
          <button
            onClick={handleAnswer}
            disabled={!selected && !input}
            className="w-full bg-primary hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-lg"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className={`w-full font-bold py-4 rounded-xl transition-all text-lg text-white ${correct
                ? "bg-primary hover:bg-green-600"
                : "bg-gray-700 hover:bg-gray-600"
              }`}
          >
            {current + 1 < total ? "Next Question →" : "Finish Lesson 🎉"}
          </button>
        )}
      </div>
    </div>
  );
}

function LessonSkeleton() {
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col animate-pulse">
      {/* Header */}
      <div className="px-8 py-4 flex items-center gap-4 border-b border-gray-800">
        <div className="w-6 h-6 bg-gray-800 rounded" />
        <div className="flex-1 bg-gray-800 rounded-full h-4" />
        <div className="w-16 h-6 bg-gray-800 rounded" />
      </div>

      {/* Question */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-8 py-12">
        <div className="w-32 h-4 bg-gray-800 rounded mb-4" />
        <div className="w-full h-8 bg-gray-800 rounded mb-8" />

        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl border-2 border-gray-800 bg-gray-900 h-14" />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-gray-800">
        <div className="w-full h-14 bg-gray-800 rounded-xl" />
      </div>
    </div>
  );
}