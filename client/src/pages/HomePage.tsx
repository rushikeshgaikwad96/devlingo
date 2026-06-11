import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";

interface LanguageProgress {
  language: string;
  lessonsCompleted: number;
  totalLessons: number;
}

interface UserStats {
  totalLessonsCompleted: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  languagesStarted: LanguageProgress[];
}

const languages = [
  { name: "JavaScript", icon: "🟨", color: "bg-yellow-500", slug: "javascript" },
  { name: "Python", icon: "🐍", color: "bg-blue-500", slug: "python" },
  { name: "TypeScript", icon: "🔷", color: "bg-blue-700", slug: "typescript" },
  { name: "SQL", icon: "🗄️", color: "bg-orange-500", slug: "sql" },
  { name: "React", icon: "⚛️", color: "bg-cyan-500", slug: "react" },
  { name: "Node.js", icon: "🟩", color: "bg-green-700", slug: "nodejs" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        useAuthStore.getState().setUser(res.data, useAuthStore.getState().token!);
      } catch {
        logout();
        navigate("/");
      }
    };
    if (!user) fetchUser();
  }, [user, logout, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (statsLoading || !user) {
    return <HomeSkeleton />;
  }

  const lastLanguage = user.lastLanguage;
  const lastLangData = languages.find((l) => l.slug === lastLanguage);
  const lastLangStats = stats?.languagesStarted.find((l) => l.language === lastLanguage);

  const completed = lastLangStats?.lessonsCompleted ?? 0;
  const total = lastLangStats?.totalLessons ?? 5;
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <span>🦉</span> DevLingo
        </h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-warning text-xl">🔥</span>
            <span className="font-bold">{user.streak}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-primary">{user.xp} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">❤️</span>
            <span className="font-bold text-danger">{user.hearts}</span>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all"
          >
            👤 Profile
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/leaderboard")}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all"
          >
            🏆 Leaderboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold">
            Welcome back, <span className="text-primary">{user.username}</span>! 👋
          </h2>
          <p className="text-gray-400 mt-2">Choose a language to start learning</p>
        </div>

        {/* Continue Learning */}
        {lastLanguage && lastLangData && (
          <div className="mb-10 bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl hover:border-primary/50 transition-all">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-5xl">{lastLangData.icon}</span>
              <div className="flex-1">
                <p className="text-xs uppercase text-primary font-bold tracking-wider">Continue Learning</p>
                <h3 className="text-2xl font-bold mt-0.5">{lastLangData.name}</h3>
                <div className="flex items-center gap-3 mt-2 w-full md:w-64">
                  <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-bold whitespace-nowrap">
                    {completed}/{total} Lessons
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/learn/${lastLanguage}`)}
              className="w-full md:w-auto bg-primary hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md shadow-primary/20"
            >
              Resume Lesson →
            </button>
          </div>
        )}

        {/* Language grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {languages.map((lang) => (
            <button
              key={lang.slug}
              onClick={() => navigate(`/learn/${lang.slug}`)}
              className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-primary rounded-2xl p-6 flex flex-col items-center gap-3 transition-all hover:scale-105"
            >
              <span className="text-5xl">{lang.icon}</span>
              <span className="font-bold text-lg">{lang.name}</span>
              <span className={`text-xs px-3 py-1 rounded-full text-white ${lang.color}`}>
                Start Learning
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-dark text-white animate-pulse">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <div className="w-24 h-6 bg-gray-800 rounded" />
        <div className="flex gap-4">
          <div className="w-16 h-6 bg-gray-800 rounded" />
          <div className="w-16 h-6 bg-gray-800 rounded" />
          <div className="w-16 h-6 bg-gray-800 rounded" />
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="space-y-2 mb-10">
          <div className="w-64 h-8 bg-gray-800 rounded" />
          <div className="w-48 h-4 bg-gray-800 rounded" />
        </div>

        {/* Banner Skeleton */}
        <div className="mb-10 bg-gray-900 border border-gray-700 rounded-2xl p-6 h-28" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 h-36" />
          ))}
        </div>
      </div>
    </div>
  );
}