"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    price: "₹0",
    features: ["Create up to 3 resumes", "Basic Templates", "Export to PDF"],
  },
  {
    name: "Lifetime",
    price: "₹100 (one-time)",
    features: ["Unlimited resumes", "All Premium Templates", "Lifetime Access"],
  },
];

export default function Pricing() {
  const router = useRouter();

  const handleClick = (planName: string) => {
    if (planName === "Free") {
      router.push("/dashboard");
    } else if (planName === "Lifetime") {
      // Razorpay checkout placeholder
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Add your Razorpay Key
        amount: 10000, // ₹100 in paise
        currency: "INR",
        name: "MakeResume",
        description: "Lifetime Access Plan",
        handler: function (response: any) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
          // TODO: Update user plan status in your database
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#2563EB",
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  };

  return (
    <section className="w-full py-24 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold text-primary mb-12">Pricing Plans</h2>

      <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg flex-1 hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold mb-4 text-secondary">{plan.name}</h3>
            <p className="text-3xl font-bold mb-6 text-primary">{plan.price}</p>

            <ul className="mb-6 text-gray-700 space-y-2">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>

            <button
              onClick={() => handleClick(plan.name)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-all duration-300 w-full"
            >
              {plan.name === "Free" ? "Start Free" : "Get Lifetime Access"}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
