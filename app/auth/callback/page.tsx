// // app/auth/callback/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const code = searchParams.get("code");

//   if (code) {
//     const supabase = createServerActionClient({ cookies });
//     await supabase.auth.exchangeCodeForSession(code); // ✅ sets cookie properly
//   }

//   return NextResponse.redirect(new URL("/dashboard", request.url));
// }
