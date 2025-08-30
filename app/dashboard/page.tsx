import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import CreateResumeBtn from "../../components/CreateResumeBtn";
import SeeCollections from "../../components/SeeCollections";

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
    <main className="py-20 px-6 h-auto flex flex-col md:flex-row items-center justify-around bg-background text-primary w-full">
      <div className="flex justify-center items-center text-center flex-col">
        <h1 className="text-2xl font-bold p-5 text-black">
          Welcome, to your <span className="text-primary">Dashboard!</span>
        </h1>
        <p className="font-semibold text-xl text-black mb-4">
          Hii,{" "}
          <span className="text-primary">
            {user.user_metadata?.name || user.email}
          </span>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <CreateResumeBtn />
        <SeeCollections />
      </div>
    </main>
  );
}
