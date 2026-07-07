import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DestinationDocument } from "@/types";

interface DestinationCardProps {
  destination: DestinationDocument;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link href={`/packages?destination=${destination._id}`} className="group block">
      <Card className="overflow-hidden border-0 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={destination.image.url}
            alt={destination.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="mb-1 flex items-center gap-1 text-sm text-white/80">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{destination.country}</span>
            </div>
            <h3 className="text-xl font-bold">{destination.name}</h3>
            {destination.packageCount !== undefined && destination.packageCount > 0 && (
              <p className="mt-1 text-sm text-white/70">
                {destination.packageCount} Package{destination.packageCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
