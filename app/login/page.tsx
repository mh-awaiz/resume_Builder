"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/browser";
import { useRouter } from "next/navigation";

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

    // Important: force page reload so server components read fresh cookies
    // router.refresh(); 
    router.push("/dashboard");
  };

  return (
    <div className="h-screen flex justify-center items-center flex-col bg-background text-primary">
      <h2 className="text-2xl font-bold mb-4 text-primary">Login</h2>
      <form onSubmit={handleLogin} className="">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full p-3 mb-4 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full p-3 mb-4 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 font-semibold w-full transition-all duration-200"
        >
          Login
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
