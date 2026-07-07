import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  height?: "sm" | "md" | "lg";
  align?: "left" | "center";
}

export function PageBanner({
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt,
  height = "md",
  align = "center",
}: PageBannerProps) {
  const heights = {
    sm: "min-h-[40vh]",
    md: "min-h-[50vh]",
    lg: "min-h-[60vh]",
  };

  return (
    <section
      className={cn("relative flex items-center overflow-hidden", heights[height])}
      aria-label={title}
    >
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          className="object-cover scale-105 brightness-[0.85]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/80 via-[#0a1628]/60 to-[#0a1628]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/50 to-transparent" />
      </div>

      <div
        className={cn(
          "container-custom relative z-10 pt-28 pb-16",
          align === "center" && "text-center"
        )}
      >
        {subtitle && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            {subtitle}
          </p>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "mt-4 text-lg text-white/80 md:text-xl",
              align === "center" && "mx-auto max-w-2xl"
            )}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
