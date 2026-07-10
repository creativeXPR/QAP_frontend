import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "../lib/icons";
import { getUserRole, loginUser, ROLE_HOME_ROUTES } from "../lib/auth";
import { useToast } from '../components/common/ToastContext';

export default function SignIn() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(form.email, form.password);

      const role = data.user?.status || getUserRole();
      if (role && ROLE_HOME_ROUTES[role]) {
        addToast('success', 'Signed in successfully.');
        navigate(ROLE_HOME_ROUTES[role]);
      } else {
        // Role missing/unrecognized — send them somewhere safe rather
        // than a dead end. Revisit this once a real "complete your
        // profile" flow exists to act on `data.profile_complete`.
        navigate("/profile/me");
      }
    } catch (err) {
      addToast('error', err.message || "An error occurred while signing in.");
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
          University of Ibadan
        </h1>
        
        <h1 className="text-white text-2xl font-semibold mb-3">
          Directorate of Quality Assurance
        </h1>
        <p className="text-blue-100 text-sm max-w-xs">
          Quality Assurance...doing the right thing right every time.
        </p>
      </div>

      {/* Mobile top banner — logo only, no heading */}
      <div className="flex md:hidden items-center justify-start px-6 py-4">
        <img src="/logo.png" alt="University crest" className="h-16 w-auto object-contain" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-16">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to access your Quality Assurance Workspace
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Username
              </label>
              <input
                type="text"
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
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-brand focus:ring-brand"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-brand font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-[10px] transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-brand font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
