import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import CreateResumeBtn from "../../components/CreateResumeBtn";
import SeeCollections from "../../components/SeeCollections";
import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  title: "Dashboard | CViEx",
  description:
    "Manage your resumes, view your collections, and create new AI-powered resumes in your CViEx dashboard.",
  keywords: [
    "CViEx Dashboard",
    "cvx",
    "cviex",
    "Resume Management",
    "AI Resume Builder",
    "User Dashboard",
    "Resume Builder",
    "resume builder",
  ],
  openGraph: {
    title: "Dashboard | CViEx",
    description:
      "Access your personalized dashboard to create and manage resumes with CViEx.",
    url: `${BASE_URL}/dashboard`,
    siteName: "CViEx",
    images: [
      {
        url: `${BASE_URL}/og-dashboard.png`,
        width: 1200,
        height: 630,
        alt: "Dashboard CViEx",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("Auth error:", error);
    redirect("/login");
  }

  return (
    <main className="py-20 px-4 sm:px-6 lg:px-12 min-h-screen flex flex-col md:flex-row items-center justify-around bg-background text-primary w-full gap-8">
      {/* Welcome Section */}
      <div className="flex justify-center items-center text-center flex-col max-w-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold p-5 text-black">
          Welcome to your <span className="text-primary">Dashboard!</span>
        </h1>
        <p className="font-semibold text-lg sm:text-xl text-black mb-4">
          Hi,{" "}
          <span className="text-primary">
            {user.user_metadata?.name || user.email}
          </span>
        </p>
      </div>

      {/* Actions Section */}
      <div className="flex flex-col items-center justify-center gap-4 p-1 space-x-2">
        <CreateResumeBtn />
        <SeeCollections />

        {/* <Link
          href="/dashboard/career-optimization"
          className="relative inline-block px-8 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500
      hover:from-indigo-500 hover:to-purple-500 transition-all duration-500 ease-in-out
      transform hover:-translate-y-1 hover:scale-105 shadow-lg"
        >
          AI Career Optimization
          <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity"></span>
        </Link> */}
      </div>
    </main>
  );
}
