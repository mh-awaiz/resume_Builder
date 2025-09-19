import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      {/* 🔹 SEO + Open Graph + Twitter Meta Tags */}
      <Head>
        <title>Privacy Policy | MakeResume</title>
        <meta
          name="description"
          content="Read the Privacy Policy of MakeResume. Learn how we collect, use, and protect your personal information when building AI-powered resumes."
        />
        <meta
          name="keywords"
          content="privacy policy, data protection, make resume, ai resume builder, security"
        />
        <meta name="author" content="MakeResume" />

        {/* Open Graph */}
        <meta property="og:title" content="Privacy Policy | MakeResume" />
        <meta
          property="og:description"
          content="Understand how MakeResume collects, stores, and protects your data when using our AI-powered resume builder."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://makeresume.com/privacy" />
        <meta
          property="og:image"
          content="https://makeresume.com/og-image.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | MakeResume" />
        <meta
          name="twitter:description"
          content="Learn how MakeResume manages your data, privacy, and security while using our platform."
        />
        <meta
          name="twitter:image"
          content="https://makeresume.com/og-image.png"
        />
      </Head>

      {/* 🔹 Responsive Layout */}
      <main className="max-w-3xl mx-auto py-12 px-6 min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
          Privacy Policy
        </h1>

        <p className="text-base md:text-lg text-black font-semibold leading-relaxed">
          At MakeResume, we value your privacy and are committed to protecting
          your personal information. This Privacy Policy explains how we handle
          your data when you use our services.
        </p>

        <ul className="list-disc list-inside mt-6 space-y-3 text-black font-semibold text-left">
          <li>
            <strong>Data Collection:</strong> We collect basic information such
            as your name, email, and resume details to provide our services.
          </li>
          <li>
            <strong>Usage of Data:</strong> Your data is used only to generate
            and improve your resumes. We never sell your information to third
            parties.
          </li>
          <li>
            <strong>Security:</strong> We implement industry-standard security
            practices to safeguard your data.
          </li>
          <li>
            <strong>Cookies:</strong> Our platform may use cookies to enhance
            your user experience.
          </li>
          <li>
            <strong>Third-Party Services:</strong> We may integrate with trusted
            tools (e.g., AI APIs, analytics) that follow strict data policies.
          </li>
          <li>
            <strong>User Rights:</strong> You can request access, updates, or
            deletion of your personal data at any time.
          </li>
        </ul>

        <p className="mt-6 text-base md:text-lg text-black font-semibold">
          By using MakeResume, you consent to this Privacy Policy. Updates may
          be made from time to time, so please review it periodically.
        </p>
      </main>
    </>
  );
}
