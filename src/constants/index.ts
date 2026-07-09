import { getSiteUrl } from "@/lib/site-url";

export const SITE_CONFIG = {
  name: "Dream Event & Holidays",
  tagline: "Explore. Experience. Remember.",
  description:
    "Discover exceptional travel experiences across India and the world with thoughtfully crafted holidays. From romantic honeymoons and family vacations to corporate retreats and customized tours, every journey is designed with care, comfort, and attention to detail.",
  url: getSiteUrl(),
  email: "dreamevents.holidays@gmail.com",
  phone: "+91 9023612162",
  address: "Ahmedabad (Head Office) · Modasa · Surat, Gujarat, India",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919023612162",
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
    title: "Exceptional Value, Unmatched Service",
    description:
      "Competitive pricing paired with personalized care, expert guidance, and memorable travel experiences.",
    icon: "BadgeCheck",
  },
  {
    title: "Expert Travel Consultation",
    description:
      "We don't just book your trip; we help you choose the right destination, the best season, and the perfect plan based on your budget and travel goals.",
    icon: "MessageCircle",
  },
  {
    title: "Personalized Holiday Planning",
    description:
      "Every itinerary is thoughtfully designed to match your travel style, interests, and preferences.",
    icon: "Map",
  },
  {
    title: "Destination & Season Expertise",
    description:
      "Our in-depth destination knowledge ensures you travel at the perfect time for the best experiences.",
    icon: "Compass",
  },
  {
    title: "Professional Itinerary Experts",
    description:
      "Carefully planned journeys with the ideal balance of sightseeing, comfort, leisure, and local experiences.",
    icon: "ClipboardList",
  },
  {
    title: "Verified Hotels & Trusted Partners",
    description: "Quality accommodations and reliable travel services you can trust.",
    icon: "Hotel",
  },
  {
    title: "Online & Offline Booking Assistance",
    description:
      "Enjoy a smooth booking experience, whether you prefer to book online or visit us personally.",
    icon: "MonitorSmartphone",
  },
  {
    title: "Exclusive Royalty Membership",
    description:
      "Unlock exclusive discounts, travel rewards, special offers, and member-only privileges.",
    icon: "Crown",
  },
  {
    title: "Complete Travel Solutions",
    description:
      "Flights, hotels, visa assistance, holiday packages, cruises, transfers, and more — all under one roof.",
    icon: "Layers",
  },
  {
    title: "Family, Honeymoon, Corporate & Group Tours",
    description: "Tailored travel experiences for every occasion.",
    icon: "Users",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges, no surprises — just honest and fair pricing.",
    icon: "IndianRupee",
  },
  {
    title: "Safe & Secure Booking",
    description: "Book with confidence through a reliable and hassle-free process.",
    icon: "ShieldCheck",
  },
  {
    title: "Dedicated Experts & 24×7 Support",
    description: "We're with you before, during, and after your journey.",
    icon: "Headphones",
  },
  {
    title: "Trusted by Thousands",
    description:
      "Building lasting relationships through exceptional service and unforgettable experiences.",
    icon: "HeartHandshake",
  },
] as const;

export const TRAVEL_STATS = [
  { value: "6,000+", label: "Happy Travelers" },
  { value: "180+", label: "Destinations" },
  { value: "Best Price", label: "Guarantee" },
  { value: "24×7", label: "Travel Support" },
] as const;

export const SERVICE_CATEGORIES = [
  {
    title: "Travel Bookings",
    description: "Flights, trains, hotels, and visa support — booked with care.",
    icon: "Plane",
    items: [
      "Flight Booking",
      "Train Ticket Booking",
      "Hotel Reservations",
      "Visa Assistance",
      "Attraction Tickets",
    ],
  },
  {
    title: "Holiday Packages",
    description: "Thoughtfully crafted tours for every kind of traveler.",
    icon: "Globe2",
    items: [
      "Domestic Tours",
      "International Tours",
      "Honeymoon Packages",
      "Family Holidays",
      "Group Departures",
    ],
  },
  {
    title: "Premium Services",
    description: "Elevated experiences for celebrations, business, and beyond.",
    icon: "Sparkles",
    items: [
      "Corporate Travel & MICE",
      "Cruise Holidays",
      "Destination Weddings",
      "Cab & Transfers",
      "Customized Itineraries",
      "Royalty Membership",
    ],
  },
] as const;

export const ABOUT_JOURNEY = [
  { value: "2019", label: "Established" },
  { value: "2021", label: "First Office" },
  { value: "10+", label: "Dedicated Team Members" },
  { value: "3", label: "Branches Across Gujarat" },
  { value: "10+", label: "Destination Weddings Managed" },
  { value: "25+", label: "Corporate Clients Every Year" },
  { value: "1000s", label: "Happy Travelers" },
] as const;

export const VISION_MISSION = {
  vision:
    "To be recognized as one of India's most trusted travel and event companies by delivering exceptional value, expert guidance, and personalized experiences. Whether it's a flight, hotel, holiday, corporate travel, destination wedding, or a once-in-a-lifetime vacation, we strive to make every journey seamless, every celebration memorable, and every customer feel their trust—and every rupee invested—was truly worthwhile.",
  mission:
    "To provide complete travel and event solutions under one roof with integrity, professionalism, and genuine care. By combining expert consultation, transparent pricing, personalized planning, and dedicated support, we help individuals, families, and businesses travel smarter, celebrate better, and create unforgettable memories—while ensuring every experience exceeds expectations.",
} as const;

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
