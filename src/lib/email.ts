import nodemailer from "nodemailer";
import { SITE_CONFIG } from "@/constants";

export type QuerySource = "package" | "contact";

interface QueryEmailData {
  name: string;
  email: string;
  phone: string;
  adults?: number;
  children?: number;
  travelDate?: string;
  packageTitle?: string;
  subject?: string;
  message: string;
  source: QuerySource;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isSmtpConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST);
}

function getTransporter() {
  if (!isSmtpConfigured()) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function getAdminEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL || SITE_CONFIG.email;
}

function getFromAddress() {
  return process.env.SMTP_FROM || SITE_CONFIG.email;
}

export async function sendAdminQueryNotification(data: QueryEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const adminEmail = getAdminEmail();
  const adminUrl = `${SITE_CONFIG.url}/admin/inquiries`;
  const queryLabel = data.source === "contact" ? "Contact Form Message" : "Package Inquiry";
  const subjectLine =
    data.source === "contact" && data.subject
      ? `New Contact: ${data.subject} — ${data.name}`
      : `New ${queryLabel} from ${data.name}`;

  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Type", queryLabel],
    data.subject ? ["Subject", data.subject] : null,
    data.packageTitle ? ["Package", data.packageTitle] : null,
    data.travelDate ? ["Travel Date", data.travelDate] : null,
    data.adults != null ? ["Adults", String(data.adults)] : null,
    data.children != null ? ["Children", String(data.children)] : null,
    ["Message", data.message],
  ].filter(Boolean) as [string, string][];

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New Customer Query</h2>
      <p style="color: #374151;">A new ${queryLabel.toLowerCase()} was submitted on your website.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 35%;"><strong>${escapeHtml(label)}:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(value)}</td></tr>`
          )
          .join("")}
      </table>
      <p style="margin-top: 24px;">
        <a href="${adminUrl}" style="display: inline-block; background: #0F4C81; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View in Admin Panel
        </a>
      </p>
      <p style="color: #6b7280; margin-top: 24px; font-size: 12px;">${SITE_CONFIG.name} — Admin Notification</p>
    </div>
  `;

  await transporter.sendMail({
    from: getFromAddress(),
    to: adminEmail,
    subject: subjectLine,
    html,
  });

  return true;
}

export async function sendCustomerAcknowledgement(data: {
  name: string;
  email: string;
  source: QuerySource;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const isContact = data.source === "contact";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Thank You, ${escapeHtml(data.name)}!</h2>
      <p>We have received your ${isContact ? "message" : "travel inquiry"} and our team will get back to you within 24 hours.</p>
      <p>In the meantime, feel free to explore our latest packages at <a href="${SITE_CONFIG.url}/packages">${SITE_CONFIG.url}/packages</a>.</p>
      <p style="color: #6b7280; margin-top: 24px;">Best regards,<br/>${SITE_CONFIG.name} Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: getFromAddress(),
    to: data.email,
    subject: isContact
      ? `We Received Your Message - ${SITE_CONFIG.name}`
      : `We Received Your Inquiry - ${SITE_CONFIG.name}`,
    html,
  });

  return true;
}

/** @deprecated Use sendAdminQueryNotification */
export async function sendInquiryNotification(data: {
  name: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  travelDate: string;
  packageTitle?: string;
  message: string;
}): Promise<void> {
  await sendAdminQueryNotification({ ...data, source: "package" });
}

/** @deprecated Use sendCustomerAcknowledgement */
export async function sendInquiryConfirmation(data: {
  name: string;
  email: string;
}): Promise<void> {
  await sendCustomerAcknowledgement({ ...data, source: "package" });
}

export async function sendNewsletterConfirmation(email: string): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Welcome to Our Newsletter!</h2>
      <p>Thank you for subscribing. You'll receive exclusive travel deals and destination guides.</p>
      <p style="color: #6b7280; margin-top: 24px;">${SITE_CONFIG.name} Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: getFromAddress(),
    to: email,
    subject: `Welcome to ${SITE_CONFIG.name} Newsletter`,
    html,
  });

  return true;
}
