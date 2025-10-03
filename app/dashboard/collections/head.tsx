import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: "Your Collection | CViEx",
  description:
    "View and download all your Markdown resumes in your CViEx dashboard.",
  keywords: [
    "Markdown Resumes",
    "Resume Collections",
    "AI Resume Builder",
    "CViEx Dashboard",
  ],
  openGraph: {
    title: "Your Collection | CViEx",
    description:
      "Access your Markdown resumes in CViEx. Download, manage, and organize your files easily.",
    url: `${BASE_URL}/dashboard/collections`,
    siteName: "CViEx",
    images: [
      {
        url: `${BASE_URL}/og-dashboard.png`,
        width: 1200,
        height: 630,
        alt: "CViEx Dashboard Collections",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Collection | CViEx",
    description: "Manage your Markdown resumes easily in CViEx.",
    images: [`${BASE_URL}/og-dashboard.png`],
  },
};
