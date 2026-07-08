import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "../lib/icons";
import { registerUser } from "../lib/auth";

const STATUS_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "focal_person", label: "Focal Person" },
  { value: "principle_officer", label: "Principal Officer" },
  { value: "admin", label: "Administrator" },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    status: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        passwordConfirm: form.confirmPassword,
        status: form.status,
      });
      navigate("/sign-in");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left brand panel — hidden on mobile, shown on md+ */}
      <div className="hidden md:flex md:w-1/2 bg-brand flex-col items-center justify-center px-10 py-16 text-center">
        <img src="/logo.png" alt="University crest" className="h-20 w-auto object-contain mb-6" />
        <h1 className="text-white text-2xl font-semibold mb-3">
          Quality Assurance Excellence
        </h1>
        <p className="text-blue-100 text-sm max-w-xs">
          Streamlining institutional quality management and continuous
          improvement at the University of Ibadan
        </p>
      </div>

      {/* Mobile top banner */}
      <div className="flex md:hidden bg-brand flex-col items-center justify-center px-6 py-8 text-center">
        <img src="/logo.png" alt="University crest" className="h-14 w-auto object-contain mb-3" />
        <h1 className="text-white text-lg font-semibold">
          Quality Assurance Excellence
        </h1>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-16">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Register to submit and manage quality assurance forms.
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                University Status
              </label>
              <select
                name="status"
                required
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              >
                <option value="">Select an option</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="your.email@ui.edu.ng"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                At least 8 characters with uppercase, lowercase and number
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-[10px] transition-colors"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-brand font-medium hover:underline">
              Sign In
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-6">
            Need help? Contact{" "}
            <a href="#" className="text-brand hover:underline">
              Quality Assurance Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}