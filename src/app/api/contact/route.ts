import { NextResponse } from "next/server";
import { Resend } from "resend";

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

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY environment variable");
      return NextResponse.json({ error: "Email configuration error on server" }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const toEmail = process.env.CONTACT_FORM_TO_EMAIL || "academy@mimos.my";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Website Inquiry Notification <noreply@mimos-academy.my>";

    // Escape user-provided fields to prevent HTML injection in the email body
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCountryCode = escapeHtml(countryCode || "+60");
    const safeOrganization = escapeHtml(organization || "N/A");
    const safeMessage = escapeHtml(message);

    // Send the email using Resend SDK
    const { data, error } = await resend.emails.send({
      from: fromEmail,
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

    if (error) {
      console.error("Resend email sending failed:", error);
      return NextResponse.json({ error: error.message || "Failed to send email inquiry" }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ error: "Failed to send email inquiry" }, { status: 500 });
  }
}
