import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: "Your Collection | MakeResume",
  description:
    "View and download all your Markdown resumes in your MakeResume dashboard.",
  keywords: [
    "Markdown Resumes",
    "Resume Collections",
    "AI Resume Builder",
    "MakeResume Dashboard",
  ],
  openGraph: {
    title: "Your Collection | MakeResume",
    description:
      "Access your Markdown resumes in MakeResume. Download, manage, and organize your files easily.",
    url: `${BASE_URL}/dashboard/collections`,
    siteName: "MakeResume",
    images: [
      {
        url: `${BASE_URL}/og-dashboard.png`,
        width: 1200,
        height: 630,
        alt: "MakeResume Dashboard Collections",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Collection | MakeResume",
    description: "Manage your Markdown resumes easily in MakeResume.",
    images: [`${BASE_URL}/og-dashboard.png`],
  },
};
