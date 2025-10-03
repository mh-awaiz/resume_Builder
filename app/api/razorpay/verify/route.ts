// app/api/razorpay/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
    } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Razorpay secret not configured" }, { status: 500 });
    }

    const generated = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // signature is valid -> mark user as premium in Supabase
    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      return NextResponse.json({ error: "Supabase service role not configured" }, { status: 500 });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

    // update profile
    const { error: updateErr } = await supabaseAdmin
      .from("profiles")
      .update({ is_premium: true, premium_since: new Date().toISOString() })
      .eq("id", userId);

    if (updateErr) {
      console.error("Supabase update error:", updateErr);
      return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
    }

    // optional: insert a payments record (if you have a payments table)
    // await supabaseAdmin.from("payments").insert([{ user_id: userId, order_id: razorpay_order_id, payment_id: razorpay_payment_id }]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
