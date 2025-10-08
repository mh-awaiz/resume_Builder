import { NextResponse } from "next/server";
import * as pdfParseModule from "pdf-parse";
import axios from "axios";

const pdfParse = pdfParseModule as unknown as (data: Buffer) => Promise<{ text: string }>;

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) return NextResponse.json({ message: "No PDF uploaded" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!GEMINI_API_KEY)
      return NextResponse.json({ message: "Server missing Gemini API key" }, { status: 500 });

    const endpoint = "https://api.gemini.com/v1/completions";

    const prompt = `
You are an AI career coach. Analyze the following resume text and provide 5 actionable suggestions.
Resume Text:
${resumeText}
`;

    const response = await axios.post(
      endpoint,
      { prompt, max_tokens: 500, temperature: 0.7 },
      { headers: { Authorization: `Bearer ${GEMINI_API_KEY}`, "Content-Type": "application/json" }, timeout: 30000 }
    );

    const suggestionsText = response?.data?.choices?.[0]?.text || "";
    const suggestions = suggestionsText.split("\n").filter(Boolean);

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error("PDF optimization error:", error?.response?.data || error.message);
    return NextResponse.json({ message: "Failed to analyze PDF" }, { status: 500 });
  }
}
