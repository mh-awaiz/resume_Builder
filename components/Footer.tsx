"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-text py-6 border-t border-gray-800 text-slate-200 font-semibold">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-2 text-center sm:text-left">
          <Link
            href="/"
            className="text-sm underline hover:text-cta transition"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm underline hover:text-cta transition"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-sm underline hover:text-cta transition"
          >
            Contact
          </Link>
          <Link
            href="/terms&conditions"
            className="text-sm underline hover:text-cta transition"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/policy"
            className="text-sm underline hover:text-cta transition"
          >
            Privacy & Policy
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm text-center md:text-right mt-2 md:mt-0">
          &copy; {new Date().getFullYear()}{" "}
          <Link
            href="/"
            className="text-background font-semibold hover:opacity-80 transition"
          >
            CViEx
          </Link>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
