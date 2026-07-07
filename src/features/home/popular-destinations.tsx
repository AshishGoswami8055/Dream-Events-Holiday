import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { DestinationCard } from "@/components/shared/destination-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import type { DestinationDocument } from "@/types";

interface PopularDestinationsProps {
  destinations: DestinationDocument[];
}

export function PopularDestinations({ destinations }: PopularDestinationsProps) {
  if (destinations.length === 0) return null;

  return (
    <section className="section-padding bg-secondary" aria-labelledby="destinations-heading">
      <div className="container-custom">
        <FadeIn>
          <SectionHeading
            subtitle="Explore"
            title="Popular Destinations"
            description="Handpicked destinations that promise unforgettable experiences and lasting memories."
          />
        </FadeIn>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.slice(0, 4).map((destination) => (
            <StaggerItem key={destination._id}>
              <DestinationCard destination={destination} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="mt-10 text-center">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All Destinations
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
