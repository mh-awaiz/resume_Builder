"use client";

import { motion } from "framer-motion";

const plans = [
  { name: "Basic", price: "$10/mo", features: ["One Template", "PDF Export"] },
  { name: "Pro", price: "$30/mo", features: ["All Templates", "PDF & Online Share", "Priority Support"] },
  { name: "Enterprise", price: "$60/mo", features: ["Custom Templates", "Team Accounts", "Full Support"] },
];

export default function Pricing() {
  return (
    <section className="w-full py-24 bg-white text-center">
      <h2 className="text-4xl font-bold text-primary mb-12">Pricing Plans</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-gray-50 p-8 rounded-xl shadow-lg flex-1 hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold mb-4 text-secondary">{plan.name}</h3>
            <p className="text-3xl font-bold mb-6 text-primary">{plan.price}</p>
            <ul className="mb-6 text-gray-700">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-all duration-300">
              Choose Plan
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
