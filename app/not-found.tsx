import Head from "next/head";
import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <>
      {/* 🔹 SEO + Open Graph + Twitter Meta Tags */}
      <Head>
        <title>404 - Page Not Found | CViEx</title>
        <meta
          name="description"
          content="The page you are looking for does not exist. Return to the CViEx homepage and continue building your AI-powered resume."
        />
        <meta name="robots" content="noindex, follow" />
        <meta name="author" content="CViEx" />

        {/* Open Graph */}
        <meta property="og:title" content="404 - Page Not Found | CViEx" />
        <meta
          property="og:description"
          content="Oops! This page could not be found. Go back to the CViEx homepage."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://CViEx.com/404" />
        <meta
          property="og:image"
          content="https://CViEx.com/og-image.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="404 - Page Not Found | CViEx" />
        <meta
          name="twitter:description"
          content="The page you were looking for could not be found. Return to CViEx."
        />
        <meta
          name="twitter:image"
          content="https://CViEx.com/og-image.png"
        />
      </Head>

      {/* 🔹 Responsive Layout */}
      <main className="flex flex-col items-center justify-center min-h-screen bg-foreground text-background px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-primary">404</h1>

        <p className="text-lg md:text-2xl font-medium mt-6">
          Oops! The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-md font-semibold hover:bg-secondary transition-all duration-200"
        >
          Go Back Home
        </Link>
      </main>
    </>
  );
}
