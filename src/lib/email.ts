import nodemailer from "nodemailer";
import { SITE_CONFIG } from "@/constants";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface InquiryEmailData {
  name: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  travelDate: string;
  packageTitle?: string;
  message: string;
}

export async function sendInquiryNotification(data: InquiryEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || SITE_CONFIG.email;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New Travel Inquiry</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.email}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.phone}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Adults:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.adults}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Children:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.children}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Travel Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.travelDate}</td></tr>
        ${data.packageTitle ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Package:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.packageTitle}</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Message:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.message}</td></tr>
      </table>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || SITE_CONFIG.email,
    to: adminEmail,
    subject: `New Inquiry from ${data.name}`,
    html,
  });
}

export async function sendInquiryConfirmation(data: {
  name: string;
  email: string;
}): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Thank You, ${data.name}!</h2>
      <p>We have received your travel inquiry and our team will get back to you within 24 hours.</p>
      <p>In the meantime, feel free to explore our latest packages at <a href="${SITE_CONFIG.url}/packages">${SITE_CONFIG.url}/packages</a>.</p>
      <p style="color: #6b7280; margin-top: 24px;">Best regards,<br/>Dream Events & Holiday Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || SITE_CONFIG.email,
    to: data.email,
    subject: "We Received Your Inquiry - Dream Events & Holiday",
    html,
  });
}

export async function sendNewsletterConfirmation(email: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Welcome to Our Newsletter!</h2>
      <p>Thank you for subscribing. You'll receive exclusive travel deals and destination guides.</p>
      <p style="color: #6b7280; margin-top: 24px;">Dream Events & Holiday Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || SITE_CONFIG.email,
    to: email,
    subject: "Welcome to Dream Events & Holiday Newsletter",
    html,
  });
}
