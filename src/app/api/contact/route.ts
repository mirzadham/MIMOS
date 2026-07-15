import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Helper function to escape HTML characters to prevent HTML injection in emails
function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, countryCode, organization, message } = await request.json();

    // 1. Check for missing required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Validate input lengths to prevent abuse
    if (
      name.length > 150 ||
      email.length > 150 ||
      phone.length > 30 ||
      (countryCode && countryCode.length > 10) ||
      (organization && organization.length > 200) ||
      message.length > 10000
    ) {
      return NextResponse.json({ error: "Input values exceed maximum allowed length" }, { status: 400 });
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.error("Missing SMTP_USER or SMTP_PASS environment variables");
      return NextResponse.json({ error: "Email configuration error on server" }, { status: 500 });
    }

    // Configure Nodemailer transporter for Gmail SMTP with connection pooling
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      pool: true, // Reuse the SMTP connection
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const toEmail = process.env.CONTACT_FORM_TO_EMAIL || "academy@mimos.my";

    // Escape user-provided fields to prevent HTML injection in the email body
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCountryCode = escapeHtml(countryCode || "+60");
    const safeOrganization = escapeHtml(organization || "N/A");
    const safeMessage = escapeHtml(message);

    // Send the email
    const info = await transporter.sendMail({
      from: `"Website Inquiry Notification" <${smtpUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `New Contact Inquiry from ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #a72190; margin-top: 0;">New Contact Form Submission</h2>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Phone:</strong> ${safeCountryCode} ${safePhone}</p>
          <p><strong>Organization:</strong> ${safeOrganization}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #f1f5f9; color: #334155; line-height: 1.6;">${safeMessage}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ error: "Failed to send email inquiry" }, { status: 500 });
  }
}
