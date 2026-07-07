import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { PackageDocument } from "@/types";

interface PackageCardProps {
  pkg: PackageDocument;
  variant?: "grid" | "list";
}

export function PackageCard({ pkg, variant = "grid" }: PackageCardProps) {
  const destinationName =
    typeof pkg.destination === "object" ? pkg.destination?.name : "";

  if (variant === "list") {
    return (
      <Link href={`/packages/${pkg.slug}`} className="group block">
        <Card className="overflow-hidden border-0 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex flex-col sm:flex-row">
            <div className="relative aspect-[16/10] w-full sm:aspect-auto sm:w-72 shrink-0">
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
            </div>
            <CardContent className="flex flex-1 flex-col justify-center p-6">
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">{formatPrice(pkg.price)}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{pkg.duration} Days</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  View Details <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/packages/${pkg.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-0 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
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
        <CardContent className="p-5">
          <h3 className="mb-2 line-clamp-1 text-lg font-semibold group-hover:text-primary transition-colors">
            {pkg.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {pkg.description}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-primary">{formatPrice(pkg.price)}</p>
              <p className="text-xs text-muted-foreground">per person</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <span>{pkg.duration}D</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
