import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { resumeData } = await req.json();

  // Get user from Supabase auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Save resumeData in Supabase (or trigger AI resume generation here)
  console.log("Resume data received:", resumeData);

  return NextResponse.json({ resumeData });
}
