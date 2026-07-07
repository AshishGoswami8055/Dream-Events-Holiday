"use server";

import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import Package from "@/models/Package";
import { inquirySchema, contactSchema, newsletterSchema } from "@/lib/validations";
import { sanitizeInput } from "@/lib/utils";
import { sendInquiryNotification, sendInquiryConfirmation, sendNewsletterConfirmation } from "@/lib/email";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types";

export async function submitInquiry(formData: FormData): Promise<ActionResponse> {
  const headersList = await headers();
  const identifier = getClientIdentifier(headersList);
  const { success } = rateLimit(`inquiry-${identifier}`);
  if (!success) {
    return { success: false, message: "Too many requests. Please try again later." };
  }

  const raw = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    adults: formData.get("adults") as string,
    children: (formData.get("children") as string) || "0",
    travelDate: formData.get("travelDate") as string,
    package: (formData.get("package") as string) || undefined,
    message: (formData.get("message") as string) || "",
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check your form inputs",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await connectDB();

    await Inquiry.create({
      name: sanitizeInput(parsed.data.name),
      phone: sanitizeInput(parsed.data.phone),
      email: sanitizeInput(parsed.data.email).toLowerCase(),
      adults: parsed.data.adults,
      children: parsed.data.children,
      travelDate: new Date(parsed.data.travelDate),
      package: parsed.data.package || undefined,
      message: sanitizeInput(parsed.data.message),
    });

    let packageTitle: string | undefined;
    if (parsed.data.package) {
      const pkg = await Package.findById(parsed.data.package).select("title");
      packageTitle = pkg?.title;
    }

    try {
      await sendInquiryNotification({
        ...parsed.data,
        packageTitle,
      });
      await sendInquiryConfirmation({ name: parsed.data.name, email: parsed.data.email });
    } catch {
      // Non-blocking email errors
    }

    revalidatePath("/admin/inquiries");
    return { success: true, message: "Thank you! We will contact you within 24 hours." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Something went wrong" };
  }
}

export async function submitContact(formData: FormData): Promise<ActionResponse> {
  const headersList = await headers();
  const identifier = getClientIdentifier(headersList);
  const { success } = rateLimit(`contact-${identifier}`);
  if (!success) {
    return { success: false, message: "Too many requests. Please try again later." };
  }

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check your form inputs",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await connectDB();

    await Inquiry.create({
      name: sanitizeInput(parsed.data.name),
      phone: sanitizeInput(parsed.data.phone),
      email: sanitizeInput(parsed.data.email).toLowerCase(),
      adults: 1,
      children: 0,
      travelDate: new Date(),
      message: `[${parsed.data.subject}] ${sanitizeInput(parsed.data.message)}`,
      status: "new",
    });

    try {
      await sendInquiryNotification({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        adults: 1,
        children: 0,
        travelDate: "Not specified",
        message: `[${parsed.data.subject}] ${parsed.data.message}`,
      });
    } catch {
      // Non-blocking
    }

    return { success: true, message: "Message sent successfully! We will get back to you soon." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Something went wrong" };
  }
}

export async function subscribeNewsletter(formData: FormData): Promise<ActionResponse> {
  const headersList = await headers();
  const identifier = getClientIdentifier(headersList);
  const { success } = rateLimit(`newsletter-${identifier}`);
  if (!success) {
    return { success: false, message: "Too many requests. Please try again later." };
  }

  const parsed = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { success: false, message: "Please enter a valid email address" };
  }

  try {
    await sendNewsletterConfirmation(parsed.data.email);
    return { success: true, message: "Successfully subscribed to our newsletter!" };
  } catch {
    return { success: true, message: "Successfully subscribed to our newsletter!" };
  }
}

export async function adminLogin(formData: FormData): Promise<ActionResponse> {
  const { signIn } = await import("@/lib/auth");

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    return { success: true, message: "Login successful" };
  } catch {
    return { success: false, message: "Invalid email or password" };
  }
}

export async function adminLogout() {
  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/admin/login" });
}
