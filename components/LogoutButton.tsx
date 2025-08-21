"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/browser";
import { redirect } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    redirect("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 shadow-md bg-background text-primary rounded-md hover:bg-primary hover:text-background transition-all duration-200"
    >
      Logout
    </button>
  );
}
