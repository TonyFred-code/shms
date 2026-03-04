import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, ArrowRight } from "lucide-react";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";

const COURSES = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Medicine",
  "Law",
  "Economics",
  "Architecture",
  "Mathematics",
  "Physics",
  "Chemistry",
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.course) errs.course = "Please select your course";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setError("");
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-navy-950 via-navy-900 to-navy-700 flex items-center justify-center p-4 py-12">
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
          <h1 className="text-3xl font-display text-white">Create account</h1>
          <p className="text-navy-300 mt-1 text-sm">
            Register for hostel accommodation
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
                Full name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`input ${fieldErrors.name ? "border-red-400" : ""}`}
                placeholder="John Adebayo"
                required
              />
              {fieldErrors.name && (
                <span className="text-xs text-red-600">{fieldErrors.name}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`input ${fieldErrors.email ? "border-red-400" : ""}`}
                placeholder="john@student.ac"
                required
              />
              {fieldErrors.email && (
                <span className="text-xs text-red-600">
                  {fieldErrors.email}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="input"
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Course
                </label>
                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  className={`input ${fieldErrors.course ? "border-red-400" : ""}`}
                  required
                >
                  <option value="">Select course</option>
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {fieldErrors.course && (
                  <span className="text-xs text-red-600">
                    {fieldErrors.course}
                  </span>
                )}
              </div>
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
                  className={`input pr-10 ${fieldErrors.password ? "border-red-400" : ""}`}
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="text-xs text-red-600">
                  {fieldErrors.password}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                className={`input ${fieldErrors.confirm ? "border-red-400" : ""}`}
                placeholder="Re-enter password"
              />
              {fieldErrors.confirm && (
                <span className="text-xs text-red-600">
                  {fieldErrors.confirm}
                </span>
              )}
            </div>
            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center mt-1"
            >
              Create Account <ArrowRight size={15} />
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-navy-700 font-medium hover:text-navy-900"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
