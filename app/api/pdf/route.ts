import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const { html, fileName } = await req.json();
    if (!html || !fileName) {
      return NextResponse.json({ error: "Missing html or fileName" }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });

    const page = await browser.newPage();

    // Inject responsive shrink-to-fit styles
    const styledHtml = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 11px;
              line-height: 1.3;
              margin: 20px;
              transform: scale(0.95);       /* shrink everything slightly */
              transform-origin: top left;
              width: 105%;                   /* avoid cutoff when scaling */
            }
            h1,h2,h3 { font-size: 13px; margin-bottom: 4px; }
            p, li { font-size: 11px; margin: 2px 0; }
            .section { margin-bottom: 10px; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `;

    await page.setContent(styledHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: "8.5in",
      height: "11in", // force standard A4/Letter single page
      printBackground: true,
      margin: { top: "0.4in", bottom: "0.4in", left: "0.4in", right: "0.4in" },
      pageRanges: "1", // ensures only one page is kept
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "PDF generation failed", details: err.message },
      { status: 500 }
    );
  }
}
