import { generateSEO } from "@/lib/seo";
import { getDestinations } from "@/actions/package.actions";
import { TRAVEL_IMAGES } from "@/constants/images";
import { PageBanner } from "@/components/shared/page-banner";
import { DestinationCard } from "@/components/shared/destination-card";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { safeFetch } from "@/lib/safe-fetch";
import type { DestinationDocument } from "@/types";

export const metadata = generateSEO({
  title: "Destinations",
  description: "Explore our handpicked travel destinations across the globe.",
  path: "/destinations",
});

export default async function DestinationsPage() {
  const destinations = await safeFetch(() => getDestinations(), []);
  const destinationList = destinations as unknown as DestinationDocument[];

  return (
    <>
      <PageBanner
        title="Explore the World"
        subtitle="Destinations"
        description="Handpicked destinations that promise unforgettable experiences and lasting memories."
        imageUrl={TRAVEL_IMAGES.destinationsBanner.url}
        imageAlt="Tropical island destination aerial view"
        height="sm"
      />

      <div className="container-custom section-padding">
        {destinationList.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p>No destinations available yet.</p>
          </div>
        ) : (
          <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {destinationList.map((destination) => (
              <StaggerItem key={destination._id}>
                <DestinationCard destination={destination} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </>
  );
}

export const revalidate = 3600;
