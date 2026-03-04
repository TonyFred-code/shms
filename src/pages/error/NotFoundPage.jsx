import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function NotFoundPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const home =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user
        ? "/student/dashboard"
        : "/login";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <p className="text-8xl font-display text-navy-950 leading-none">404</p>
        <p className="text-xl font-display text-navy-700 mt-2">
          Page Not Found
        </p>
        <p className="text-sm text-gray-500 mt-3 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={15} /> Go Back
        </button>
        <Link
          to={home}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-950 text-white text-sm hover:bg-navy-800 transition-colors"
        >
          <Home size={15} /> Home
        </Link>
      </div>
    </div>
  );
}
