"use client";

import React, { useState } from "react";
import { toaster } from "../../components/ui/toaster";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [formValues, setFormValues] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Sending...");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "8db1534e-fa96-4602-b422-7767288add4a");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Form Submitted Successfully!");
        toaster.create({
          description: "Message sent successfully!",
          type: "info",
        });
        form.reset();
        setFormValues({ name: "", email: "", message: "" });
      } else {
        setStatus(data.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus("Something went wrong.");
    }
  };

  return (
    <main className="min-h-[90vh] px-6 text-primary bg-background font-semibold w-full flex justify-center items-center flex-col">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full border-2 px-3 py-2 rounded outline-none focus:border-primary transition-all duration-200 bg-background"
        />
        <input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="w-full border-2 px-3 py-2 rounded outline-none focus:border-primary transition-all duration-200 bg-background"
        />
        <textarea
          name="message"
          value={formValues.message}
          onChange={handleChange}
          placeholder="Your Message"
          required
          rows={5}
          className="w-full border-2 px-3 py-2 rounded outline-none focus:border-primary transition-all duration-200 bg-background"
        ></textarea>
        <button
          type="submit"
          className="bg-primary text-white font-bold px-4 py-2 w-full rounded hover:bg-secondary transition-all duration-200"
        >
          Send
        </button>
        <p>{status}</p>
      </form>
    </main>
  );
}
