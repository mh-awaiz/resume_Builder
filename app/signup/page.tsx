"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/browser";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false); // ✅ checkbox state
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      setMessage("You must agree to the Terms & Conditions before signing up.");
      return;
    }

    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    //   options: {
    //     data: { name }, // store custom fields
    //   },
    // })

    //     if (error) {
    //       setMessage(error.message)
    //     } else {
    //       setMessage('Signup successful! Please check your email to confirm.')
    //       router.push('/dashboard')
    //     }
    //   }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      if (data.user?.identities?.length === 0) {
        // Email already registered
        setMessage("This email is already signed up. Please log in instead.");
      } else {
        setMessage(
          "Signup successful! Please check your email to confirm before logging in."
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-background text-primary">
      <h1 className="text-xl font-bold text-center mb-4">Sign Up</h1>
      <form
        onSubmit={handleSignUp}
        className="space-y-4 max-w-sm w-full flex justify-center items-center flex-col"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="border rounded w-full p-3 mb-4 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full p-3 mb-4 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full p-3 mb-4 outline-none font-semibold text-primary bg-transparent focus:border-primary focus:ring-1 focus:ring-primary"
        />

        {/* ✅ Terms & Conditions checkbox */}
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
          className={`px-6 py-2 bg-blue-600 text-white rounded-mdshadow-md hover:bg-blue-700 font-semibold w-full transition-all duration-200 ${
            agree
              ? "bg-blue-600  text-white"
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
  );
}
