import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      {/* 🔹 SEO + Open Graph + Twitter Meta Tags */}
      <Head>
        <title>Privacy Policy | CViEx</title>
        <meta
          name="description"
          content="Read the Privacy Policy of CViEx. Learn how we collect, use, and protect your personal information when building AI-powered resumes."
        />
        <meta
          name="keywords"
          content="privacy policy, data protection, resume builder, ai resumes, CViEx security"
        />
        <meta name="author" content="CViEx" />

        {/* Open Graph */}
        <meta property="og:title" content="Privacy Policy | CViEx" />
        <meta
          property="og:description"
          content="Understand how CViEx collects, stores, and protects your data when using our AI-powered resume builder."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cviex.com/privacy" />
        <meta property="og:image" content="https://cviex.com/og-image.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | CViEx" />
        <meta
          name="twitter:description"
          content="Learn how CViEx manages your data, privacy, and security while using our platform."
        />
        <meta name="twitter:image" content="https://cviex.com/og-image.png" />
      </Head>

      {/* 🔹 Privacy Policy Content */}
      <main className="max-w-4xl mx-auto py-16 px-6 text-gray-800">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          Privacy Policy
        </h1>

        <p className="text-lg text-center mb-12 max-w-2xl mx-auto leading-relaxed">
          At <span className="font-bold">CViEx</span>, we value your privacy and
          are committed to safeguarding your personal information. This Privacy
          Policy explains how we collect, use, and protect your data when you
          use our AI-powered resume builder.
        </p>

        {/* Sections */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Data Collection</h2>
          <p className="leading-relaxed">
            We collect essential information such as your name, email address,
            and resume details to deliver our services effectively. Additional
            usage data may be collected to improve your experience on the
            platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. Usage of Data</h2>
          <p className="leading-relaxed">
            Your information is used exclusively for generating resumes,
            enhancing platform features, and providing customer support. CViEx
            does <span className="font-semibold">not sell</span> or share your
            personal data with third parties for marketing purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
          <p className="leading-relaxed">
            We implement industry-standard security practices, including
            encryption and secure storage, to protect your data from
            unauthorized access, alteration, or disclosure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Cookies</h2>
          <p className="leading-relaxed">
            Our platform may use cookies and similar technologies to enhance
            your browsing experience, analyze usage patterns, and remember your
            preferences. You may disable cookies in your browser settings, but
            some features may not function correctly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            5. Third-Party Services
          </h2>
          <p className="leading-relaxed">
            CViEx may integrate with trusted third-party services such as AI
            APIs, analytics, and payment gateways. These providers follow strict
            data protection policies, but we recommend reviewing their
            individual privacy practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. User Rights</h2>
          <p className="leading-relaxed">
            You have the right to request access, correction, or deletion of
            your personal data at any time. For assistance, you can contact our
            support team using the details provided below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Policy Updates</h2>
          <p className="leading-relaxed">
            We may update this Privacy Policy periodically to reflect changes in
            technology, services, or legal requirements. Updates will be posted
            on this page, and continued use of our platform indicates acceptance
            of the revised policy.
          </p>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy or how your data
            is handled, please contact us at:{" "}
            <a
              href="mailto:support@cviex.com"
              className="text-primary font-medium hover:underline"
            >
              support@cviex.com
            </a>
          </p>
        </section>

        {/* Footer note */}
        <p className="text-sm text-gray-600 text-center mt-12">
          Last updated: October 4, 2025
        </p>
      </main>
    </>
  );
}
