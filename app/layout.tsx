import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

import { Provider } from "../components/ui/provider";

// Importing components
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

// ✅ Enhanced SEO metadata
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
  themeColor: "#1d4ed8", // Primary brand color
  openGraph: {
    title: "MakeResume | AI-Powered Resume Builder",
    description:
      "Create professional resumes effortlessly with MakeResume, the AI-powered resume builder for job seekers.",
    url: "https://yourdomain.com",
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
