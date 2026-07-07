import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  height?: number;
  href?: string | null;
  priority?: boolean;
}

export function Logo({ className, height = 52, href = "/", priority = false }: LogoProps) {
  const image = (
    <Image
      src="/logo.png"
      alt={SITE_CONFIG.name}
      width={Math.round(height * 1.15)}
      height={height}
      className="h-auto w-auto object-contain"
      style={{ maxHeight: height }}
      priority={priority}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn("inline-flex shrink-0 transition-opacity hover:opacity-90", className)}
        aria-label={SITE_CONFIG.name}
      >
        {image}
      </Link>
    );
  }

  return <div className={cn("inline-flex shrink-0", className)}>{image}</div>;
}
