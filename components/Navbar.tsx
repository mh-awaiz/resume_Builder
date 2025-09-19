"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi"; // for mobile menu toggle
import { createClient } from "../lib/supabase/browser";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [showLogout, setShowLogout] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu toggle

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

      {/* Desktop Navigation */}
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

      {/* Mobile Menu Button */}
      <div className="md:hidden text-white text-2xl">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Desktop Auth */}
      <div className="hidden md:flex">
        {user ? (
          <div className="relative flex items-center space-x-4 text-white font-semibold">
            <button
              onClick={() => setShowLogout((prev) => !prev)}
              className="hover:opacity-80"
            >
              Hi, {user.user_metadata?.name || user.email}
            </button>
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
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-primary shadow-md flex flex-col items-center space-y-4 py-6 md:hidden">
          {[
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
            { name: "Service", href: "/service" },
            ...(user ? [{ name: "Dashboard", href: "/dashboard" }] : []),
            { name: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="w-11/12 text-center py-2 rounded-lg text-white font-medium
                   transition-all duration-300 relative group hover:text-primary "
            >
              <span className="relative z-10">{item.name}</span>
              {/* Cool hover effect */}
              <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 
                         bg-gradient-to-r from-secondary via-background to-primary 
                         transition-opacity duration-300"
              ></span>
            </Link>
          ))}

          {/* Mobile Auth */}
          {user ? (
            <button
              onClick={() => {
                setShowLogout(true);
                setMenuOpen(false);
              }}
              className="w-11/12 py-2 rounded-lg text-white font-semibold transition-all duration-300 relative group"
            >
              <span className="relative z-10">Logout</span>
              <span
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 
                         bg-gradient-to-r from-red-400 to-red-600 
                         transition-opacity duration-300"
              ></span>
            </button>
          ) : (
            <div className="flex flex-col space-y-3 w-11/12">
              <Link href="/login">
                <button
                  className="w-full py-2 rounded-lg bg-background text-primary font-semibold 
                             transition-all duration-300 relative group"
                >
                  <span className="relative z-10">Login</span>
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 
                             bg-gradient-to-r from-primary via-secondary to-background 
                             transition-opacity duration-300"
                  ></span>
                </button>
              </Link>
              <Link href="/signup">
                <button
                  className="w-full py-2 rounded-lg bg-secondary text-background font-semibold 
                             transition-all duration-300 relative group"
                >
                  <span className="relative z-10">Sign Up</span>
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 
                             bg-gradient-to-r from-background via-primary to-secondary 
                             transition-opacity duration-300"
                  ></span>
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
