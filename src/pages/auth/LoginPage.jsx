import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, ArrowRight } from "lucide-react";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate(
      result.user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard"
    );
  };

  const fillDemo = (role) => {
    if (role === "admin")
      setForm({ email: "admin@shms.ac", password: "admin123" });
    else setForm({ email: "james@student.ac", password: "student123" });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-navy-950 via-navy-900 to-navy-700 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8 animate-slide-up">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center mx-auto mb-4">
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-display text-white">Welcome back</h1>
          <p className="text-navy-300 mt-1 text-sm">
            Sign in to your SHMS account
          </p>
        </div>
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          {error && (
            <div className="mb-4">
              <Alert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center mt-2"
            >
              Sign In <ArrowRight size={15} />
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-navy-700 font-medium hover:text-navy-900"
              >
                Register
              </Link>
            </p>
          </div>
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wide font-medium">
              Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemo("admin")}
                className="text-xs bg-navy-50 hover:bg-navy-100 text-navy-700 rounded-lg px-3 py-2.5 transition-colors text-left"
              >
                <span className="font-semibold block">Admin</span>
                <span className="text-navy-500">admin@shms.ac</span>
              </button>
              <button
                onClick={() => fillDemo("student")}
                className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg px-3 py-2.5 transition-colors text-left"
              >
                <span className="font-semibold block">Student</span>
                <span className="text-gray-500">james@student.ac</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
