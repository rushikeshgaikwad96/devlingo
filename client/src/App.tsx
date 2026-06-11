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
import AuthModal from "./components/AuthModal";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const setAuthModal = useAuthStore((state) => state.setAuthModal);

  if (!token) {
    setTimeout(() => {
      setAuthModal(true, "login");
    }, 50);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  const authModalOpen = useAuthStore((state) => state.authModalOpen);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/learn/:language" element={<LearnPage />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {authModalOpen && <AuthModal />}
    </BrowserRouter>
  );
}

export default App;