// app/api/razorpay/create-order/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json(); // amount in paise
    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay keys not configured" }, { status: 500 });
    }

    const razor = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razor.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: true,
    });

    // return order and the public key (so client doesn't need env)
    return NextResponse.json({ order, key: keyId });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
