"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_IMAGE_URL } from "@/constants/images";
import { SearchPackages } from "@/features/home/search-packages";
import { SITE_CONFIG } from "@/constants";
import type { DestinationDocument } from "@/types";

interface HeroSectionProps {
  destinations: DestinationDocument[];
}

export function HeroSection({ destinations }: HeroSectionProps) {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden" aria-label="Hero">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE_URL}
          alt="Cinematic lake and mountain landscape — luxury travel"
          fill
          priority
          className="object-cover scale-105"
          sizes="100vw"
        />
        <div className="cinematic-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      <div className="container-custom relative z-10 pt-32 pb-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-white text-white" aria-hidden="true" />
                ))}
              </div>
              <span className="text-sm text-white/90">Trusted by 10,000+ travelers worldwide</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
              Discover Your Next
              <span className="mt-2 block text-gradient">Dream Adventure</span>
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
              {SITE_CONFIG.tagline}. Curated luxury journeys to the world&apos;s most breathtaking destinations.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="xl" variant="accent" className="btn-glow rounded-full px-8 bg-white text-black hover:bg-white/90">
                <Link href="/packages">
                  Explore Packages
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="rounded-full border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
              >
                <Link href="/contact">Plan Custom Trip</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-14"
        >
          <SearchPackages destinations={destinations} />
        </motion.div>
      </div>
    </section>
  );
}
