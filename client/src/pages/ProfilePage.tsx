import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

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

const AVATAR_COLORS = [
  "bg-red-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500",
  "bg-blue-500", "bg-cyan-500", "bg-teal-500", "bg-green-500",
  "bg-yellow-500", "bg-orange-500"
];

const languageMetaData: Record<string, { name: string; icon: string }> = {
  javascript: { name: "JavaScript", icon: "🟨" },
  python: { name: "Python", icon: "🐍" },
  typescript: { name: "TypeScript", icon: "🔷" },
  sql: { name: "SQL", icon: "🗄️" },
  react: { name: "React", icon: "⚛️" },
  nodejs: { name: "Node.js", icon: "🟩" },
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUserFields } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Editing username state
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || "");
  const [editError, setEditError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching user stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getAvatarColor = (name: string) => {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const handleSaveUsername = async () => {
    if (!editUsername.trim()) {
      setEditError("Username cannot be empty");
      return;
    }
    if (editUsername.trim() === user?.username) {
      setIsEditing(false);
      return;
    }
    setUpdating(true);
    setEditError("");
    try {
      const res = await api.put("/users/update", { username: editUsername });
      updateUserFields({ username: res.data.username });
      setIsEditing(false);
    } catch (err: any) {
      setEditError(err.response?.data?.message || "Failed to update username");
    } finally {
      setUpdating(false);
    }
  };

  const getBadges = (xp: number, completedCount: number) => {
    const earned = [];
    if (xp >= 10) earned.push({ icon: "⚡", label: "First XP", desc: "Reach 10 XP" });
    if (xp >= 50) earned.push({ icon: "🔥", label: "On Fire", desc: "Reach 50 XP" });
    if (xp >= 100) earned.push({ icon: "💎", label: "Diamond", desc: "Reach 100 XP" });
    if (completedCount >= 1) earned.push({ icon: "🎯", label: "First Lesson", desc: "Complete 1 lesson" });
    if (completedCount >= 3) earned.push({ icon: "🏆", label: "Hat Trick", desc: "Complete 3 lessons" });
    if (completedCount >= 5) earned.push({ icon: "🦉", label: "Wise Owl", desc: "Complete 5 lessons" });
    return earned;
  };

  const formattedJoinDate = () => {
    if (!user?.createdAt) return "Joined recently";
    const date = new Date(user.createdAt);
    return `Joined ${date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
  };

  if (!user) {
    return <ProfileSkeleton />;
  }

  const badges = getBadges(user.xp, stats?.totalLessonsCompleted || 0);

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
        <h1 className="text-xl font-bold text-primary">👤 User Profile</h1>
        <div className="flex items-center gap-4">
          <span className="text-warning">🔥 {user.streak}</span>
          <span className="text-primary">⚡ {user.xp} XP</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* User Card */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-extrabold text-white shadow-lg ${getAvatarColor(user.username)}`}>
            {getInitials(user.username)}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="max-w-xs mx-auto md:mx-0">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-xl border border-gray-700 outline-none focus:border-primary text-lg font-bold"
                    maxLength={25}
                  />
                  <button
                    onClick={handleSaveUsername}
                    disabled={updating}
                    className="bg-primary hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    {updating ? "..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditUsername(user.username);
                      setEditError("");
                    }}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-400 px-3 py-2 rounded-xl transition-all"
                  >
                    ✕
                  </button>
                </div>
                {editError && <p className="text-danger text-xs mt-1 text-left">{editError}</p>}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h2 className="text-3xl font-bold text-white">{user.username}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-primary transition-all text-sm p-1"
                    title="Edit Username"
                  >
                    ✏️
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-1">{user.email}</p>
                <p className="text-gray-500 text-xs mt-2">{formattedJoinDate()}</p>
              </div>
            )}
          </div>
        </div>

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
            <p className="text-3xl font-extrabold text-orange-500">🏆 {stats?.longestStreak ?? user.longestStreak ?? 0}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">Longest Streak</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 text-center transition-all hover:scale-105">
            <p className="text-3xl font-extrabold text-danger">❤️ {user.hearts}</p>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase tracking-wider">Hearts left</p>
          </div>
        </div>

        {/* Sub-grid: Badges & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Badges Grid */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              🏅 Earned Badges ({badges.length})
            </h3>
            {badges.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-3xl mb-2">🎯</p>
                <p className="text-sm">No badges earned yet. Complete lessons to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.label}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center transition-all hover:border-primary"
                    title={badge.desc}
                  >
                    <p className="text-3xl mb-1">{badge.icon}</p>
                    <p className="text-xs font-bold text-white truncate">{badge.label}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{badge.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Languages Started */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              📚 Languages Started
            </h3>
            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-800 border border-gray-700 p-4 rounded-xl animate-pulse h-16" />
                ))}
              </div>
            ) : !stats?.languagesStarted || stats.languagesStarted.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-3xl mb-2">🚀</p>
                <p className="text-sm">No languages started yet. Pick one on the home page!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {stats.languagesStarted.map((lang) => {
                  const meta = languageMetaData[lang.language] || { name: lang.language, icon: "💻" };
                  const percent = lang.totalLessons > 0 ? (lang.lessonsCompleted / lang.totalLessons) * 100 : 0;
                  return (
                    <div key={lang.language} className="bg-gray-800 border border-gray-700 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold flex items-center gap-2">
                          <span className="text-2xl">{meta.icon}</span>
                          <span>{meta.name}</span>
                        </span>
                        <span className="text-sm text-gray-400 font-semibold">
                          {lang.lessonsCompleted}/{lang.totalLessons} Completed
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-dark text-white animate-pulse">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <div className="w-16 h-6 bg-gray-800 rounded" />
        <div className="w-24 h-6 bg-gray-800 rounded" />
        <div className="w-20 h-6 bg-gray-800 rounded" />
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* User Card */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-800" />
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="w-32 h-8 bg-gray-800 rounded mx-auto md:mx-0" />
            <div className="w-48 h-4 bg-gray-800 rounded mx-auto md:mx-0" />
            <div className="w-24 h-3 bg-gray-800 rounded mx-auto md:mx-0" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-2xl p-5 h-24" />
          ))}
        </div>

        {/* Sub-grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 h-56" />
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 h-56" />
        </div>
      </div>
    </div>
  );
}
