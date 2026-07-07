import { HeroSection } from "@/features/home/hero-section";
import { PopularDestinations } from "@/features/home/popular-destinations";
import { FeaturedPackages } from "@/features/home/featured-packages";
import { WhyChooseUs } from "@/features/home/why-choose-us";
import { TravelStatistics } from "@/features/home/travel-statistics";
import { TestimonialsSection } from "@/features/home/testimonials-section";
import { GalleryPreview } from "@/features/home/gallery-preview";
import { FAQSection } from "@/features/home/faq-section";
import { Newsletter } from "@/features/home/newsletter";
import { getPackages, getDestinations, getGalleryItems } from "@/actions/package.actions";
import { safeFetch } from "@/lib/safe-fetch";
import type { PackageDocument, DestinationDocument, GalleryDocument } from "@/types";

export const revalidate = 3600;

const emptyPaginated = { data: [], total: 0, page: 1, totalPages: 0, hasMore: false };

export default async function HomePage() {
  const [featuredResult, latestResult, destinations, galleryItems] = await Promise.all([
    safeFetch(() => getPackages({ featured: true, limit: 6 }), emptyPaginated),
    safeFetch(() => getPackages({ limit: 3, sort: "newest" }), emptyPaginated),
    safeFetch(() => getDestinations(true), []),
    safeFetch(() => getGalleryItems(true), []),
  ]);

  const featuredPackages = featuredResult.data as unknown as PackageDocument[];
  const latestPackages = latestResult.data as unknown as PackageDocument[];
  const destinationList = destinations as unknown as DestinationDocument[];
  const gallery = galleryItems as unknown as GalleryDocument[];

  return (
    <>
      <HeroSection destinations={destinationList} />
      <PopularDestinations destinations={destinationList} />
      <FeaturedPackages packages={featuredPackages} />
      <WhyChooseUs />
      <TravelStatistics />
      <TestimonialsSection limit={3} />
      <GalleryPreview items={gallery} />
      <FeaturedPackages
        packages={latestPackages}
        title="Latest Packages"
        subtitle="New Arrivals"
        showViewAll={true}
      />
      <FAQSection />
      <Newsletter />
    </>
  );
}
