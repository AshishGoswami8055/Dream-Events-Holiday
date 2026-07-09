import { Metadata } from "next";
import { SITE_CONFIG } from "@/constants";
import { absoluteUrl } from "@/lib/utils";

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}

export function generateSEO({
  title,
  description = SITE_CONFIG.description,
  path = "",
  image,
  noIndex = false,
  type = "website",
}: SEOProps): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image || absoluteUrl("/logo.png");

  return {
    title,
    description,
    metadataBase: new URL(SITE_CONFIG.url),
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "en_IN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

import type { PublicSiteConfig } from "@/lib/site-settings";

export function generateTravelAgencyJsonLd(config?: PublicSiteConfig) {
  const c = config;
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: c?.name ?? SITE_CONFIG.name,
    description: c?.description ?? SITE_CONFIG.description,
    url: c?.url ?? SITE_CONFIG.url,
    telephone: c?.phone ?? SITE_CONFIG.phone,
    email: c?.email ?? SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: c?.address ?? SITE_CONFIG.address,
      addressCountry: "IN",
    },
    sameAs: Object.values(c?.social ?? SITE_CONFIG.social),
  };
}

export function generateTourJsonLd(tour: {
  title: string;
  description: string;
  slug: string;
  price: number;
  duration: number;
  location: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.description,
    url: absoluteUrl(`/packages/${tour.slug}`),
    image: tour.image,
    touristType: "Leisure",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tour.duration,
    },
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    contentLocation: {
      "@type": "Place",
      name: tour.location,
    },
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
