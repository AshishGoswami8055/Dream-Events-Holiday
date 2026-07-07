"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Compass } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUDGET_RANGES } from "@/constants";
import type { DestinationDocument } from "@/types";

interface SearchPackagesProps {
  destinations: DestinationDocument[];
}

export function SearchPackages({ destinations }: SearchPackagesProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (destination) params.set("destination", destination);
    if (budget) {
      const range = BUDGET_RANGES.find((b) => b.label === budget);
      if (range) {
        params.set("budget", range.label);
        params.set("minPrice", String(range.min));
        if (range.max !== Infinity) params.set("maxPrice", String(range.max));
      }
    }
    router.push(`/packages?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="glass-dark mx-auto max-w-5xl rounded-2xl p-2 shadow-2xl md:p-3"
      role="search"
      aria-label="Search travel packages"
    >
      <div className="grid gap-2 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/10">
        <div className="relative flex items-center px-4 py-2">
          <Search className="mr-3 h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />
          <Input
            placeholder="Where to go?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0 shadow-none"
            aria-label="Search packages"
          />
        </div>

        <div className="flex items-center px-4 py-2">
          <MapPin className="mr-3 h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="border-0 bg-transparent text-white shadow-none focus:ring-0 [&>span]:text-white/70" aria-label="Select destination">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((dest) => (
                <SelectItem key={dest._id} value={dest._id}>
                  {dest.name}, {dest.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center px-4 py-2">
          <Calendar className="mr-3 h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className="border-0 bg-transparent text-white shadow-none focus:ring-0 [&>span]:text-white/70" aria-label="Select budget">
              <SelectValue placeholder="Budget" />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_RANGES.map((range) => (
                <SelectItem key={range.label} value={range.label}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-2 md:p-0 md:pl-2">
          <Button type="submit" size="lg" className="h-full w-full rounded-xl bg-white text-black hover:bg-white/90 btn-glow-light md:rounded-l-none md:rounded-r-xl">
            <Compass className="h-4 w-4" aria-hidden="true" />
            Search Now
          </Button>
        </div>
      </div>
    </form>
  );
}
