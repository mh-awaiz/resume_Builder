import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        },
      }
    );

    // Extract clean text output
    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API error:", error?.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
