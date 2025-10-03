"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";

export default function SignUpPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      setMessage("You must agree to the Terms & Conditions before signing up.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      setMessage(error.message);
    } else {
      if (data.user?.identities?.length === 0) {
        setMessage("This email is already registered. Please log in instead.");
      } else {
        setMessage("Signup successful! Please check your email to confirm.");
        router.push("/login");
      }
    }
  };

  return (
    <>
     
      <Head>
        <title>Sign Up | CViEx</title>
        <meta
          name="description"
          content="Create a free account on CViEx and start building your AI-powered professional resumes today."
        />
        <meta
          name="keywords"
          content="signup, create account, resume builder, ai resume"
        />
        <meta name="author" content="CViEx" />
      </Head>

      <div className="min-h-screen flex items-center justify-center px-4 bg-background text-primary">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>

          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="border rounded w-full p-3 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded w-full p-3 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded w-full p-3 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
            />

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/terms&conditions"
                  className="text-blue-600 underline font-bold"
                >
                  Terms & Conditions
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={!agree}
              className={`w-full px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
                agree
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              Sign Up
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-gray-600 text-center">{message}</p>
          )}
        </div>
      </div>
    </>
  );
}
