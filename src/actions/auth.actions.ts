"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import connectDB from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import { auth, signOut } from "@/lib/auth";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type ChangePasswordInput,
} from "@/lib/validations";
import {
  isSmtpConfigured,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from "@/lib/email";
import type { ActionResponse } from "@/types";

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;
const GENERIC_RESET_MESSAGE =
  "If an account exists with that email, we sent a password reset link. Check your inbox.";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(
  data: ForgotPasswordInput
): Promise<ActionResponse> {
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const headersList = await headers();
  const ip = getClientIdentifier(headersList);
  const limiter = rateLimit(`forgot-password:${ip}:${parsed.data.email.toLowerCase()}`);
  if (!limiter.success) {
    return { success: false, message: "Too many requests. Please try again in a minute." };
  }

  if (!(await isSmtpConfigured())) {
    return {
      success: false,
      message:
        "Email is not configured yet. Set up Gmail SMTP in Admin → Settings first.",
    };
  }

  await connectDB();
  const user = await AdminUser.findOne({ email: parsed.data.email.toLowerCase() });

  if (!user) {
    return { success: true, message: GENERIC_RESET_MESSAGE };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);

  await AdminUser.findByIdAndUpdate(user._id, {
    resetToken: hashedToken,
    resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_EXPIRY_MS),
  });

  const sent = await sendPasswordResetEmail({
    email: user.email,
    name: user.name,
    token: rawToken,
  });

  if (!sent) {
    return {
      success: false,
      message: "Could not send the reset email. Check your SMTP settings and try again.",
    };
  }

  return { success: true, message: GENERIC_RESET_MESSAGE };
}

export async function resetPassword(data: ResetPasswordInput): Promise<ActionResponse> {
  const parsed = resetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form and try again.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  await connectDB();
  const hashedToken = hashToken(parsed.data.token);

  const user = await AdminUser.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: new Date() },
  }).select("+password +resetToken");

  if (!user) {
    return {
      success: false,
      message: "This reset link is invalid or has expired. Please request a new one.",
    };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await AdminUser.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    resetToken: undefined,
    resetTokenExpiry: undefined,
  });

  await sendPasswordChangedEmail({ email: user.email, name: user.name });

  return {
    success: true,
    message: "Password reset successfully. You can now sign in with your new password.",
  };
}

export async function changePassword(data: ChangePasswordInput): Promise<ActionResponse> {
  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form and try again.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in to change your password." };
  }

  await connectDB();
  const user = await AdminUser.findById(session.user.id).select("+password");
  if (!user) {
    return { success: false, message: "Account not found." };
  }

  const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!isValid) {
    return { success: false, message: "Current password is incorrect." };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 12);

  await AdminUser.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    resetToken: undefined,
    resetTokenExpiry: undefined,
  });

  await sendPasswordChangedEmail({ email: user.email, name: user.name });
  await signOut({ redirect: false });

  return {
    success: true,
    message: "Password changed successfully. Please sign in again with your new password.",
  };
}
