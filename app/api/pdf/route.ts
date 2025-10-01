import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const { html, fileName } = await req.json();
    if (!html || !fileName) {
      return NextResponse.json({ error: "Missing html or fileName" }, { status: 400 });
    }

    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    // Inject styles to shrink text
    const styledHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; font-size: 10px; line-height: 1.2; margin: 20px; }
            h1,h2,h3 { font-size: 12px; }
            p, li { font-size: 10px; }
            .section { margin-bottom: 8px; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `;

    await page.setContent(styledHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: "8.5in",
      height: "11in",   // force a single page
      printBackground: true,
      margin: { top: "0.5in", bottom: "0.5in", left: "0.5in", right: "0.5in" },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${fileName}.pdf`,
      },
    });
  } catch (err: any) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "PDF generation failed", details: err.message }, { status: 500 });
  }
}
