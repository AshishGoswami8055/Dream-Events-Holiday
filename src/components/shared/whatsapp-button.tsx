"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/constants";
import { getWhatsAppUrl } from "@/lib/utils";

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
}

export function StickyBookButton({ packageTitle, slug }: StickyBookButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-md p-4 md:hidden">
      <div className="container-custom flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium line-clamp-1">{packageTitle}</p>
          <Link href={`/packages/${slug}#inquiry`} className="text-xs text-primary">
            View details
          </Link>
        </div>
        <Link
          href="#inquiry"
          className="shrink-0 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow hover:bg-accent/90 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
