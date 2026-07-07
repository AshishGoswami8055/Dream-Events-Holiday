import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn, ScaleIn } from "@/components/shared/motion";
import type { GalleryDocument } from "@/types";

interface GalleryPreviewProps {
  items: GalleryDocument[];
}

export function GalleryPreview({ items }: GalleryPreviewProps) {
  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-secondary" aria-labelledby="gallery-heading">
      <div className="container-custom">
        <FadeIn>
          <SectionHeading
            subtitle="Gallery"
            title="Moments That Inspire"
            description="Glimpses of extraordinary journeys and breathtaking destinations."
          />
        </FadeIn>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {items.slice(0, 8).map((item, index) => (
            <ScaleIn key={item._id} delay={index * 0.05}>
              <div
                className={`relative overflow-hidden rounded-xl ${
                  index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                }`}
              >
                <Image
                  src={item.image.url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  sizes={index === 0 ? "50vw" : "25vw"
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                  <p className="absolute bottom-3 left-3 text-sm font-medium text-white">{item.title}</p>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>

        <FadeIn className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View Full Gallery
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
