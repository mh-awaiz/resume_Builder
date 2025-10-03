import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | CViEx",
  description:
    "Learn more about CViEx — the AI-powered resume builder helping job seekers create professional, modern resumes with ease.",
  keywords: [
    "AI Resume Builder",
    "Online Resume Maker",
    "CViEx",
    "Professional Resume Templates",
    "Smart Resume Builder",
  ],
  openGraph: {
    title: "About Us | CViEx",
    description:
      "CViEx is your smart, AI-powered resume builder. Create modern, professional resumes with confidence.",
    url: "https://cviex.com/about",
    siteName: "CViEx",
    images: [
      {
        url: "https://cviex.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "CViEx - AI Resume Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto py-16 px-6 min-h-screen text-gray-800">
      <h1 className="text-4xl font-bold text-center text-primary mb-8">
        About Us
      </h1>

      {/* Intro */}
      <p className="text-lg text-center leading-relaxed max-w-3xl mx-auto mb-12">
        Welcome to <span className="font-bold">CViEx</span> — your smart,
        AI-powered resume builder. We help job seekers design professional,
        modern resumes effortlessly, guiding them step by step with smart
        suggestions and beautiful templates.
      </p>

      {/* Mission Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3 text-primary">Our Mission</h2>
        <p className="leading-relaxed">
          Our mission is to empower every job seeker with a strong, modern
          resume that showcases their skills, achievements, and personality
          with confidence. We believe that the right resume can open the door
          to life-changing opportunities.
        </p>
      </section>

      {/* Vision Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3 text-primary">Our Vision</h2>
        <p className="leading-relaxed">
          We envision a future where AI helps simplify career growth, enabling
          anyone — from students to professionals — to create resumes that
          truly stand out in front of recruiters and applicant tracking systems
          (ATS).
        </p>
      </section>

      {/* Core Values */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3 text-primary">Our Values</h2>
        <ul className="list-disc list-inside space-y-2 leading-relaxed">
          <li>
            <span className="font-semibold">Simplicity:</span> Making resume
            creation effortless and stress-free.
          </li>
          <li>
            <span className="font-semibold">Innovation:</span> Using AI to
            deliver smart suggestions and modern templates.
          </li>
          <li>
            <span className="font-semibold">Empowerment:</span> Helping users
            take control of their career journey.
          </li>
          <li>
            <span className="font-semibold">Trust:</span> Protecting your data
            with the highest security standards.
          </li>
        </ul>
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3 text-primary">
          Why Choose CViEx?
        </h2>
        <p className="leading-relaxed">
          Unlike traditional resume builders, CViEx combines design excellence
          with artificial intelligence. Our platform doesn’t just provide
          templates — it guides you with personalized suggestions, ATS-friendly
          formatting, and professional wording that increases your chances of
          landing interviews.
        </p>
      </section>

      {/* Closing */}
      <p className="text-center text-gray-600 mt-12 text-sm">
        Together, let’s build resumes that get noticed. 🚀
      </p>
    </main>
  );
}
