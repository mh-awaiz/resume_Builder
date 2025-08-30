import { cookies } from "next/headers";
import { createClient } from "../../../lib/supabase/server"; 
import ResumeForm from "./resumeform/page";


export default async function ResumeDashboardForm() {
 const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="text-center mt-20">⚠️ Please log in to access your resume dashboard.</p>;
  }

  return <ResumeForm user={user} />;
}