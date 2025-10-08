// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { resume } = body;

//     if (!resume) {
//       return NextResponse.json(
//         { message: "Resume data is required" },
//         { status: 400 }
//       );
//     }

//     const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
//     if (!GEMINI_API_KEY) {
//       return NextResponse.json(
//         { message: "Server missing Gemini API key" },
//         { status: 500 }
//       );
//     }

//     // Gemini endpoint for text completion
//     const endpoint = "https://api.gemini.com/v1/completions";

//     const prompt = `
// You are an AI career coach. Analyze the following resume JSON and provide 5 actionable suggestions to improve it for job applications.
// Focus on:
// - Highlighting achievements
// - Adding measurable results
// - Relevant skills and keywords
// - Improving phrasing

// Resume JSON:
// ${JSON.stringify(resume)}
// `;

//     const response = await axios.post(
//       endpoint,
//       {
//         prompt,
//         max_tokens: 500,
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${GEMINI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 30000, // 30 seconds
//       }
//     );

//     const suggestionsText = response?.data?.choices?.[0]?.text || "";
//     const suggestions = suggestionsText.split("\n").filter(Boolean);

//     return NextResponse.json({ suggestions });
//   } catch (error: any) {
//     console.error("Gemini API error:", error?.response?.data || error.message);
//     return NextResponse.json(
//       { message: "Failed to optimize resume" },
//       { status: 500 }
//     );
//   }
// }
