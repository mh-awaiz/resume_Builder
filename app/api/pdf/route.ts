"use server";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { html, fileName } = await req.json();

    if (!html || !fileName) {
      return NextResponse.json(
        { error: "Missing html or fileName" },
        { status: 400 }
      );
    }

    const isServerless = !!process.env.VERCEL;

    let puppeteer: any;
    let chromium: any;

    if (isServerless) {
      // Serverless: Vercel
      puppeteer = (await import("puppeteer-core")).default;
      chromium = (await import("@sparticuz/chromium")).default;
    } else {
      // Local development
      puppeteer = (await import("puppeteer")).default;
    }

    const browser = await puppeteer.launch(
      isServerless
        ? {
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
          }
        : { headless: true }
    );

    const page = await browser.newPage();

    const styledHtml = `
      <html>
        <head>
           <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                color: #222;
                margin: 8px; /* very minimal page margin */
                line-height: 1.4;
              }
              header {
                text-align: center;
                margin-bottom: 12px; /* smaller vertical spacing */
              }
              h1 {
                font-size: 24px;
                margin-bottom: 2px;
                font-weight: 700;
                color: #155dfc;
              }

              h1,p{
              font-size: 25px;
                margin-bottom: 2px;
                font-weight: 500;
              }
                
              h2 {
                color: #155dfc;
                font-size: 15px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 2px;
                margin-top: 14px;
                text-transform: uppercase;
              }
              h3 {
                font-size: 13px;
                margin: 4px 0 2px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
              }
              p, ul {
                margin: 2px 0 6px;
                font-size: 12.5px;
              }
              ul {
                padding-left: 16px;
              }
              .contact {
                color: #444;
                font-size: 12px;
                margin: 4px 0 6px;
              }
              .contact span {
                margin: 0 4px;
              }
              .meta {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin: 0;
                font-size: 12.5px;
              }
              .date {
                font-size: 12px;
                color: #555;
                white-space: nowrap;
                min-width: 50px;
                text-align: right;
                margin-left: 6px;
              }
              .section {
                padding: 0 3px; 
              }
              .experience-item {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
              }
              .experience-item .date {
                min-width: 50px;
                margin-right: 5px;
              }
            </style>
        </head>
        <body>${html}</body>
      </html>
    `;

    await page.setContent(styledHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: "8.5in",
      height: "11in",
      printBackground: true,
      margin: { top: "0.4in", bottom: "0.4in", left: "0.4in", right: "0.4in" },
      pageRanges: "1",
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
      {
        error: "PDF generation failed",
        details: err.message,
        stack: err.stack,
      },
      { status: 500 }
    );
  }
}
