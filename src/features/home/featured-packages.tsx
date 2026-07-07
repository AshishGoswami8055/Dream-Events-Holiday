import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { PackageCard } from "@/components/shared/package-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import type { PackageDocument } from "@/types";

interface FeaturedPackagesProps {
  packages: PackageDocument[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export function FeaturedPackages({
  packages,
  title = "Featured Packages",
  subtitle = "Curated For You",
  showViewAll = true,
}: FeaturedPackagesProps) {
  if (packages.length === 0) return null;

  return (
    <section className="section-padding" aria-labelledby="featured-heading">
      <div className="container-custom">
        <FadeIn>
          <SectionHeading
            subtitle={subtitle}
            title={title}
            description="Discover our most popular travel packages, carefully crafted for extraordinary experiences."
          />
        </FadeIn>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <StaggerItem key={pkg._id}>
              <PackageCard pkg={pkg} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {showViewAll && (
          <FadeIn className="mt-10 text-center">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              View All Packages
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
