import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  height?: number;
  href?: string | null;
  priority?: boolean;
  /** "dark" = white logo (hero/dark surfaces). "light" = black logo (scrolled/light surfaces). */
  variant?: "dark" | "light";
}

export function Logo({
  className,
  height = 64,
  href = "/",
  priority = false,
  variant = "dark",
}: LogoProps) {
  const isLight = variant === "light";

  const graphic = (
    <Image
      src={isLight ? "/logo-black.png" : "/logo-transparent.png"}
      alt={SITE_CONFIG.name}
      width={Math.round(height * 1.05)}
      height={height}
      className="h-auto w-auto max-w-full object-contain transition-all duration-300"
      style={{ maxHeight: height, height }}
      priority={priority}
      unoptimized
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn("inline-flex shrink-0 transition-opacity hover:opacity-90", className)}
        aria-label={SITE_CONFIG.name}
      >
        {graphic}
      </Link>
    );
  }

  return <div className={cn("inline-flex shrink-0", className)}>{graphic}</div>;
}
