import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import LoginForm from "../../components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Resume Builder",
  description: "Login to access your personalized resume builder dashboard.",
  keywords: ["login", "resume builder", "authentication", "resume platform"],
  openGraph: {
    title: "Login | Resume Builder",
    description: "Login to access your personalized resume builder dashboard.",
    url: "https://yourdomain.com/login",
    siteName: "Resume Builder",
  },
};

export default async function LoginPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return <LoginForm />;
}
