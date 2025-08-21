import React from "react";
import Link from "next/link";
export default function HeroSection() {
  return (
    <section className="bg-background px-6 py-12 h-screen w-full flex justify-center items-center">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary  mb-4">
            Welcome to Our Website
          </h1>
          <p className="text-lg text-black mb-6">
            Your one-stop solution for all your needs.
          </p>
          <Link href="/dashboard">
            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
