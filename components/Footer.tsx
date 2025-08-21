'use client';
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-text py-6 flex justify-center items-center border-t border-gray-800 text-slate-200 font-semibold">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-col justify-between items-center">
        <div className="mt-4 md:mt-0 grid grid-cols-1 text-center sm:flex sm:flex-row gap-2 p-2">
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
            href="/Contact"
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
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()}{" "}
          <Link href="/" className="text-background font-semibold">
            MakeResume.
          </Link>
          <span> </span>All rights reserved.
        </p>
      </div>
    </footer>
  );
}
