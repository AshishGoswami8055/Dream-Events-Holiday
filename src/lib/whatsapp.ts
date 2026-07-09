import type { PublicSiteConfig } from "@/lib/site-settings";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";

export interface PackageWhatsAppDetails {
  title: string;
  slug: string;
  location: string;
  destinationName?: string;
  price: number;
  duration: number;
  category: string;
  description: string;
  highlights?: string[];
  includes?: string[];
}

export function packageToWhatsAppDetails(pkg: {
  title: string;
  slug: string;
  location: string;
  destination?: { name?: string } | string;
  price: number;
  duration: number;
  category: string;
  description: string;
  highlights?: string[];
  includes?: string[];
}): PackageWhatsAppDetails {
  const destinationName =
    typeof pkg.destination === "object" && pkg.destination
      ? pkg.destination.name
      : undefined;

  return {
    title: pkg.title,
    slug: pkg.slug,
    location: pkg.location,
    destinationName,
    price: pkg.price,
    duration: pkg.duration,
    category: pkg.category,
    description: pkg.description,
    highlights: pkg.highlights?.filter(Boolean).slice(0, 5),
    includes: pkg.includes?.filter(Boolean).slice(0, 5),
  };
}

export function buildPackageWhatsAppMessage(
  details: PackageWhatsAppDetails,
  config: Pick<PublicSiteConfig, "name" | "url">
): string {
  const packageUrl = `${config.url}/packages/${details.slug}`;
  const lines = [
    `Hello ${config.name}! 👋`,
    "",
    "I'm interested in the following travel package:",
    "",
    `📦 *${details.title}*`,
    `📍 Location: ${details.location}`,
  ];

  if (details.destinationName) {
    lines.push(`🌍 Destination: ${details.destinationName}`);
  }

  lines.push(
    `💰 Price: ${formatPrice(details.price)} per person`,
    `📅 Duration: ${details.duration} Days`,
    `🏷️ Category: ${details.category}`,
    "",
    "*Overview:*",
    details.description.trim(),
  );

  if (details.highlights?.length) {
    lines.push("", "*Highlights:*");
    details.highlights.forEach((item) => lines.push(`• ${item}`));
  }

  if (details.includes?.length) {
    lines.push("", "*Includes:*");
    details.includes.forEach((item) => lines.push(`• ${item}`));
  }

  lines.push(
    "",
    `🔗 Package link: ${packageUrl}`,
    "",
    "Please share availability, best travel dates, and booking details. Thank you!"
  );

  return lines.join("\n");
}

export function getPackageWhatsAppUrl(
  details: PackageWhatsAppDetails,
  config: PublicSiteConfig
): string {
  const message = buildPackageWhatsAppMessage(details, config);
  return getWhatsAppUrl(config.whatsapp, message);
}
