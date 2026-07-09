"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PlaceSuggestion {
  placeId: string;
  label: string;
  lat: number;
  lon: number;
  embedUrl: string;
}

interface MapLocationSearchProps {
  value?: string;
  onChange: (embedUrl: string) => void;
}

export function MapLocationSearch({ value, onChange }: MapLocationSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasMap = Boolean(value?.trim());

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      const res = await fetch(`/api/places/search?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }

      setSuggestions(data.suggestions || []);
      setOpen((data.suggestions || []).length > 0);
    } catch (err) {
      setSuggestions([]);
      setError(err instanceof Error ? err.message : "Could not search locations");
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectPlace = (suggestion: PlaceSuggestion) => {
    setError("");
    setOpen(false);
    setQuery(suggestion.label);
    setSelectedLabel(suggestion.label);
    onChange(suggestion.embedUrl);
  };

  const clearMap = () => {
    onChange("");
    setQuery("");
    setSelectedLabel("");
    setSuggestions([]);
    setError("");
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      <div>
        <Label>Package Location Map</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Search any city or destination — map is added automatically. 100% free, no API key needed.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (hasMap && e.target.value !== selectedLabel) {
              onChange("");
              setSelectedLabel("");
            }
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Search location, e.g. Jaipur, Kerala, Maldives..."
          className="pl-9 pr-9"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        {hasMap && !isSearching && (
          <button
            type="button"
            onClick={clearMap}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Remove map"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {open && suggestions.length > 0 && (
          <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border bg-background shadow-lg">
            {suggestions.map((suggestion) => (
              <li key={suggestion.placeId}>
                <button
                  type="button"
                  onClick={() => selectPlace(suggestion)}
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-secondary"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{suggestion.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {hasMap && (
        <div className="space-y-2">
          {selectedLabel ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {selectedLabel}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Map added to this package</p>
          )}
          <div className="overflow-hidden rounded-xl border">
            <iframe
              src={value}
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Selected location map preview"
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={clearMap}>
            Remove Map
          </Button>
        </div>
      )}

      {!hasMap && !error && (
        <p className="text-xs text-muted-foreground">
          Powered by OpenStreetMap — free worldwide location search.
        </p>
      )}
    </div>
  );
}
