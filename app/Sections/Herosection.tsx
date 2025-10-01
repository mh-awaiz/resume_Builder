"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full bg-white py-32 flex flex-col items-center justify-center text-center">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold text-primary mb-6"
      >
        Build Your Professional Resume
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8"
      >
        Make a resume that stands out. Easy, fast, and fully customizable with
        professional templates.
      </motion.p>
      <Link href="/dashboard">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-secondary transition-all duration-300"
        >
          Get Started
        </motion.button>
      </Link>
    </section>
  );
}
