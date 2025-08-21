"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { createClient } from "../lib/supabase/browser";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <nav className="fixed bg-primary px-6 py-4 flex items-center justify-between shadow-md w-full z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <FaRegFileAlt className="text-2xl text-white" />
        <Link href="/" className="text-xl font-bold text-white">
          makeResume
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-6 text-sm font-medium text-background">
        <Link href="/" className="hover:text-neutral-50">
          Home
        </Link>
        <Link href="/about" className="hover:text-neutral-50">
          About
        </Link>
        <Link href="/service" className="hover:text-neutral-50">
          Service
        </Link>
        {user && (
          <Link href="/dashboard" className="hover:text-neutral-50">
            Dashboard
          </Link>
        )}
        <Link href="/contact" className="hover:text-neutral-50">
          Contact
        </Link>
      </ul>

      {/* Auth Buttons / Profile */}
      {user ? (
        <div className="relative flex items-center space-x-4 text-white font-semibold">
          {/* Profile button */}
          <button
            onClick={() => setShowLogout((prev) => !prev)}
            className="hover:opacity-80"
          >
            Hi, {user.user_metadata?.name || user.email}
          </button>

          {/* Logout dropdown */}
          {showLogout && (
            <div className="absolute right-0 mt-20 bg-white text-black rounded-md shadow-lg">
              <LogoutButton />
            </div>
          )}
        </div>
      ) : (
        <div className="space-x-3">
          <Link href="/login">
            <button className="px-3 py-1 shadow-md text-background rounded-md hover:text-gray-100 hover:bg-secondary hover:text-background transition-all duration-200 font-semibold">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-3 py-1 shadow-md bg-background text-primary rounded-md hover:bg-primary hover:text-background transition-all duration-200 font-semibold">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
