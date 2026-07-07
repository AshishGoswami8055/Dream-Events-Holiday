import type { CloudinaryImage } from "@/types";

/** Verified Unsplash URLs — photo IDs tested for availability */
export function travelImage(
  photoId: string,
  width = 800,
  height = 600,
  publicId?: string
): CloudinaryImage {
  const url = `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&q=80`;
  return {
    publicId: publicId || `unsplash/${photoId}`,
    url,
    width,
    height,
  };
}

export const TRAVEL_IMAGES = {
  hero: travelImage("photo-1469474968028-56623f02e42e", 1920, 1080, "hero"),
  heroCinematic: travelImage("photo-1469854523086-cc02fe5d8800", 1920, 1080, "hero-cinematic"),
  aboutBanner: travelImage("photo-1488085061387-422e29b40080", 1920, 800, "about-banner"),
  aboutTeam: travelImage("photo-1522071820081-009f0129c71c", 800, 600, "about-team"),
  packagesBanner: travelImage("photo-1502602898657-3e91760cbb34", 1920, 700, "packages-banner"),
  destinationsBanner: travelImage("photo-1470071459604-3b5ec3a7fe05", 1920, 700, "destinations-banner"),
  galleryBanner: travelImage("photo-1464822759023-fed622ff2c3b", 1920, 700, "gallery-banner"),
  contactBanner: travelImage("photo-1488085061387-422e29b40080", 1920, 600, "contact-banner"),
  testimonialsBanner: travelImage("photo-1522202176988-66273c2fd55f", 1920, 600, "testimonials-banner"),
  faqBanner: travelImage("photo-1488646953014-85cb44e25828", 1920, 600, "faq-banner"),

  maldives: travelImage("photo-1573843981267-be1999ff37cd", 800, 600),
  maldives2: travelImage("photo-1507525428034-b723cf961d3e", 800, 600),
  maldives3: travelImage("photo-1544551763-46a013bb70d5", 800, 600),
  rajasthan: travelImage("photo-1548013146-72479768bada", 800, 600),
  rajasthan2: travelImage("photo-1564507592333-c60657eea523", 800, 600),
  rajasthan3: travelImage("photo-1582719478250-c89cae4dc85b", 800, 600),
  kerala: travelImage("photo-1605649487212-47bdab064df7", 800, 600),
  kerala2: travelImage("photo-1571896349842-33c89424de2d", 800, 600),
  europe: travelImage("photo-1513635269975-59663e0ac1ad", 800, 600),
  europe2: travelImage("photo-1523906834658-6e24ef2386f9", 800, 600),
  europe3: travelImage("photo-1502602898657-3e91760cbb34", 800, 600),
  ladakh: travelImage("photo-1464822759023-fed622ff2c3b", 800, 600),
  ladakh2: travelImage("photo-1519681393784-d120267933ba", 800, 600),
  goa: travelImage("photo-1559827260-dc66d52bef19", 800, 600),
  goa2: travelImage("photo-1519046904884-53103b34b206", 800, 600),
  dubai: travelImage("photo-1512453979798-5ea266f8880c", 800, 600),
  dubai2: travelImage("photo-1613490493576-7fde63acd811", 800, 600),
  bali: travelImage("photo-1518548419970-58e3b4079ab2", 800, 600),
  bali2: travelImage("photo-1555400038-63f5ba517a47", 800, 600),
  switzerland: travelImage("photo-1505142468610-359e7d316be0", 800, 600),
  safari: travelImage("photo-1516426122078-c23e76319801", 800, 600),
  cruise: travelImage("photo-1542314831-068cd1dbfeeb", 800, 600),
  temple: travelImage("photo-1548013146-72479768bada", 800, 600),
  desert: travelImage("photo-1500530855697-b586d89ba3ee", 800, 600),
} as const;

export const HERO_IMAGE_URL = TRAVEL_IMAGES.heroCinematic.url;
export const ABOUT_BANNER_URL = TRAVEL_IMAGES.aboutBanner.url;
export const ABOUT_TEAM_URL = TRAVEL_IMAGES.aboutTeam.url;
