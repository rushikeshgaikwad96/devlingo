import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Question, Explanation } from "../types";
import { useAuthStore } from "../store/authStore";
import { playCorrectSound, playIncorrectSound, playCompleteSound } from "../utils/sounds";

interface FullLesson {
  _id: string;
  title: string;
  language: string;
  topic?: string;
  questions: Question[];
  explanation?: Explanation;
}

const getFileExtension = (lang: string): string => {
  const mapping: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    sql: "sql",
    react: "jsx",
    nodejs: "js"
  };
  return mapping[lang.toLowerCase()] || "txt";
};

const getLanguageLabel = (lang: string): string => {
  const mapping: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python",
    sql: "SQL",
    react: "React",
    nodejs: "Node.js"
  };
  return mapping[lang.toLowerCase()] || lang;
};

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateXP, updateStreak, updateHearts, setAuthModal } = useAuthStore();

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
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [shakeHearts, setShakeHearts] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) setShowSkeleton(true);
    }, 200);

    const fetchLesson = async () => {
      try {
        const res = await api.get(`/lessons/single/${id}`);
        if (active) {
          setLesson(res.data);
          if (!res.data.explanation || !res.data.explanation.description) {
            setShowExplanation(false);
          }
        }
      } catch {
        if (active) navigate("/home");
      } finally {
        if (active) {
          setLoading(false);
          clearTimeout(timer);
        }
      }
    };
    fetchLesson();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [id, navigate]);

  // Auto-transition to practice once user signs in successfully on this screen
  useEffect(() => {
    if (user && lesson && showExplanation) {
      setShowExplanation(false);
    }
  }, [user, lesson, showExplanation]);

  if (loading) {
    return (
      <LessonSkeleton
        showContent={showSkeleton}
        user={user}
        navigate={navigate}
        setAuthModal={setAuthModal}
      />
    );
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

  // W3SCHOOLS-INSPIRED EXPLANATION PHASE
  if (showExplanation && lesson.explanation) {
    const { explanation } = lesson;
    return (
      <div className="min-h-screen bg-dark text-white flex flex-col">
        {/* Header */}
        <div className="px-8 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white transition-all text-xl"
            >
              ✕
            </button>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-md uppercase tracking-wider border border-yellow-500/20">
                💡 Lesson Guide
              </span>
              <span className="text-gray-500 text-sm hidden sm:inline">•</span>
              <span className="text-gray-400 text-sm hidden sm:inline font-medium">
                Review before you practice
              </span>
            </div>
          </div>
          {user ? (
            <div className={`flex items-center gap-1.5 transition-all duration-300 ${shakeHearts ? "animate-shake text-danger" : ""}`}>
              <span className="text-danger text-xl">❤️</span>
              <span className="font-extrabold text-danger text-lg">{user.hearts}</span>
            </div>
          ) : (
            <button
              onClick={() => setAuthModal(true, "login")}
              className="bg-primary hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-primary/15"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Learning Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-10 animate-slideUp">
            {/* Meta Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary font-bold text-xs uppercase tracking-widest">
                {getLanguageLabel(lesson.language)}
              </span>
              {lesson.topic && (
                <>
                  <span className="text-gray-600 text-[10px]">•</span>
                  <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider">
                    {lesson.topic}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              {lesson.title}
            </h1>

            {/* 📖 Description Card */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 sm:p-8 mb-6 backdrop-blur-sm shadow-lg">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span>📖</span> Concept Overview
              </h3>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                {explanation.description}
              </p>
            </div>

            {/* 💻 Syntax Card */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 mb-6 backdrop-blur-sm shadow-lg">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span>💻</span> Syntax Guide
              </h3>
              <div className="bg-black/40 border border-gray-800 rounded-xl overflow-hidden">
                <pre className="font-mono text-sm p-4 overflow-x-auto text-yellow-400 leading-relaxed">
                  <code>{explanation.syntax}</code>
                </pre>
              </div>
            </div>

            {/* 🔍 Try it Yourself Code Example */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-8">
              {/* Window Header */}
              <div className="bg-gray-800/80 px-5 py-3.5 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-danger block"></span>
                  <span className="w-3 h-3 rounded-full bg-warning block"></span>
                  <span className="w-3 h-3 rounded-full bg-primary block"></span>
                  <span className="text-xs text-gray-400 font-mono ml-2">
                    example.{getFileExtension(lesson.language)}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-gray-800 px-2.5 py-1 rounded text-[10px] text-gray-400 uppercase tracking-widest font-bold font-mono">
                  <span>⚡</span> Live Code
                </div>
              </div>

              {/* Window Body (Code Editor Mockup) */}
              <div className="p-6 bg-[#0c0f16] font-mono text-sm text-gray-200 overflow-x-auto leading-relaxed border-b border-gray-800">
                <pre className="text-green-400/90">
                  <code>{explanation.exampleCode}</code>
                </pre>
              </div>

              {/* Console Output Header */}
              <div className="bg-gray-800/40 px-5 py-2.5 border-b border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  💻 Simulated Console Output
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Active</span>
              </div>

              {/* Console Output Body */}
              <div className="p-5 bg-black/60 font-mono text-xs text-green-400 min-h-[70px] flex items-center">
                <pre className="w-full whitespace-pre-wrap">{explanation.exampleOutput}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-800 bg-dark/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto flex justify-end">
            <button
              onClick={() => {
                if (user) {
                  setShowExplanation(false);
                } else {
                  setAuthModal(true, "login");
                }
              }}
              className="w-full sm:w-auto bg-primary hover:bg-green-600 text-white font-bold py-4 px-12 rounded-xl transition-all text-lg shadow-lg hover:scale-[1.02] shadow-primary/20 active:scale-[0.98]"
            >
              Start Practice →
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      playCorrectSound();
    } else {
      playIncorrectSound();
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
      playCompleteSound();
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

function LessonSkeleton({
  showContent,
  user,
  navigate,
  setAuthModal,
}: {
  showContent: boolean;
  user: any;
  navigate: any;
  setAuthModal: any;
}) {
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      {/* Header */}
      <div className="px-8 py-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-all text-xl"
          >
            ✕
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-md uppercase tracking-wider border border-yellow-500/20">
              💡 Lesson Guide
            </span>
            <span className="text-gray-500 text-sm hidden sm:inline">•</span>
            <span className="text-gray-400 text-sm hidden sm:inline font-medium">
              Review before you practice
            </span>
          </div>
        </div>
        {user ? (
          <div className="flex items-center gap-1.5">
            <span className="text-danger text-xl">❤️</span>
            <span className="font-extrabold text-danger text-lg">{user.hearts}</span>
          </div>
        ) : (
          <button
            onClick={() => setAuthModal(true, "login")}
            className="bg-primary hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-primary/15"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Learning Content Skeleton */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-10 space-y-6">
        {showContent ? (
          <div className="animate-pulse space-y-6">
            {/* Meta Header */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-4 bg-gray-800 rounded" />
              <div className="w-24 h-4 bg-gray-800 rounded" />
            </div>

            {/* Title */}
            <div className="w-3/4 h-10 bg-gray-800 rounded mb-6" />

            {/* Concept Card Skeleton */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-3">
              <div className="w-40 h-6 bg-gray-800 rounded" />
              <div className="w-full h-4 bg-gray-800 rounded" />
              <div className="w-5/6 h-4 bg-gray-800 rounded" />
              <div className="w-4/5 h-4 bg-gray-800 rounded" />
            </div>

            {/* Syntax Card Skeleton */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 space-y-3">
              <div className="w-32 h-6 bg-gray-800 rounded" />
              <div className="w-full h-12 bg-gray-900 rounded-xl" />
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-gray-800 flex justify-end">
        {showContent ? (
          <div className="w-full sm:w-40 h-14 bg-gray-800 rounded-xl animate-pulse" />
        ) : null}
      </div>
    </div>
  );
}