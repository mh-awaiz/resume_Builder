"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
// Adjust this path if your project structure differs:
import { createClient as createSupabaseClient } from "../lib/supabase/browser";

const plans = [
  {
    name: "Free",
    price: "₹0",
    features: ["Create up to 3 Resumes", "Basic Templates", "Export to PDF"],
  },
  {
    name: "Lifetime",
    price: "₹100 (one-time)",
    features: ["Unlimited Resume Creation", "All Premium Templates", "Lifetime Access"],
  },
];

export default function Pricing() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [processing, setProcessing] = useState(false);

  const handleBuyLifetime = async () => {
    setProcessing(true);
    try {
      // ensure user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // redirect to login if not logged in
        router.push("/login");
        return;
      }

      // Create order on the server (server will use secret key)
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 100 * 100 }), // ₹100 => 10000 paise
      });

      const orderPayload = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderPayload.error || "Order creation failed");

      const { order, key } = orderPayload; // server returns { order, key }
      if (!order || !order.id) throw new Error("Invalid order response from server");

      const options: any = {
        key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // public key
        amount: order.amount,
        currency: order.currency,
        name: "MakeResume",
        description: "Lifetime Access - Unlimited Resumes",
        order_id: order.id,
        handler: async function (response: any) {
          // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.id,
              }),
            });

            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyJson.error || "Verification failed");

            alert("Payment successful — your account is upgraded to Lifetime!");
            // Navigate to collections or refresh
            router.push("/dashboard/collections");
          } catch (err: any) {
            console.error("Verification error:", err);
            alert("Payment succeeded but verification failed. Contact support.");
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || undefined,
          email: user.email || undefined,
        },
        theme: { color: "#155dfc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (resp: any) {
        console.error("Payment failed:", resp);
        alert("Payment failed: " + (resp.error?.description || "Unknown error"));
      });
      rzp.open();
    } catch (err: any) {
      console.error("handleBuyLifetime error:", err);
      alert(err.message || "Payment error");
    } finally {
      setProcessing(false);
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
            className="bg-gray-50 p-8 rounded-xl shadow-lg flex-1 hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold mb-4 text-secondary">{plan.name}</h3>
            <p className="text-3xl font-bold mb-6 text-primary">{plan.price}</p>
            <ul className="mb-6 text-gray-700">
              {plan.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>

            {plan.name === "Free" ? (
              <button className="bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
                Current Plan
              </button>
            ) : (
              <button
                onClick={handleBuyLifetime}
                disabled={processing}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  processing ? "bg-gray-400 text-white cursor-not-allowed" : "bg-primary text-white hover:bg-secondary"
                }`}
              >
                {processing ? "Processing..." : "Buy Lifetime"}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
