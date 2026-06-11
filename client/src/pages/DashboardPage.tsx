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

interface UserStats {
  totalLessonsCompleted: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
}

const badgeTiers = [
  { xp: 10, label: "First XP" },
  { xp: 50, label: "On Fire" },
  { xp: 100, label: "Diamond" },
  { xp: 250, label: "Grandmaster" },
  { xp: 500, label: "Legendary" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [progressRes, statsRes] = await Promise.all([
          api.get("/users/progress"),
          api.get("/users/stats")
        ]);
        setProgress(progressRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getBadges = () => {
    const badges = [];
    const completedCount = progress.length;
    const currentXP = user?.xp ?? 0;
    
    if (currentXP >= 10) badges.push({ icon: "⚡", label: "First XP" });
    if (currentXP >= 50) badges.push({ icon: "🔥", label: "On Fire" });
    if (currentXP >= 100) badges.push({ icon: "💎", label: "Diamond" });
    if (completedCount >= 1) badges.push({ icon: "🎯", label: "First Lesson" });
    if (completedCount >= 3) badges.push({ icon: "🏆", label: "Hat Trick" });
    if (completedCount >= 5) badges.push({ icon: "🦉", label: "Wise Owl" });
    return badges;
  };

  const getHeatmapDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push(d);
    }
    return days;
  };

  if (!user) {
    return <DashboardSkeleton />;
  }

  const badges = getBadges();
  const heatmapDays = getHeatmapDays();

  // Map dates where lessons were completed
  const activeDates = new Set(
    progress.map((p) => {
      const d = new Date(p.completedAt);
      d.setHours(0, 0, 0, 0);
      return d.toDateString();
    })
  );

  // Time Spent Estimation: 5 mins per completed lesson
  const estTimeMin = progress.length * 5;
  const formattedTimeSpent = loading
    ? "..."
    : estTimeMin < 60
    ? `${estTimeMin} mins`
    : `${Math.floor(estTimeMin / 60)}h ${estTimeMin % 60}m`;

  // Next Badge level progress calculations
  const currentXP = user.xp;
  const nextBadge = badgeTiers.find((tier) => tier.xp > currentXP) || null;

  let progressPercent = 100;
  let prevXP = 0;
  if (nextBadge) {
    const tierIdx = badgeTiers.indexOf(nextBadge);
    prevXP = tierIdx > 0 ? badgeTiers[tierIdx - 1].xp : 0;
    progressPercent = ((currentXP - prevXP) / (nextBadge.xp - prevXP)) * 100;
    progressPercent = Math.max(0, Math.min(100, progressPercent));
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <button
          onClick={() => navigate("/home")}
          className="text-gray-400 hover:text-white transition-all font-semibold"
        >
          ← Home
        </button>
        <h1 className="text-xl font-bold text-primary">🦉 Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-warning">🔥 {user.streak}</span>
          <span className="text-primary">⚡ {user.xp} XP</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 text-center transition-all hover:scale-105">
            <p className="text-3xl font-extrabold text-primary">{user.xp}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">Total XP</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 text-center transition-all hover:scale-105">
            <p className="text-3xl font-extrabold text-warning">🔥 {user.streak}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">Current Streak</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 text-center transition-all hover:scale-105">
            <p className="text-3xl font-extrabold text-orange-500">🏆 {stats?.longestStreak ?? 0}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">Longest Streak</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 text-center transition-all hover:scale-105">
            <p className="text-3xl font-extrabold text-cyan-400">{formattedTimeSpent}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">Time Spent (Est)</p>
          </div>
        </div>

        {/* Next Badge Progress */}
        {nextBadge && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg text-white">Next Badge Progress</h3>
              <span className="text-xs text-primary font-bold">
                Next: {nextBadge.label} ({nextBadge.xp} XP)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm text-gray-400 font-bold">
                {currentXP}/{nextBadge.xp} XP
              </span>
            </div>
          </div>
        )}

        {/* Activity Heatmap */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8 shadow-md">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            📅 Activity Heatmap (Last 30 Days)
          </h3>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {heatmapDays.map((day, idx) => {
              const dateStr = day.toDateString();
              const isActive = activeDates.has(dateStr);
              return (
                <div
                  key={idx}
                  title={`${day.toLocaleDateString()}: ${isActive ? "Active (Completed lesson)" : "No activity"}`}
                  className={`w-7 h-7 rounded-md border flex items-center justify-center text-[10px] font-bold transition-all hover:scale-115 cursor-help ${
                    loading
                      ? "bg-gray-800/50 border-gray-700 animate-pulse text-transparent"
                      : isActive
                      ? "bg-primary border-green-600 text-white shadow-md shadow-primary/30"
                      : "bg-gray-800 border-gray-700 text-gray-500"
                  }`}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
          <div className="flex justify-start items-center gap-4 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-gray-800 border border-gray-700 rounded-sm" />
              <span>No Activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-primary border border-green-600 rounded-sm" />
              <span>Active Day</span>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="mb-8 bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Your Badges</h2>
          {badges.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-3">🎯</p>
              <p className="text-gray-400">Complete lessons to earn badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center hover:border-primary transition-all hover:scale-105"
                >
                  <p className="text-4xl mb-2">{badge.icon}</p>
                  <p className="text-xs text-white font-bold">{badge.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity List */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          {progress.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📚</p>
              <p className="text-gray-400">No lessons completed yet!</p>
              <button
                onClick={() => navigate("/home")}
                className="mt-4 bg-primary px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all hover:scale-105"
              >
                Start Learning →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {progress.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center justify-between transition-all hover:border-primary"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-xl">
                      ✅
                    </div>
                    <div>
                      <p className="font-bold text-white">
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

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-dark text-white animate-pulse">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <div className="w-16 h-6 bg-gray-800 rounded" />
        <div className="w-24 h-6 bg-gray-800 rounded" />
        <div className="w-20 h-6 bg-gray-800 rounded" />
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-2xl p-5 h-24" />
          ))}
        </div>

        {/* Progress Bar Skeleton */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 h-20 mb-8" />

        {/* Heatmap Skeleton */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 h-36 mb-8" />

        {/* Badges Skeleton */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 h-40 mb-8" />

        {/* Recent Activity Skeleton */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 h-56" />
      </div>
    </div>
  );
}