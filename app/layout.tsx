// app/head.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

import { Provider } from "../components/ui/provider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "MakeResume | AI-Powered Resume Builder",
  description:
    "Create and manage your resume effortlessly with MakeResume, an intuitive AI-powered resume builder. Build professional resumes in minutes.",
  keywords: [
    "Resume Builder",
    "AI Resume Builder",
    "Professional Resume",
    "MakeResume",
    "Resume Templates",
    "Job Application",
  ],
  authors: [{ name: "MakeResume", url: "https://yourdomain.com" }],
  // themeColor is deprecated in metadata, move it to viewport or use in <meta> manually if needed
  openGraph: {
    title: "MakeResume | AI-Powered Resume Builder",
    description:
      "Create professional resumes effortlessly with MakeResume, the AI-powered resume builder for job seekers.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",
    siteName: "MakeResume",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "MakeResume - AI Resume Builder",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MakeResume | AI-Powered Resume Builder",
    description:
      "Create professional resumes effortlessly with MakeResume, the AI-powered resume builder for job seekers.",
    images: ["https://yourdomain.com/og-image.png"],
    creator: "@MakeResume",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon.ico",
  },
  // ✅ Google Search Console verification
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"
  ),
};

// Root layout
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Search Console verification */}
        <meta
          name="google-site-verification"
          content={
            process.env.NEXT_PUBLIC_GSC_VERIFICATION ||
            "MRBYKHpOA65wMeP5_F7ZjyPSpcijC_-SxoyV_VgfRkM"
          }
        />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-J8LCCNRL0L`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-J8LCCNRL0L');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-background min-h-screen w-full flex flex-col`}
      >
        <Navbar />
        <Provider>{children}</Provider>
        <Footer />
      </body>
    </html>
  );
}
