import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger/5 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center max-w-lg z-10">
        {/* Giant 404 */}
        <h1 className="text-9xl font-black text-primary tracking-wider select-none mb-4 animate-pulse">
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Lost in the code?
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The module you are looking for does not exist or has been compiled to a different location.
        </p>

        {/* Programming joke/block mockup */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-left font-mono text-sm text-gray-300 mb-8 shadow-2xl relative overflow-hidden">
          <div className="flex gap-1.5 mb-4">
            <span className="w-3.5 h-3.5 rounded-full bg-danger opacity-85" />
            <span className="w-3.5 h-3.5 rounded-full bg-warning opacity-85" />
            <span className="w-3.5 h-3.5 rounded-full bg-primary opacity-85" />
          </div>
          <p className="text-gray-500">// Exception thrown at route compilation</p>
          <p className="mt-1">
            <span className="text-pink-500">const</span> <span className="text-blue-400">route</span> = <span className="text-yellow-400">window</span>.<span className="text-blue-400">location</span>.<span className="text-blue-400">pathname</span>;
          </p>
          <p className="mt-1">
            <span className="text-pink-500">if</span> (<span className="text-blue-400">route</span> === <span className="text-green-400">"unknown"</span>) &#123;
          </p>
          <p className="pl-4 text-danger mt-1">
            <span className="text-pink-500">throw new</span> <span className="text-yellow-400">PageNotFoundError</span>(<span className="text-green-400">"Lost in the code?"</span>);
          </p>
          <p className="mt-1">&#125;</p>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/home")}
          className="bg-primary hover:bg-green-600 text-white font-extrabold px-8 py-3.5 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-primary/20"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
