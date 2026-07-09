import nodemailer from "nodemailer";
import { getSiteSettings } from "@/lib/site-settings";

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

async function getMailConfig() {
  const settings = await getSiteSettings();
  const configured = Boolean(settings.smtpHost && settings.smtpUser && settings.smtpPass);
  return { settings, configured };
}

function createTransporter(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  return nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort || 587,
    secure: false,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPass,
    },
  });
}

export async function isSmtpConfigured() {
  const { configured } = await getMailConfig();
  return configured;
}

export async function sendAdminQueryNotification(data: QueryEmailData): Promise<boolean> {
  const { settings, configured } = await getMailConfig();
  if (!configured) return false;

  const adminEmail = settings.adminNotificationEmail || settings.email;
  const adminUrl = `${settings.siteUrl.replace(/\/$/, "")}/admin/inquiries`;
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
      <p style="color: #6b7280; margin-top: 24px; font-size: 12px;">${settings.siteName} — Admin Notification</p>
    </div>
  `;

  await createTransporter(settings).sendMail({
    from: settings.smtpFrom || settings.email,
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
  const { settings, configured } = await getMailConfig();
  if (!configured) return false;

  const isContact = data.source === "contact";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Thank You, ${escapeHtml(data.name)}!</h2>
      <p>We have received your ${isContact ? "message" : "travel inquiry"} and our team will get back to you within 24 hours.</p>
      <p>In the meantime, feel free to explore our latest packages at <a href="${settings.siteUrl}/packages">${settings.siteUrl}/packages</a>.</p>
      <p style="color: #6b7280; margin-top: 24px;">Best regards,<br/>${settings.siteName} Team</p>
    </div>
  `;

  await createTransporter(settings).sendMail({
    from: settings.smtpFrom || settings.email,
    to: data.email,
    subject: isContact
      ? `We Received Your Message - ${settings.siteName}`
      : `We Received Your Inquiry - ${settings.siteName}`,
    html,
  });

  return true;
}

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

export async function sendInquiryConfirmation(data: {
  name: string;
  email: string;
}): Promise<void> {
  await sendCustomerAcknowledgement({ ...data, source: "package" });
}

export async function sendNewsletterConfirmation(email: string): Promise<boolean> {
  const { settings, configured } = await getMailConfig();
  if (!configured) return false;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Welcome to Our Newsletter!</h2>
      <p>Thank you for subscribing. You'll receive exclusive travel deals and destination guides.</p>
      <p style="color: #6b7280; margin-top: 24px;">${settings.siteName} Team</p>
    </div>
  `;

  await createTransporter(settings).sendMail({
    from: settings.smtpFrom || settings.email,
    to: email,
    subject: `Welcome to ${settings.siteName} Newsletter`,
    html,
  });

  return true;
}

export async function sendPasswordResetEmail(data: {
  email: string;
  name: string;
  token: string;
}): Promise<boolean> {
  const { settings, configured } = await getMailConfig();
  if (!configured) return false;

  const resetUrl = `${settings.siteUrl.replace(/\/$/, "")}/admin/reset-password/${data.token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Reset Your Admin Password</h2>
      <p>Hi ${escapeHtml(data.name)},</p>
      <p>We received a request to reset your admin password for ${escapeHtml(settings.siteName)}.</p>
      <p>Click the button below to choose a new password. This link expires in 1 hour.</p>
      <p style="margin-top: 24px;">
        <a href="${resetUrl}" style="display: inline-block; background: #0F4C81; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Reset Password
        </a>
      </p>
      <p style="color: #6b7280; margin-top: 24px; font-size: 13px;">
        If you did not request this, you can safely ignore this email. Your password will not change.
      </p>
      <p style="color: #9ca3af; margin-top: 16px; font-size: 12px; word-break: break-all;">
        Or copy this link: ${resetUrl}
      </p>
    </div>
  `;

  await createTransporter(settings).sendMail({
    from: settings.smtpFrom || settings.email,
    to: data.email,
    subject: `Reset Your Admin Password — ${settings.siteName}`,
    html,
  });

  return true;
}

export async function sendPasswordChangedEmail(data: {
  email: string;
  name: string;
}): Promise<boolean> {
  const { settings, configured } = await getMailConfig();
  if (!configured) return false;

  const loginUrl = `${settings.siteUrl.replace(/\/$/, "")}/admin/login`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">Password Changed</h2>
      <p>Hi ${escapeHtml(data.name)},</p>
      <p>Your admin password for ${escapeHtml(settings.siteName)} was changed successfully.</p>
      <p>If you did not make this change, contact support immediately.</p>
      <p style="margin-top: 24px;">
        <a href="${loginUrl}" style="display: inline-block; background: #0F4C81; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Sign In to Admin
        </a>
      </p>
    </div>
  `;

  await createTransporter(settings).sendMail({
    from: settings.smtpFrom || settings.email,
    to: data.email,
    subject: `Your Admin Password Was Changed — ${settings.siteName}`,
    html,
  });

  return true;
}
