import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import LessonPage from "./pages/LessonPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuthStore } from "./store/authStore";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/home" /> : <AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={token ? <HomePage /> : <Navigate to="/" />} />
        <Route path="/learn/:language" element={token ? <LearnPage /> : <Navigate to="/" />} />
        <Route path="/lesson/:id" element={token ? <LessonPage /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path="/leaderboard" element={token ? <LeaderboardPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;