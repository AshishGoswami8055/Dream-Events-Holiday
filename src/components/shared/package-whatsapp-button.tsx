"use client";

import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { useSiteConfig } from "@/components/providers/site-config-provider";
import { getPackageWhatsAppUrl, type PackageWhatsAppDetails } from "@/lib/whatsapp";

interface PackageWhatsAppButtonProps {
  details: PackageWhatsAppDetails;
  label?: string;
  variant?: "default" | "compact" | "outline" | "sticky";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const variantStyles = {
  default:
    "inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#20bd5a] hover:shadow-lg",
  compact:
    "inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#20bd5a]",
  outline:
    "inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#25D366] bg-[#25D366]/5 px-6 py-3 text-sm font-semibold text-[#128C7E] transition-all hover:bg-[#25D366] hover:text-white",
  sticky:
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-[#20bd5a]",
};

export function PackageWhatsAppButton({
  details,
  label = "Inquire on WhatsApp",
  variant = "default",
  className,
  onClick,
}: PackageWhatsAppButtonProps) {
  const siteConfig = useSiteConfig();
  const url = getPackageWhatsAppUrl(details, siteConfig);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(variantStyles[variant], className)}
      aria-label={`${label} for ${details.title} on WhatsApp`}
    >
      <WhatsAppIcon size={variant === "compact" ? 14 : 20} />
      {label}
    </a>
  );
}

export type { PackageWhatsAppDetails };
