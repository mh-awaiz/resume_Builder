"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/browser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password states
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return setError(error.message);

    router.push("/dashboard");
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`, // This will open your reset password page
    });

    if (error) {
      setResetMessage(error.message);
    } else {
      setResetMessage("✅ Password reset email sent! Check your inbox.");
      setResetEmail("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background text-primary">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded w-full p-3 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
          />

          {/* Password field with show/hide button */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border rounded w-full p-3 pr-10 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-primary font-semibold focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Forgot Password link */}
          <div className="flex justify-between text-sm">
            <p className="text-gray-500 font-light">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-primary font-bold">
                Sign Up
              </Link>
            </p>
            <button
              type="button"
              onClick={() => setShowReset(!showReset)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 font-semibold transition-all duration-200"
          >
            Login
          </button>
        </form>

        {/* Forgot password form */}
        {showReset && (
          <form
            onSubmit={handlePasswordReset}
            className="mt-6 border-t border-gray-200 pt-4 space-y-3"
          >
            <h3 className="text-lg font-semibold text-primary text-center">
              Reset Password
            </h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              className="border rounded w-full p-3 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 font-semibold transition-all duration-200"
            >
              Send Reset Link
            </button>
            {resetMessage && (
              <p className="text-sm text-center text-gray-600">
                {resetMessage}
              </p>
            )}
          </form>
        )}

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
}
