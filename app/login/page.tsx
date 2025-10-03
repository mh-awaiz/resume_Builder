import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import LoginForm from "../../components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | CViEx",
  description: "Login to access your personalized CViEx dashboard.",
  keywords: ["login", "CViEx", "authentication", "resume platform"],
  openGraph: {
    title: "Login | CViEx",
    description: "Login to access your personalized CViEx dashboard.",
    url: "https://yourdomain.com/login",
    siteName: "CViEx",
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
