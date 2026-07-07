import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import { getPackages, getDestinations } from "@/actions/package.actions";
import { PackageFiltersClient } from "@/features/packages/package-filters";
import { PageBanner } from "@/components/shared/page-banner";
import { TRAVEL_IMAGES } from "@/constants/images";
import { Skeleton } from "@/components/ui/skeleton";
import { safeFetch } from "@/lib/safe-fetch";
import type { PackageDocument, DestinationDocument } from "@/types";
import { parseSearchParams } from "@/lib/utils";
import { ITEMS_PER_PAGE } from "@/constants";

const emptyPaginated = { data: [], total: 0, page: 1, totalPages: 0, hasMore: false };

export const metadata = generateSEO({
  title: "Travel Packages",
  description: "Browse our curated collection of luxury travel packages.",
  path: "/packages",
});

interface PackagesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
  const params = parseSearchParams(await searchParams);
  const page = parseInt(params.page || "1", 10);

  const result = await safeFetch(
    () =>
      getPackages({
        search: params.search,
        destination: params.destination,
        category: params.category,
        minPrice: params.minPrice ? parseInt(params.minPrice, 10) : undefined,
        maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : undefined,
        minDuration: params.minDuration ? parseInt(params.minDuration, 10) : undefined,
        maxDuration: params.maxDuration ? parseInt(params.maxDuration, 10) : undefined,
        sort: params.sort || "newest",
        page,
        limit: ITEMS_PER_PAGE,
      }),
    emptyPaginated
  );

  const destinations = await safeFetch(() => getDestinations(), []);

  return (
    <>
      <PageBanner
        title="Travel Packages"
        subtitle="Explore"
        description="Discover handpicked luxury experiences designed for every type of traveler."
        imageUrl={TRAVEL_IMAGES.packagesBanner.url}
        imageAlt="Airplane wing over clouds — travel packages"
        height="sm"
      />
      <Suspense fallback={<PackagesSkeleton />}>
        <PackageFiltersClient
          destinations={destinations as unknown as DestinationDocument[]}
          initialPackages={result.data as unknown as PackageDocument[]}
          total={result.total}
          totalPages={result.totalPages}
          currentPage={result.page}
        />
      </Suspense>
    </>
  );
}

function PackagesSkeleton() {
  return (
    <div className="container-custom section-padding">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export const revalidate = 3600;
