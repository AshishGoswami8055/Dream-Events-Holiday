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
  height = 56,
  href = "/",
  priority = false,
  variant = "dark",
}: LogoProps) {
  const graphic = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt={SITE_CONFIG.name}
      height={height}
      fetchPriority={priority ? "high" : undefined}
      className={cn(
        "h-auto w-auto object-contain transition-all duration-300",
        variant === "light" && "invert"
      )}
      style={{ maxHeight: height }}
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
