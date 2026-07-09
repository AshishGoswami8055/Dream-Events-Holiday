"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/constants";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";
import { PackageWhatsAppButton, type PackageWhatsAppDetails } from "@/components/shared/package-whatsapp-button";

interface WhatsAppButtonProps {
  message?: string;
}

export function WhatsAppButton({
  message = "Hi! I'm interested in your travel packages.",
}: WhatsAppButtonProps) {
  const url = getWhatsAppUrl(SITE_CONFIG.whatsapp, message);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}

interface StickyBookButtonProps {
  packageTitle: string;
  price: number;
  slug: string;
  whatsappDetails: PackageWhatsAppDetails;
}

export function StickyBookButton({ packageTitle, price, whatsappDetails }: StickyBookButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-md p-4 md:hidden">
      <div className="container-custom flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{packageTitle}</p>
          <p className="text-sm font-bold text-primary">{formatPrice(price)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="#inquiry"
            className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Form
          </Link>
          <PackageWhatsAppButton
            details={whatsappDetails}
            label="WhatsApp"
            variant="sticky"
          />
        </div>
      </div>
    </div>
  );
}
