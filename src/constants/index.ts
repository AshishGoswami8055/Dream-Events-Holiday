export const SITE_CONFIG = {
  name: "Dream Events & Holiday",
  tagline: "Crafting Unforgettable Journeys",
  description:
    "Premium travel experiences and curated holiday packages. Discover breathtaking destinations with Dream Events & Holiday — your trusted luxury travel partner.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  email: "info@dreamevents.com",
  phone: "+91 98765 43210",
  address: "123 Travel Plaza, Mumbai, Maharashtra 400001, India",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
  social: {
    facebook: "https://facebook.com/dreamevents",
    instagram: "https://instagram.com/dreamevents",
    twitter: "https://twitter.com/dreamevents",
    youtube: "https://youtube.com/dreamevents",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/packages", label: "Packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const PACKAGE_CATEGORIES = [
  "Adventure",
  "Beach",
  "Cultural",
  "Family",
  "Honeymoon",
  "Luxury",
  "Pilgrimage",
  "Wildlife",
] as const;

export const PACKAGE_STATUSES = ["draft", "published", "archived"] as const;

export const INQUIRY_STATUSES = ["new", "contacted", "confirmed", "closed"] as const;

export const BUDGET_RANGES = [
  { label: "Under ₹25,000", min: 0, max: 25000 },
  { label: "₹25,000 - ₹50,000", min: 25000, max: 50000 },
  { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
  { label: "₹1,00,000 - ₹2,00,000", min: 100000, max: 200000 },
  { label: "Above ₹2,00,000", min: 200000, max: Infinity },
] as const;

export const DURATION_RANGES = [
  { label: "1-3 Days", min: 1, max: 3 },
  { label: "4-7 Days", min: 4, max: 7 },
  { label: "8-14 Days", min: 8, max: 14 },
  { label: "15+ Days", min: 15, max: Infinity },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration-asc", label: "Duration: Short to Long" },
  { value: "duration-desc", label: "Duration: Long to Short" },
] as const;

export const WHY_CHOOSE_US = [
  {
    title: "Curated Experiences",
    description: "Every journey is handpicked by our travel experts for authentic, memorable adventures.",
    icon: "Compass",
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock assistance before, during, and after your trip for complete peace of mind.",
    icon: "Headphones",
  },
  {
    title: "Best Price Guarantee",
    description: "Premium experiences at competitive prices with transparent pricing and no hidden fees.",
    icon: "BadgeCheck",
  },
  {
    title: "Trusted by Thousands",
    description: "Over 10,000 happy travelers have explored the world with Dream Events & Holiday.",
    icon: "Users",
  },
] as const;

export const TRAVEL_STATS = [
  { value: "10K+", label: "Happy Travelers" },
  { value: "150+", label: "Destinations" },
  { value: "500+", label: "Tour Packages" },
  { value: "15+", label: "Years Experience" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "How do I book a travel package?",
    answer:
      "Browse our packages, select your preferred option, and fill out the inquiry form. Our travel experts will contact you within 24 hours to confirm details and assist with booking.",
  },
  {
    question: "What is included in the package price?",
    answer:
      "Each package clearly lists inclusions such as accommodation, meals, transfers, and activities. Exclusions are also specified. Contact us for custom package options.",
  },
  {
    question: "Can I customize my travel itinerary?",
    answer:
      "Absolutely! We specialize in tailor-made journeys. Share your preferences and our team will craft a personalized itinerary to match your dreams.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellation terms vary by package and provider. We provide full details before booking. Travel insurance is recommended for added protection.",
  },
  {
    question: "Do you offer group discounts?",
    answer:
      "Yes, we offer special rates for groups of 6 or more travelers. Contact us with your group size and preferred destination for a custom quote.",
  },
  {
    question: "Is travel insurance included?",
    answer:
      "Travel insurance is optional but highly recommended. We can arrange comprehensive coverage as part of your package upon request.",
  },
] as const;

export const ITEMS_PER_PAGE = 9;

export const RATE_LIMIT = {
  windowMs: 60 * 1000,
  maxRequests: 10,
} as const;
