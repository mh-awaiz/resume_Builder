"use client";

import { motion } from "framer-motion";

const features = [
  { title: "Fast & Easy", description: "Create your resume in minutes." },
  { title: "Customizable Templates", description: "Professional designs ready to use." },
  { title: "Download & Share", description: "Export PDF or share online instantly." },
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-24 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold text-primary mb-12">Features</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg flex-1 hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold mb-4 text-secondary">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
