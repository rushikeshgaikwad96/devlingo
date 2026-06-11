import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

interface ProgressItem {
  _id: string;
  lessonId: { title: string; language: string };
  score: number;
  completedAt: string;
  xpEarned: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get("/users/progress");
        setProgress(res.data);
      } catch {
        console.log("error fetching progress");
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const getBadges = () => {
    const badges = [];
    if ((user?.xp ?? 0) >= 10) badges.push({ icon: "⚡", label: "First XP" });
    if ((user?.xp ?? 0) >= 50) badges.push({ icon: "🔥", label: "On Fire" });
    if ((user?.xp ?? 0) >= 100) badges.push({ icon: "💎", label: "Diamond" });
    if (progress.length >= 1) badges.push({ icon: "🎯", label: "First Lesson" });
    if (progress.length >= 3) badges.push({ icon: "🏆", label: "Hat Trick" });
    if (progress.length >= 5) badges.push({ icon: "🦉", label: "Wise Owl" });
    return badges;
  };

  const badges = getBadges();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-white text-xl animate-pulse">Loading dashboard...</p>
      </div>
    );
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
        <h1 className="text-xl font-bold text-primary">🦉 Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-warning">🔥 {user?.streak ?? 0}</span>
          <span className="text-primary">⚡ {user?.xp ?? 0} XP</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 rounded-2xl p-6 text-center border border-gray-700">
            <p className="text-5xl font-bold text-primary">{user?.xp ?? 0}</p>
            <p className="text-gray-400 mt-2">Total XP</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 text-center border border-gray-700">
            <p className="text-5xl font-bold text-warning">{user?.streak ?? 0}</p>
            <p className="text-gray-400 mt-2">Day Streak 🔥</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 text-center border border-gray-700">
            <p className="text-5xl font-bold text-danger">{user?.hearts ?? 5}</p>
            <p className="text-gray-400 mt-2">Hearts ❤️</p>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Badges</h2>
          {badges.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-700">
              <p className="text-4xl mb-3">🎯</p>
              <p className="text-gray-400">Complete lessons to earn badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className="bg-gray-900 border border-gray-700 rounded-2xl p-4 text-center hover:border-primary transition-all"
                >
                  <p className="text-4xl mb-2">{badge.icon}</p>
                  <p className="text-xs text-gray-400 font-semibold">{badge.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          {progress.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-700">
              <p className="text-4xl mb-3">📚</p>
              <p className="text-gray-400">No lessons completed yet!</p>
              <button
                onClick={() => navigate("/home")}
                className="mt-4 bg-primary px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all"
              >
                Start Learning →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {progress.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-900 border border-gray-700 rounded-2xl p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
                      ✅
                    </div>
                    <div>
                      <p className="font-bold">
                        {item.lessonId?.title ?? "Lesson"}
                      </p>
                      <p className="text-gray-400 text-sm capitalize">
                        {item.lessonId?.language} •{" "}
                        {new Date(item.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold text-lg">
                      +{item.score * 10} XP
                    </p>
                    <p className="text-gray-400 text-sm">
                      Score: {item.score}/3
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}