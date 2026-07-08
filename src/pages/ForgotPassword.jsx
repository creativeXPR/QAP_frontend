import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "../lib/icons";
import { requestPasswordReset } from "../lib/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
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
        <img
          src="/logo.png"
          alt="University crest"
          className="h-20 w-auto object-contain mb-6"
        />
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
        <img
          src="/logo.png"
          alt="University crest"
          className="h-14 w-auto object-contain mb-3"
        />
        <h1 className="text-white text-lg font-semibold">
          Quality Assurance Excellence
        </h1>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-16">
        <div className="w-full max-w-sm">
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand mb-6"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>

          {!submitted ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Forgot your password?
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Enter the email linked to your account and we'll send you a
                link to reset your password.
              </p>

              {error && (
                <div className="mb-4 rounded-md bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@ui.edu.ng"
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-medium py-2.5 rounded-[10px] transition-colors"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-brand/10">
                <Mail size={26} className="text-brand" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Check your inbox
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                If an account exists for <span className="font-medium text-gray-700">{email}</span>,
                a password reset link is on its way.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-brand font-medium hover:underline"
              >
                Didn't get it? Try a different email
              </button>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Remembered your password?{" "}
            <Link to="/sign-in" className="text-brand font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
