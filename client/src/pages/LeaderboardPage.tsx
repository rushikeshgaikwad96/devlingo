import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

interface LeaderboardUser {
  _id: string;
  username: string;
  xp: number;
  streak: number;
}

interface CurrentUserRank {
  rank: number;
  _id: string;
  username: string;
  xp: number;
  streak: number;
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [currentUserRankData, setCurrentUserRankData] = useState<CurrentUserRank | null>(null);
  const [tab, setTab] = useState<"all-time" | "weekly">("all-time");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/leaderboard?type=${tab}`);
        setLeaders(res.data.leaders);
        setCurrentUserRankData(res.data.currentUser);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [tab]);

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  if (loading) {
    return <LeaderboardSkeleton tab={tab} setTab={setTab} user={user} navigate={navigate} />;
  }

  // Check if current user is within the top 10
  const isCurrentUserInTop10 = leaders.some((l) => l.username === user?.username);

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
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <span>🏆</span> Leaderboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-warning">🔥 {user?.streak ?? 0}</span>
          <span className="text-primary">⚡ {user?.xp ?? 0} XP</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-extrabold text-center mb-2">Hall of Fame</h2>
        <p className="text-gray-400 text-center mb-8">Compete with programmers around the world</p>

        {/* Tab Switcher */}
        <div className="flex bg-gray-900 border border-gray-700 rounded-2xl p-1 max-w-xs mx-auto mb-10 shadow-md">
          <button
            onClick={() => setTab("all-time")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              tab === "all-time"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTab("weekly")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              tab === "weekly"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            This Week
          </button>
        </div>

        {/* Leaders List */}
        <div className="flex flex-col gap-4">
          {leaders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-900 border border-gray-700 rounded-2xl">
              <p className="text-4xl mb-2">🏁</p>
              <p>No activity recorded yet for this period.</p>
            </div>
          ) : (
            leaders.map((leader, index) => (
              <div
                key={leader._id}
                style={{ animationDelay: `${index * 60}ms`, opacity: 0 }}
                className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 hover:scale-102 animate-slideUp ${
                  leader.username === user?.username
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/5"
                    : "border-gray-700 bg-gray-900"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xl font-black">
                    {getMedal(index)}
                  </div>
                  <div>
                    <p
                      className={`font-black text-lg ${
                        leader.username === user?.username ? "text-primary" : "text-white"
                      }`}
                    >
                      {leader.username}
                      {leader.username === user?.username && (
                        <span className="ml-2 text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-gray-400 text-xs font-semibold mt-0.5">
                      🔥 {leader.streak} day streak
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-extrabold text-xl">
                    {leader.xp} XP
                  </p>
                </div>
              </div>
            ))
          )}

          {/* Current User Rank Card (if outside Top 10) */}
          {!isCurrentUserInTop10 && currentUserRankData && (
            <>
              <div className="flex justify-center my-2 text-gray-500 font-bold tracking-widest animate-pulse">
                ••••••
              </div>
              <div
                className="p-5 rounded-2xl border border-primary bg-primary/10 flex items-center justify-between transition-all hover:scale-102 animate-slideUp shadow-lg shadow-primary/5"
                style={{ animationDelay: `${leaders.length * 60}ms`, opacity: 0 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-md font-black text-primary">
                    #{currentUserRankData.rank}
                  </div>
                  <div>
                    <p className="font-black text-lg text-primary">
                      {currentUserRankData.username}
                      <span className="ml-2 text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        You
                      </span>
                    </p>
                    <p className="text-gray-400 text-xs font-semibold mt-0.5">
                      🔥 {currentUserRankData.streak} day streak
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-extrabold text-xl">
                    {currentUserRankData.xp} XP
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface SkeletonProps {
  tab: "all-time" | "weekly";
  setTab: (tab: "all-time" | "weekly") => void;
  user: any;
  navigate: any;
}

function LeaderboardSkeleton({ tab, setTab, user, navigate }: SkeletonProps) {
  return (
    <div className="min-h-screen bg-dark text-white animate-pulse">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <button
          onClick={() => navigate("/home")}
          className="text-gray-400 font-semibold"
        >
          ← Home
        </button>
        <h1 className="text-xl font-bold text-primary">🏆 Leaderboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-warning">🔥 {user?.streak ?? 0}</span>
          <span className="text-primary">⚡ {user?.xp ?? 0} XP</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="w-48 h-8 bg-gray-800 rounded mx-auto mb-2" />
        <div className="w-64 h-4 bg-gray-800 rounded mx-auto mb-8" />

        {/* Switcher Skeleton */}
        <div className="flex bg-gray-900 border border-gray-700 rounded-2xl p-1 max-w-xs mx-auto mb-10 h-11">
          <button
            onClick={() => setTab("all-time")}
            className={`flex-1 rounded-xl text-sm font-bold ${tab === "all-time" ? "bg-gray-800 text-white" : "text-gray-600"}`}
          >
            All Time
          </button>
          <button
            onClick={() => setTab("weekly")}
            className={`flex-1 rounded-xl text-sm font-bold ${tab === "weekly" ? "bg-gray-800 text-white" : "text-gray-600"}`}
          >
            This Week
          </button>
        </div>

        {/* List Skeletons */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-2xl p-5 h-20" />
          ))}
        </div>
      </div>
    </div>
  );
}