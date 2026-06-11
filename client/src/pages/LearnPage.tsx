import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Lesson } from "../types";
import { useAuthStore } from "../store/authStore";

export default function LearnPage() {
  const { language } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/lessons/${language}`);
        setLessons(res.data);
        console.log("Lessons:", res.data);
      } catch (err) {
        console.log("Error:", err);
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [language]);

  if (loading) {
    return <LearnSkeleton />;
  }

  return (
    <div className="min-h-screen bg-dark text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <button
          onClick={() => navigate("/home")}
          className="text-gray-400 hover:text-white transition-all"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-primary capitalize">
          🦉 {language}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-warning">🔥 {user?.streak ?? 0}</span>
          <span className="text-primary">⚡ {user?.xp ?? 0} XP</span>
        </div>
      </nav>

      {/* Lessons */}
      <div className="max-w-2xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">Choose a lesson</h2>

        {lessons.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🚧</p>
            <p className="text-gray-400 text-lg">
              No lessons yet for {language}. Coming soon!
            </p>
            <button
              onClick={() => navigate("/home")}
              className="mt-6 bg-primary px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
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

function LearnSkeleton() {
  return (
    <div className="min-h-screen bg-dark text-white animate-pulse">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <div className="w-16 h-6 bg-gray-800 rounded" />
        <div className="w-32 h-6 bg-gray-800 rounded animate-pulse" />
        <div className="w-20 h-6 bg-gray-800 rounded" />
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="w-48 h-8 bg-gray-800 rounded mb-8" />
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 h-24 flex items-center justify-between">
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
      </div>
    </div>
  );
}