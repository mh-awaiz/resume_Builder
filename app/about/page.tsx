import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | MakeResume",
  description:
    "Learn more about MakeResume — the AI-powered resume builder helping job seekers create professional, modern resumes with ease.",
  keywords: [
    "AI Resume Builder",
    "Online Resume Maker",
    "MakeResume",
    "Professional Resume Templates",
    "Smart Resume Builder",
  ],
  openGraph: {
    title: "About Us | MakeResume",
    description:
      "MakeResume is your smart, AI-powered resume builder. Create modern, professional resumes with confidence.",
    url: "https://yourdomain.com/about",
    siteName: "MakeResume",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "MakeResume - AI Resume Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center w-full text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-primary">
        About Us
      </h1>
      <p className="text-base sm:text-lg text-black leading-relaxed font-medium">
        Welcome to <span className="font-bold">MakeResume</span> — your smart,
        AI-powered resume builder. We help job seekers design professional
        resumes effortlessly, guiding them step-by-step with smart suggestions
        and beautiful templates.
      </p>
      <p className="mt-6 text-base sm:text-lg text-black font-medium">
        Our mission is to empower every job hunter with a strong, modern resume
        that showcases their skills with confidence and clarity.
      </p>
    </main>
  );
}
