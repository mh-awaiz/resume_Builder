import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactFormData;
    const { name, email, message } = body;

    console.log("Incoming request:", { name, email, message });
    console.log("SMTP settings:", {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      passSet: !!process.env.SMTP_PASS, // don’t log actual password
    });

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      throw new Error("Missing SMTP configuration");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    // Log the error details for debugging
    console.error("Email error:", error instanceof Error ? error.message : error);

    console.error("Email error details:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message,
      }),
      { status: 500 }
    );
  }
}
