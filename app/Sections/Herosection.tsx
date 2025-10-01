"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full bg-white py-32 flex flex-col lg:flex-row items-center justify-between min-h-screen px-6 md:px-12">
      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left">
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
          className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8 mx-auto lg:mx-0"
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
      </div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="flex-1 mt-12 lg:mt-0 flex justify-center lg:justify-end"
      >
        <Image
          src="/heroimage.jpg"
          alt="Resume Illustration"
          width={500}
          height={400}
          className="w-full max-w-md lg:max-w-lg object-contain"
        />
      </motion.div>
    </section>
  );
}
