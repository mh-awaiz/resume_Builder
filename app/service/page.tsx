import Head from "next/head";

export default function ServicePage() {
  return (
    <>
      <Head>
        <title>Our Services | CViEx</title>
        <meta
          name="description"
          content="Discover CViEx services — AI-powered resume builder, custom templates, PDF & Word exports, LinkedIn integration, and smart job-winning tools."
        />
        <meta
          name="keywords"
          content="resume services, AI resume builder, CViEx, professional resume templates, LinkedIn resume integration, export PDF resume"
        />
        <meta name="author" content="CViEx" />

        {/* Open Graph */}
        <meta property="og:title" content="Our Services | CViEx" />
        <meta
          property="og:description"
          content="CViEx offers AI-powered resume generation, custom templates, PDF & Word exports, LinkedIn integration, and real-time tips for job seekers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cviex.com/services" />
        <meta property="og:image" content="https://cviex.com/og-image.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Services | CViEx" />
        <meta
          name="twitter:description"
          content="Explore CViEx services — AI-powered resume builder, smart templates, export to PDF/Word, LinkedIn integration, and live tips."
        />
        <meta name="twitter:image" content="https://cviex.com/og-image.png" />
      </Head>

      {/* Services Content */}
      <main className="max-w-5xl mx-auto min-h-screen px-6 py-16 text-gray-800">
        <h1 className="text-4xl font-bold text-primary text-center mb-8">
          Our Services
        </h1>

        <p className="text-lg text-center max-w-2xl mx-auto mb-12 leading-relaxed">
          At <span className="font-bold">CViEx</span>, we provide powerful tools
          to help you build resumes that get shortlisted by top companies.
          Whether you’re a student, professional, or career switcher, our
          AI-powered services are designed to give you an edge.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              AI-Powered Resume Generation
            </h2>
            <p className="leading-relaxed">
              Instantly create tailored resumes with our AI-driven system,
              optimized for Applicant Tracking Systems (ATS).
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              Custom Resume Templates
            </h2>
            <p className="leading-relaxed">
              Choose from a wide variety of modern, professional, and creative
              templates designed to impress recruiters.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              Export to PDF & Word
            </h2>
            <p className="leading-relaxed">
              Download your resumes in high-quality PDF and Word formats, ready
              for job applications and professional use.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              LinkedIn Integration
            </h2>
            <p className="leading-relaxed">
              Import your LinkedIn profile data in seconds to save time and keep
              your resume accurate and updated.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-md bg-white md:col-span-2">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              Live Resume Preview & Smart Tips
            </h2>
            <p className="leading-relaxed">
              Get instant feedback and improvement tips while building your
              resume. Preview your design live before downloading.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4 text-primary">
            Ready to Build Your Winning Resume?
          </h3>
          <p className="text-lg mb-6">
            Start creating resumes that truly stand out and land interviews.
          </p>
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition"
          >
            Get Started
          </a>
        </div>
      </main>
    </>
  );
}
