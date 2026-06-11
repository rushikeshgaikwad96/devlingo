import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Lesson } from "../types";
import { useAuthStore } from "../store/authStore";

export default function LearnPage() {
  const { language } = useParams();
  const navigate = useNavigate();
  const { user, setAuthModal } = useAuthStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) setShowSkeleton(true);
    }, 200);

    const fetchLessons = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/lessons/${language}`);
        if (active) setLessons(res.data);
      } catch (err) {
        console.log("Error:", err);
        if (active) {
          setError("Failed to load lessons. Please verify the backend API server is running on port 5000 and connected to MongoDB.");
        }
      } finally {
        if (active) {
          setLoading(false);
          clearTimeout(timer);
        }
      }
    };
    fetchLessons();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [language]);

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <button
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-white transition-all font-semibold"
        >
          ← Home
        </button>
        <h1 className="text-xl font-bold text-primary capitalize">
          🦉 {language}
        </h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-warning">🔥 {user.streak}</span>
            <span className="text-primary">⚡ {user.xp} XP</span>
          </div>
        ) : (
          <button
            onClick={() => setAuthModal(true, "login")}
            className="bg-primary hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-primary/15"
          >
            Sign In
          </button>
        )}
      </nav>

      {/* Lessons */}
      <div className="max-w-2xl mx-auto px-8 py-12 w-full flex-1">
        <h2 className="text-2xl font-bold mb-8">Choose a lesson</h2>

        {loading ? (
          showSkeleton ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-700 rounded-2xl p-6 h-24 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800" />
                    <div className="space-y-2">
                      <div className="w-40 h-5 bg-gray-800 rounded" />
                      <div className="w-24 h-4 bg-gray-800 rounded" />
                    </div>
                  </div>
                  <div className="w-20 h-9 bg-gray-800 rounded-xl" />
                </div>
              ))}
            </div>
          ) : null
        ) : error ? (
          <div className="text-center py-16 bg-danger/10 border border-danger/20 rounded-2xl p-6 shadow-lg">
            <p className="text-danger text-4xl mb-3">⚠️</p>
            <h3 className="text-lg font-bold text-white mb-2">Connection Error</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 text-sm"
            >
              ← Back to Home
            </button>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🚧</p>
            <p className="text-gray-400 text-lg">
              No lessons yet for {language}. Coming soon!
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-primary px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-slideUp">
            {lessons.map((lesson, index) => (
              <button
                key={lesson._id}
                onClick={() =>
                  !lesson.isLocked && navigate(`/lesson/${lesson._id}`)
                }
                className={`relative p-6 rounded-2xl border text-left transition-all ${
                  lesson.isCompleted
                    ? "bg-primary/10 border-primary"
                    : lesson.isLocked
                    ? "bg-gray-900 border-gray-700 opacity-50 cursor-not-allowed"
                    : "bg-gray-900 border-gray-700 hover:border-primary hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                        lesson.isCompleted
                          ? "bg-primary text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {lesson.isCompleted ? "✓" : index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{lesson.title}</h3>
                      <p className="text-gray-400 text-sm capitalize">
                        {lesson.topic}
                      </p>
                    </div>
                  </div>
                  <div>
                    {lesson.isCompleted ? (
                      <span className="text-primary font-bold">Done ✅</span>
                    ) : lesson.isLocked ? (
                      <span className="text-2xl">🔒</span>
                    ) : (
                      <span className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm">
                        Start →
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}