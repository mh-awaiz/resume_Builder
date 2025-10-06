import React from "react";
import { Analytics } from "@vercel/analytics/next";
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

export const metadata: Metadata = {
  title: "CViEx | AI-Powered Resume Builder",
  description:
    "Create and manage your resume effortlessly with CViEx, an intuitive AI-powered resume builder. Build professional resumes in minutes.",
  keywords: [
    "Resume Builder",
    "AI Resume Builder",
    "Professional Resume",
    "CViEx",
    "cv express",
    "Resume Templates",
    "Job Application",
  ],
  authors: [{ name: "CViEx", url: "https://yourdomain.com" }],
  openGraph: {
    title: "CViEx | AI-Powered Resume Builder",
    description:
      "Create professional resumes effortlessly with CViEx, the AI-powered resume builder for job seekers.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",
    siteName: "CViEx",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "CViEx - AI Resume Builder",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CViEx | AI-Powered Resume Builder",
    description:
      "Create professional resumes effortlessly with CViEx, the AI-powered resume builder for job seekers.",
    images: ["https://yourdomain.com/og-image.png"],
    creator: "@CViEx",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon.ico",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://cviex.com"
  ),
};

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
            "zYDs8Nl_zN3nTu5lIMvJXpTZyfde3xx7WXRdO-HxNjE"
          }
        />
        <meta name="google-site-verification" content="zYDs8Nl_zN3nTu5lIMvJXpTZyfde3xx7WXRdO-HxNjE" />

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

        {/* Razorpay Checkout (client side) */}
        <Script
          id="razorpay-checkout"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-background min-h-screen w-full flex flex-col overflow-x-hidden`}
      >
        <Navbar />
        <Provider>{children}</Provider>
        <Footer />
        <Analytics />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
