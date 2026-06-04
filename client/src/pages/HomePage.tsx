import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-dark text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-primary">🦉 DevLingo</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-warning text-xl">🔥</span>
            <span className="font-bold">{user?.streak ?? 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-primary">{user?.xp ?? 0} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">❤️</span>
            <span className="font-bold text-danger">{user?.hearts ?? 5}</span>
          </div>
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
            Welcome back, <span className="text-primary">{user?.username ?? "Learner"}</span>! 👋
          </h2>
          <p className="text-gray-400 mt-2">Choose a language to start learning</p>
        </div>

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