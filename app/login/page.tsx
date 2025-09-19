"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/browser";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      {/* 🔹 SEO Meta Tags */}
      <Head>
        <title>Login | MakeResume</title>
        <meta
          name="description"
          content="Login to MakeResume to create, edit, and manage your AI-powered professional resumes."
        />
        <meta
          name="keywords"
          content="login, resume builder, ai resume, professional resumes"
        />
        <meta name="author" content="MakeResume" />
      </Head>

      {/* 🔹 Responsive Layout */}
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
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border rounded w-full p-3 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
            />

            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 font-semibold transition-all duration-200"
            >
              Login
            </button>
          </form>

          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </div>
      </div>
    </>
  );
}
