"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn, ScaleIn } from "@/components/shared/motion";
import type { GalleryDocument } from "@/types";

interface GalleryPageClientProps {
  items: GalleryDocument[];
  categories: string[];
}

export function GalleryPageClient({ items, categories }: GalleryPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryDocument | null>(null);

  const filtered = activeCategory === "All"
    ? items
    : items.filter((item) => item.category === activeCategory);

  return (
    <div className="container-custom section-padding">
      <FadeIn>
        <SectionHeading
          subtitle="Gallery"
          title="Travel Gallery"
          description="Stunning moments captured from journeys around the world."
        />
      </FadeIn>

      <FadeIn>
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FadeIn>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((item, index) => (
          <ScaleIn key={item._id} delay={index * 0.03}>
            <button
              onClick={() => setLightbox(item)}
              className="mb-4 block w-full overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`View ${item.title}`}
            >
              <div className="relative">
                <Image
                  src={item.image.url}
                  alt={item.title}
                  width={item.image.width || 600}
                  height={item.image.height || 400}
                  className="w-full object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                  <p className="absolute bottom-3 left-3 text-sm font-medium text-white">{item.title}</p>
                </div>
              </div>
            </button>
          </ScaleIn>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery lightbox"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-h-[80vh] max-w-5xl">
            <Image
              src={lightbox.image.url}
              alt={lightbox.title}
              width={lightbox.image.width || 1200}
              height={lightbox.image.height || 800}
              className="max-h-[80vh] w-auto object-contain"
            />
            <p className="mt-4 text-center text-white">{lightbox.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
