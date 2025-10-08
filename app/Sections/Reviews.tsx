"use client";

import { motion } from "framer-motion";

const reviews = [
  {
    name: "Anas Hasan",
    feedback:
      "Website is good specially for freshers who don't know how to prepare CV it is very helpful",
  },
  { name: "Vansh", feedback: "Easy, fast, and professional." },
  {
    name: "Prashant",
    feedback:
      "CViEx is a game-changer! Instantly created ultra-professional CVs with ease. A must-try for those who struggles with CV!",
  },
];

export default function Reviews() {
  return (
    <section className="w-full py-24 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold text-primary mb-12">User Reviews</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
        {reviews.map((review, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg flex-1 hover:shadow-2xl transition-shadow duration-300"
          >
            <p className="italic mb-4 text-gray-700">"{review.feedback}"</p>
            <h4 className="font-semibold text-secondary">{review.name}</h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
