import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { packageToWhatsAppDetails } from "@/lib/whatsapp";
import { PackageWhatsAppButton } from "@/components/shared/package-whatsapp-button";
import type { PackageDocument } from "@/types";

interface PackageCardProps {
  pkg: PackageDocument;
  variant?: "grid" | "list";
}

export function PackageCard({ pkg, variant = "grid" }: PackageCardProps) {
  const destinationName =
    typeof pkg.destination === "object" ? pkg.destination?.name : "";
  const whatsappDetails = packageToWhatsAppDetails(pkg);

  if (variant === "list") {
    return (
      <Card className="overflow-hidden border-0 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex flex-col sm:flex-row">
          <Link href={`/packages/${pkg.slug}`} className="group relative aspect-[16/10] w-full sm:aspect-auto sm:w-72 shrink-0">
            <Image
              src={pkg.coverImage.url}
              alt={pkg.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 288px"
            />
            {pkg.featured && (
              <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
                Featured
              </Badge>
            )}
          </Link>
          <CardContent className="flex flex-1 flex-col justify-center p-6">
            <Link href={`/packages/${pkg.slug}`} className="group">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>{pkg.location}</span>
                {destinationName && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{destinationName}</span>
                  </>
                )}
              </div>
              <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
                {pkg.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {pkg.description}
              </p>
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-2xl font-bold text-primary">{formatPrice(pkg.price)}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{pkg.duration} Days</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/packages/${pkg.slug}`}
                  className="inline-flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Details <ArrowRight className="h-4 w-4" />
                </Link>
                <PackageWhatsAppButton details={whatsappDetails} variant="compact" label="WhatsApp" />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden border-0 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <Link href={`/packages/${pkg.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={pkg.coverImage.url}
            alt={pkg.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {pkg.featured && (
            <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">
              Featured
            </Badge>
          )}
          <Badge className="absolute right-3 top-3 bg-white/90 text-foreground backdrop-blur-sm">
            {pkg.category}
          </Badge>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-1 text-sm text-white/90">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{pkg.location}</span>
            </div>
          </div>
        </div>
      </Link>
      <CardContent className="p-5">
        <Link href={`/packages/${pkg.slug}`} className="group block">
          <h3 className="mb-2 line-clamp-1 text-lg font-semibold group-hover:text-primary transition-colors">
            {pkg.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {pkg.description}
          </p>
        </Link>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-primary">{formatPrice(pkg.price)}</p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <span>{pkg.duration}D</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/packages/${pkg.slug}`}
            className="flex flex-1 items-center justify-center rounded-full border px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            View Details
          </Link>
          <PackageWhatsAppButton
            details={whatsappDetails}
            variant="compact"
            label="WhatsApp"
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}
