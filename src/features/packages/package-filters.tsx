"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PackageCard } from "@/components/shared/package-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/motion";
import { BUDGET_RANGES, DURATION_RANGES, PACKAGE_CATEGORIES, SORT_OPTIONS } from "@/constants";
import type { PackageDocument, DestinationDocument } from "@/types";

interface PackageFiltersProps {
  destinations: DestinationDocument[];
  initialPackages: PackageDocument[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export function PackageFiltersClient({
  destinations,
  initialPackages,
  total,
  totalPages,
  currentPage,
}: PackageFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (!updates.page) params.delete("page");
      router.push(`/packages?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => router.push("/packages");

  const hasActiveFilters = [
    "search", "destination", "category", "budget", "duration", "sort",
  ].some((key) => searchParams.get(key));

  return (
    <div className="container-custom section-padding">
      <FadeIn>
        <SectionHeading
          subtitle="Packages"
          title="Explore Our Travel Packages"
          description={`Discover ${total} curated travel experiences designed for every type of traveler.`}
        />
      </FadeIn>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search packages..."
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => {
              const value = e.target.value;
              const timeout = setTimeout(() => updateParams({ search: value || undefined }), 400);
              return () => clearTimeout(timeout);
            }}
            className="pl-9"
            aria-label="Search packages"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
          </Button>

          <div className="hidden items-center gap-1 rounded-lg border p-1 lg:flex">
            <button
              onClick={() => setView("grid")}
              className={`rounded-md p-2 transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-md p-2 transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              aria-label="List view"
              aria-pressed={view === "list"}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside
          className={`${showFilters ? "block" : "hidden"} w-full shrink-0 space-y-4 lg:block lg:w-64`}
          aria-label="Package filters"
        >
          <div className="rounded-xl border bg-background p-5 space-y-4 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <X className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Select
                value={searchParams.get("destination") || ""}
                onValueChange={(v) => updateParams({ destination: v || undefined })}
              >
                <SelectTrigger><SelectValue placeholder="All destinations" /></SelectTrigger>
                <SelectContent>
                  {destinations.map((d) => (
                    <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={searchParams.get("category") || ""}
                onValueChange={(v) => updateParams({ category: v || undefined })}
              >
                <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
                <SelectContent>
                  {PACKAGE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Budget</label>
              <Select
                value={searchParams.get("budget") || ""}
                onValueChange={(v) => {
                  const range = BUDGET_RANGES.find((b) => b.label === v);
                  if (range) {
                    updateParams({
                      budget: v,
                      minPrice: String(range.min),
                      maxPrice: range.max === Infinity ? undefined : String(range.max),
                    });
                  } else {
                    updateParams({ budget: undefined, minPrice: undefined, maxPrice: undefined });
                  }
                }}
              >
                <SelectTrigger><SelectValue placeholder="Any budget" /></SelectTrigger>
                <SelectContent>
                  {BUDGET_RANGES.map((range) => (
                    <SelectItem key={range.label} value={range.label}>{range.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Select
                value={searchParams.get("duration") || ""}
                onValueChange={(v) => {
                  const range = DURATION_RANGES.find((d) => d.label === v);
                  if (range) {
                    updateParams({
                      duration: v,
                      minDuration: String(range.min),
                      maxDuration: range.max === Infinity ? undefined : String(range.max),
                    });
                  } else {
                    updateParams({ duration: undefined, minDuration: undefined, maxDuration: undefined });
                  }
                }}
              >
                <SelectTrigger><SelectValue placeholder="Any duration" /></SelectTrigger>
                <SelectContent>
                  {DURATION_RANGES.map((range) => (
                    <SelectItem key={range.label} value={range.label}>{range.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select
                value={searchParams.get("sort") || "newest"}
                onValueChange={(v) => updateParams({ sort: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {initialPackages.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-secondary py-20 text-center">
              <p className="text-lg font-medium">No packages found</p>
              <p className="mt-2 text-muted-foreground">Try adjusting your filters or search terms.</p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline" className="mt-4">Clear Filters</Button>
              )}
            </div>
          ) : (
            <>
              <div className={view === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
                {initialPackages.map((pkg) => (
                  <PackageCard key={pkg._id} pkg={pkg} variant={view} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => updateParams({ page: String(page) })}
                      className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? "bg-primary text-primary-foreground"
                          : "border hover:bg-secondary"
                      }`}
                      aria-label={`Page ${page}`}
                      aria-current={page === currentPage ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
