import type { Metadata } from "next";
import { createClient } from "../../../lib/supabase/server"; 
import ResumeForm from "./resumeform/page";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: "Resume Dashboard | MakeResume",
  description: "Create and manage your resumes with MakeResume's AI-powered dashboard.",
  keywords: ["Resume Dashboard", "MakeResume", "AI Resume Builder", "Resume Management"],
  openGraph: {
    title: "Resume Dashboard | MakeResume",
    description: "Access your personalized dashboard to create and manage resumes with MakeResume.",
    url: `${BASE_URL}/dashboard/resume`,
    siteName: "MakeResume",
    images: [
      {
        url: `${BASE_URL}/og-resume-dashboard.png`,
        width: 1200,
        height: 630,
        alt: "Resume Dashboard MakeResume",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function ResumeDashboardForm() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-[80vh] flex justify-center items-center px-4 text-center">
        <p className="text-xl font-semibold text-red-500">
          ⚠️ Please log in to access your resume dashboard.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] flex justify-center items-start px-4 py-8 w-full">
      <div className="w-full max-w-4xl">
        <ResumeForm user={user} />
      </div>
    </main>
  );
}
