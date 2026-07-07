import { generateSEO } from "@/lib/seo";
import { getGalleryItems } from "@/actions/package.actions";
import { TRAVEL_IMAGES } from "@/constants/images";
import { PageBanner } from "@/components/shared/page-banner";
import { GalleryPageClient } from "@/features/gallery/gallery-page-client";
import { safeFetch } from "@/lib/safe-fetch";
import type { GalleryDocument } from "@/types";

export const metadata = generateSEO({
  title: "Gallery",
  description: "Browse stunning travel photos from destinations around the world.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const items = await safeFetch(() => getGalleryItems(), []);
  const galleryItems = items as unknown as GalleryDocument[];
  const categories = ["All", ...Array.from(new Set(galleryItems.map((i) => i.category)))];

  return (
    <>
      <PageBanner
        title="Moments That Inspire"
        subtitle="Gallery"
        description="Glimpses of extraordinary journeys and breathtaking destinations."
        imageUrl={TRAVEL_IMAGES.galleryBanner.url}
        imageAlt="Swiss alpine mountain panorama"
        height="sm"
      />
      <GalleryPageClient items={galleryItems} categories={categories} />
    </>
  );
}

export const revalidate = 3600;
