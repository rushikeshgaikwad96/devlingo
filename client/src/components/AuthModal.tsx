import { useState } from "react";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function AuthModal() {
  const { authModalTab, setAuthModal, setUser } = useAuthStore();
  const [isLogin, setIsLogin] = useState(authModalTab === "login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;

      const res = await api.post(endpoint, payload);
      setUser(res.data.user, res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setAuthModal(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-slideUp"
      >
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setAuthModal(false)}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-all text-xl w-8 h-8 rounded-full bg-gray-800/50 hover:bg-gray-800 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Logo / Header */}
        <div className="text-center mb-6 mt-2">
          <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
            <span className="text-primary">🦉</span> DevLingo
          </h2>
          <p className="text-gray-400 text-sm mt-1">Unlock your coding potential</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-gray-850 rounded-2xl p-1 mb-6 border border-gray-800">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              isLogin
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              !isLogin
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <input
                type="text"
                name="username"
                required
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          )}
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm py-2.5 px-4 rounded-xl text-center font-semibold animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-green-600 active:scale-98 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/15 disabled:opacity-55 disabled:cursor-not-allowed text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-gray-500 text-xs text-center mt-6">
          By signing in, you agree to our terms & conditions.
        </p>
      </div>
    </div>
  );
}
