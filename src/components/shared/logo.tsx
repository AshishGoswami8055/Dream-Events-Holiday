import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  height?: number;
  href?: string | null;
  priority?: boolean;
  /** "dark" = white on black (hero). "light" = black on white glass (scrolled header). */
  variant?: "dark" | "light";
}

export function Logo({
  className,
  height = 56,
  href = "/",
  priority = false,
  variant = "dark",
}: LogoProps) {
  const isLight = variant === "light";

  const image = (
    <Image
      src="/logo.png"
      alt={SITE_CONFIG.name}
      width={Math.round(height * 0.72)}
      height={height}
      className={cn(
        "h-auto w-auto object-contain transition-all duration-300",
        isLight && "invert"
      )}
      style={{ maxHeight: height }}
      priority={priority}
      unoptimized
    />
  );

  const content = isLight ? (
    <span className="inline-flex items-center rounded-lg bg-white px-2 py-1">
      {image}
    </span>
  ) : (
    image
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn("inline-flex shrink-0 transition-opacity hover:opacity-90", className)}
        aria-label={SITE_CONFIG.name}
      >
        {content}
      </Link>
    );
  }

  return <div className={cn("inline-flex shrink-0", className)}>{content}</div>;
}
