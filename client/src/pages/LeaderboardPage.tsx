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

export default function LeaderboardPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get("/users/leaderboard");
                setLeaders(res.data);
            } catch {
                console.log("error fetching leaderboard");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getMedal = (index: number) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `#${index + 1}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <p className="text-white text-xl animate-pulse">Loading leaderboard...</p>
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
                <h1 className="text-xl font-bold text-primary">🏆 Leaderboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-warning">🔥 {user?.streak ?? 0}</span>
                    <span className="text-primary">⚡ {user?.xp ?? 0} XP</span>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-8 py-12">
                <h2 className="text-2xl font-bold mb-2">Top Learners</h2>
                <p className="text-gray-400 mb-8">Compete with other developers!</p>

                <div className="flex flex-col gap-4">
                    {leaders.map((leader, index) => (
                        <div
                            key={leader._id}
                            className={`p-6 rounded-2xl border flex items-center justify-between transition-all ${leader.username === user?.username
                                    ? "border-primary bg-primary/10"
                                    : "border-gray-700 bg-gray-900"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold">
                                    {getMedal(index)}
                                </div>
                                <div>
                                    <p className={`font-bold text-lg ${leader.username === user?.username ? "text-primary" : "text-white"
                                        }`}>
                                        {leader.username}
                                        {leader.username === user?.username && (
                                            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                                You
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        🔥 {leader.streak} day streak
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-primary font-bold text-xl">
                                    {leader.xp} XP
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}