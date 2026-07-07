import bcrypt from "bcryptjs";
import connectDB from "../lib/db";
import AdminUser from "../models/AdminUser";
import Destination from "../models/Destination";
import Package from "../models/Package";
import Gallery from "../models/Gallery";
import { I, MAPS, DEFAULT_FAQS } from "./seed-images";

const forceRefresh = process.argv.includes("--force");

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@dreamevents.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const existingAdmin = await AdminUser.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await AdminUser.create({
      name: process.env.ADMIN_NAME || "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "superadmin",
    });
    console.log(`Admin created: ${adminEmail}`);
  } else {
    console.log("Admin user already exists");
  }
}

async function seedContent() {
  if (forceRefresh) {
    console.log("Force refresh: clearing packages, destinations, and gallery...");
    await Promise.all([
      Package.deleteMany({}),
      Destination.deleteMany({}),
      Gallery.deleteMany({}),
    ]);
  } else if ((await Destination.countDocuments()) > 0) {
    console.log("Data already exists. Run with --force to refresh all content.");
    return;
  }

  const destinations = await Destination.insertMany([
    {
      name: "Maldives",
      slug: "maldives",
      country: "Maldives",
      description:
        "Turquoise lagoons, private overwater villas, and world-class diving — the Maldives is the ultimate luxury escape for honeymoons and celebrations.",
      image: I.maldives,
      featured: true,
    },
    {
      name: "Rajasthan",
      slug: "rajasthan",
      country: "India",
      description:
        "Palace hotels, desert safaris, and centuries of royal heritage — experience India at its most majestic across the Golden Triangle and beyond.",
      image: I.rajasthan,
      featured: true,
    },
    {
      name: "Kerala",
      slug: "kerala",
      country: "India",
      description:
        "Emerald backwaters, misty hill stations, and authentic Ayurveda — God's Own Country offers serenity and culture in equal measure.",
      image: I.kerala,
      featured: true,
    },
    {
      name: "Europe",
      slug: "europe",
      country: "Multi-Country",
      description:
        "From Parisian boulevards to Roman ruins and Swiss Alps — discover the art, cuisine, and history of the world's most iconic continent.",
      image: I.europe,
      featured: true,
    },
    {
      name: "Dubai",
      slug: "dubai",
      country: "UAE",
      description:
        "Futuristic skylines, desert adventures, and five-star hospitality — Dubai delivers luxury, shopping, and unforgettable experiences.",
      image: I.dubai,
      featured: true,
    },
    {
      name: "Bali",
      slug: "bali",
      country: "Indonesia",
      description:
        "Rice terraces, sacred temples, and boutique beach clubs — Bali is the perfect blend of spirituality, adventure, and island relaxation.",
      image: I.bali,
      featured: true,
    },
    {
      name: "Ladakh",
      slug: "ladakh",
      country: "India",
      description:
        "High-altitude passes, ancient monasteries, and Pangong's blue waters — Ladakh is India's most dramatic adventure destination.",
      image: I.ladakh,
      featured: false,
    },
    {
      name: "Goa",
      slug: "goa",
      country: "India",
      description:
        "Golden beaches, Portuguese heritage, and vibrant nightlife — Goa is India's favourite coastal getaway for every type of traveller.",
      image: I.goa,
      featured: false,
    },
  ]);

  console.log(`Created ${destinations.length} destinations`);

  const [maldives, rajasthan, kerala, europe, dubai, bali, ladakh, goa] = destinations;

  await Package.insertMany([
    {
      title: "Maldives Paradise Escape — 5 Star Overwater Villa",
      slug: "maldives-paradise-escape",
      location: "South Malé Atoll, Maldives",
      destination: maldives._id,
      price: 124999,
      duration: 6,
      description:
        "Indulge in the ultimate tropical escape with six unforgettable days in the Maldives. Stay in a premium overwater villa with direct lagoon access, enjoy candlelit beach dinners, snorkel vibrant coral reefs, and unwind with couples spa rituals. Every detail is curated for romance, relaxation, and pure luxury.",
      highlights: [
        "Premium Overwater Villa with Private Deck",
        "Return Flights from Mumbai/Delhi",
        "All-Inclusive Dining & Premium Beverages",
        "Sunset Dolphin Cruise",
        "Couples Spa & Snorkeling Excursion",
        "Speedboat Airport Transfers",
      ],
      includes: [
        "Return economy flights",
        "5 nights in 5-star overwater villa",
        "All meals & selected beverages",
        "Speedboat transfers",
        "Sunset cruise & snorkeling trip",
        "Travel insurance (basic)",
      ],
      excludes: [
        "Scuba diving (available at supplement)",
        "Personal expenses & tips",
        "Visa on arrival fees (if applicable)",
      ],
      itinerary: [
        { day: 1, title: "Welcome to Paradise", description: "Arrive at Velana International Airport. VIP speedboat transfer to resort. Welcome champagne, villa orientation, and sunset dinner on the beach." },
        { day: 2, title: "Lagoon & Reef Discovery", description: "Morning snorkeling over house reef. Afternoon at leisure — infinity pool, water hammock, or spa. Private sandbank dinner under the stars." },
        { day: 3, title: "Ocean Adventures", description: "Optional scuba diving or semi-submarine tour. Jet ski or parasailing for thrill-seekers. Evening couples massage at world-class spa." },
        { day: 4, title: "Island Hopping", description: "Half-day excursion to local island. Visit traditional fishing village. Return for sunset dolphin watching cruise with canapés." },
        { day: 5, title: "Day of Bliss", description: "Full day at leisure. Yoga session at sunrise. Floating breakfast in villa. Farewell chef's tasting menu." },
        { day: 6, title: "Departure", description: "Leisurely breakfast. Checkout and speedboat transfer to airport for your return flight." },
      ],
      featured: true,
      images: [I.maldives, I.maldives2, I.maldives3],
      coverImage: I.maldives,
      category: "Honeymoon",
      status: "published",
      faqs: [
        { question: "Is visa required for Indian citizens?", answer: "Indian passport holders receive a free 30-day visa on arrival in the Maldives." },
        { question: "Best time to visit?", answer: "November to April offers the best weather — calm seas and minimal rainfall." },
        ...DEFAULT_FAQS,
      ],
      mapEmbedUrl: MAPS.maldives,
    },
    {
      title: "Royal Rajasthan Heritage Tour — Palaces & Desert",
      slug: "royal-rajasthan-heritage-tour",
      location: "Jaipur · Udaipur · Jodhpur",
      destination: rajasthan._id,
      price: 54999,
      duration: 8,
      description:
        "Walk in the footsteps of maharajas on this immersive 8-day journey through Rajasthan's most iconic cities. Stay in heritage palace hotels, explore UNESCO-listed forts, cruise Lake Pichola at sunset, and experience a magical night under the stars in the Thar Desert.",
      highlights: [
        "Heritage Palace Hotel Stays",
        "Amber Fort & City Palace Tours",
        "Lake Pichola Sunset Cruise",
        "Mehrangarh Fort & Blue City Walk",
        "Desert Safari with Cultural Show",
        "Private AC Vehicle & Expert Guide",
      ],
      includes: [
        "7 nights in 4-star heritage hotels",
        "Daily breakfast & dinner",
        "Private AC sedan with driver",
        "English-speaking guide",
        "Monument entry fees",
        "Desert camp with dinner",
      ],
      excludes: ["Lunch", "Camera fees at monuments", "Personal expenses", "Flights to Jaipur"],
      itinerary: [
        { day: 1, title: "Jaipur — The Pink City", description: "Arrive Jaipur. Check into heritage hotel. Evening walk through Hawa Mahal and Johari Bazaar." },
        { day: 2, title: "Jaipur Forts & Palaces", description: "Elephant ride at Amber Fort. City Palace, Jantar Mantar, and Albert Hall Museum. Traditional Rajasthani dinner." },
        { day: 3, title: "Jaipur to Udaipur", description: "Scenic drive to Udaipur via countryside. Evening boat ride on Lake Pichola with palace views." },
        { day: 4, title: "Udaipur — City of Lakes", description: "City Palace complex, Jagdish Temple, Saheliyon ki Bari gardens. Sunset at Monsoon Palace." },
        { day: 5, title: "Udaipur to Jodhpur", description: "Drive via Ranakpur Jain Temple — architectural marvel. Arrive Jodhpur, the Blue City." },
        { day: 6, title: "Jodhpur Exploration", description: "Mehrangarh Fort, Jaswant Thada, and clock tower market. Afternoon at leisure." },
        { day: 7, title: "Desert Safari — Osian", description: "Transfer to desert camp. Camel safari at sunset. Folk music, fire dance, and BBQ dinner under stars." },
        { day: 8, title: "Departure", description: "Morning at leisure. Transfer to Jodhpur airport for onward journey." },
      ],
      featured: true,
      images: [I.rajasthan, I.rajasthan2, I.rajasthan3],
      coverImage: I.rajasthan,
      category: "Cultural",
      status: "published",
      faqs: DEFAULT_FAQS,
      mapEmbedUrl: MAPS.rajasthan,
    },
    {
      title: "Kerala Backwaters & Hills — Nature Retreat",
      slug: "kerala-backwaters-retreat",
      location: "Munnar · Alleppey · Cochin",
      destination: kerala._id,
      price: 36999,
      duration: 6,
      description:
        "Drift through palm-fringed backwaters on a private houseboat, breathe the cool air of Munnar's tea country, and discover Kerala's rich culture — from Kathakali performances to spice plantations. A perfect family or couples retreat.",
      highlights: [
        "Luxury Houseboat Overnight Cruise",
        "Munnar Tea Plantation Tour",
        "Kathakali Cultural Performance",
        "Ayurvedic Wellness Session",
        "Chinese Fishing Nets at Fort Kochi",
        "Spice Garden & Elephant Visit",
      ],
      includes: [
        "5 nights accommodation (resort + houseboat)",
        "All meals on houseboat",
        "Breakfast at hotels",
        "Private vehicle with driver",
        "Guide services",
        "Cultural show tickets",
      ],
      excludes: ["Flights to Cochin", "Lunch & dinner at hotels (except houseboat)", "Ayurvedic treatments (optional)"],
      itinerary: [
        { day: 1, title: "Arrive Cochin", description: "Airport pickup. Check in. Evening visit to Fort Kochi — Chinese fishing nets and spice market." },
        { day: 2, title: "Cochin to Munnar", description: "Drive through tea estates and waterfalls. Visit spice plantation en route. Check into hill resort." },
        { day: 3, title: "Munnar Highlights", description: "Tea museum, Eravikulam National Park (Nilgiri Tahr), Mattupetty Dam. Evening at leisure." },
        { day: 4, title: "Munnar to Alleppey", description: "Drive to Alleppey. Board luxury houseboat. Cruise through backwaters. Onboard Kerala lunch & dinner." },
        { day: 5, title: "Backwaters & Culture", description: "Disembark houseboat. Kathakali performance. Optional Ayurvedic massage. Overnight at lakeside resort." },
        { day: 6, title: "Departure", description: "Breakfast. Transfer to Cochin airport." },
      ],
      featured: true,
      images: [I.kerala, I.kerala2],
      coverImage: I.kerala,
      category: "Family",
      status: "published",
      faqs: DEFAULT_FAQS,
      mapEmbedUrl: MAPS.kerala,
    },
    {
      title: "European Grand Tour — Paris, Swiss Alps & Rome",
      slug: "european-grand-tour",
      location: "Paris · Interlaken · Rome",
      destination: europe._id,
      price: 219999,
      duration: 12,
      description:
        "Experience Europe's greatest hits on this meticulously planned 12-day journey. Marvel at the Eiffel Tower, cruise Swiss alpine lakes, explore Vatican City, and savour world-class cuisine — all with premium hotels and seamless inter-city travel.",
      highlights: [
        "Eiffel Tower & Seine River Cruise",
        "Swiss Alps Day Trip to Jungfraujoch",
        "Colosseum & Vatican Museums",
        "Scenic Train Journeys",
        "4-Star Central Hotels",
        "Expert Local Guides",
      ],
      includes: [
        "Return international flights",
        "11 nights in 4-star hotels",
        "Daily breakfast",
        "Inter-city trains & transfers",
        "Guided city tours (Paris, Rome)",
        "Jungfraujoch excursion",
      ],
      excludes: ["Schengen visa fees", "Lunch & dinner", "Optional excursions", "Travel insurance"],
      itinerary: [
        { day: 1, title: "Bonjour Paris", description: "Arrive Charles de Gaulle. Transfer to hotel. Evening Seine river cruise with illuminated monuments." },
        { day: 2, title: "Paris Icons", description: "Eiffel Tower (2nd floor), Louvre Museum, Champs-Élysées walk. Free evening for cabaret or fine dining." },
        { day: 3, title: "Versailles", description: "Full-day trip to Palace of Versailles and gardens. Return to Paris for farewell dinner in Montmartre." },
        { day: 4, title: "Paris to Interlaken", description: "High-speed train to Switzerland. Check into alpine hotel. Evening lake walk." },
        { day: 5, title: "Jungfraujoch — Top of Europe", description: "Cogwheel train to Jungfraujoch. Ice Palace, Sphinx Observatory, and alpine views." },
        { day: 6, title: "Swiss Leisure", description: "Optional paragliding or boat cruise on Lake Thun. Free day to explore Interlaken." },
        { day: 7, title: "Interlaken to Rome", description: "Scenic train via Milan. Arrive Rome. Evening stroll through Piazza Navona." },
        { day: 8, title: "Ancient Rome", description: "Colosseum, Roman Forum, Palatine Hill. Afternoon at leisure." },
        { day: 9, title: "Vatican City", description: "Vatican Museums, Sistine Chapel, St. Peter's Basilica. Trastevere food tour in evening." },
        { day: 10, title: "Rome at Leisure", description: "Trevi Fountain, Spanish Steps, Villa Borghese. Optional day trip to Florence or Pompeii." },
        { day: 11, title: "Final Roman Day", description: "Last-minute shopping and gelato. Farewell dinner at traditional trattoria." },
        { day: 12, title: "Departure", description: "Transfer to Fiumicino Airport for return flight." },
      ],
      featured: true,
      images: [I.europe, I.europe2, I.europe3],
      coverImage: I.europe,
      category: "Luxury",
      status: "published",
      faqs: DEFAULT_FAQS,
      mapEmbedUrl: MAPS.europe,
    },
    {
      title: "Dubai Luxury Escape — Skyline & Desert",
      slug: "dubai-luxury-escape",
      location: "Dubai, UAE",
      destination: dubai._id,
      price: 89999,
      duration: 5,
      description:
        "Experience Dubai in style — from the Burj Khalifa's 148th floor to golden desert dunes, world-class shopping, and five-star dining. This 5-day package combines urban glamour with authentic Arabian adventure.",
      highlights: [
        "Burj Khalifa At The Top (Level 148)",
        "Desert Safari with BBQ Dinner",
        "Dhow Cruise on Dubai Marina",
        "Dubai Mall & Gold Souk Visit",
        "5-Star Hotel with Burj View",
        "Private Airport Transfers",
      ],
      includes: [
        "Return flights",
        "4 nights 5-star hotel",
        "Daily breakfast",
        "Desert safari with dinner",
        "Marina dhow cruise",
        "Burj Khalifa tickets",
        "All transfers",
      ],
      excludes: ["UAE visa", "Lunch & dinner (except safari)", "Personal shopping"],
      itinerary: [
        { day: 1, title: "Arrival & Marina", description: "Airport VIP transfer. Check in. Evening dhow cruise with international buffet dinner." },
        { day: 2, title: "Modern Dubai", description: "Burj Khalifa At The Top. Dubai Mall, aquarium, and fountain show. Afternoon at leisure." },
        { day: 3, title: "Old Dubai & Souks", description: "Al Fahidi heritage district, abra ride across Creek, Gold & Spice Souks. Afternoon desert safari." },
        { day: 4, title: "Leisure & Luxury", description: "Free day for beach club, Aquaventure, or shopping. Optional helicopter tour." },
        { day: 5, title: "Departure", description: "Breakfast. Transfer to Dubai International Airport." },
      ],
      featured: true,
      images: [I.dubai, I.dubai2],
      coverImage: I.dubai,
      category: "Luxury",
      status: "published",
      faqs: DEFAULT_FAQS,
      mapEmbedUrl: MAPS.dubai,
    },
    {
      title: "Bali Wellness & Culture Retreat",
      slug: "bali-wellness-culture-retreat",
      location: "Ubud · Seminyak, Bali",
      destination: bali._id,
      price: 64999,
      duration: 7,
      description:
        "Discover Bali's spiritual heart in Ubud's rice terraces and temples, then unwind on Seminyak's stylish beaches. Includes yoga sessions, traditional cooking class, and a visit to the sacred Tanah Lot temple at sunset.",
      highlights: [
        "Ubud Rice Terrace & Monkey Forest",
        "Balinese Cooking Class",
        "Sunset at Tanah Lot Temple",
        "Yoga & Wellness Session",
        "Seminyak Beach Club Access",
        "Private Pool Villa Option",
      ],
      includes: [
        "Return flights",
        "6 nights boutique accommodation",
        "Daily breakfast",
        "Private driver & guide",
        "Cooking class & temple tours",
        "Airport transfers",
      ],
      excludes: ["Indonesia visa on arrival", "Lunch & dinner", "Spa treatments"],
      itinerary: [
        { day: 1, title: "Welcome to Bali", description: "Arrive Denpasar. Transfer to Ubud. Welcome drink and orientation walk." },
        { day: 2, title: "Ubud Culture", description: "Tegallalang rice terraces, Ubud Monkey Forest, art market. Evening traditional dance show." },
        { day: 3, title: "Wellness Day", description: "Morning yoga. Balinese cooking class. Afternoon spa time at leisure." },
        { day: 4, title: "Temple Trail", description: "Tirta Empul holy spring temple. Tanah Lot sunset. Transfer to Seminyak." },
        { day: 5, title: "Beach & Relaxation", description: "Seminyak beach day. Optional surf lesson or beach club." },
        { day: 6, title: "Free Day", description: "Explore Seminyak boutiques, cafes, and nightlife at your own pace." },
        { day: 7, title: "Departure", description: "Breakfast. Transfer to airport." },
      ],
      featured: true,
      images: [I.bali, I.bali2],
      coverImage: I.bali,
      category: "Beach",
      status: "published",
      faqs: DEFAULT_FAQS,
      mapEmbedUrl: MAPS.bali,
    },
    {
      title: "Ladakh Adventure Expedition — High Altitude",
      slug: "ladakh-adventure-expedition",
      location: "Leh · Nubra · Pangong Lake",
      destination: ladakh._id,
      price: 42999,
      duration: 9,
      description:
        "Cross Khardung La — one of the world's highest motorable passes — camp under stars in Nubra Valley, and witness the ever-changing hues of Pangong Lake. Designed for adventure seekers with acclimatization built in.",
      highlights: [
        "Khardung La Pass (18,380 ft)",
        "Pangong Lake Overnight Camp",
        "Nubra Valley Double-Hump Camels",
        "Thiksey & Hemis Monasteries",
        "Oxygen Support & First Aid",
        "Experienced Ladakhi Guide",
      ],
      includes: [
        "8 nights accommodation (hotels + camps)",
        "All meals during tour",
        "Innova/Xylo with experienced driver",
        "Inner line permits",
        "Monument entry fees",
        "Oxygen cylinder in vehicle",
      ],
      excludes: ["Flights to/from Leh", "Personal trekking gear", "Travel insurance", "Tips"],
      itinerary: [
        { day: 1, title: "Arrive Leh — Acclimatize", description: "Airport pickup. Complete rest day — critical for altitude adjustment. Light walk to Leh market in evening." },
        { day: 2, title: "Leh Monasteries", description: "Thiksey Monastery (mini Potala), Shey Palace, Shanti Stupa sunset." },
        { day: 3, title: "Leh to Nubra Valley", description: "Cross Khardung La. Descend to Diskit. Visit sand dunes. Double-hump camel ride." },
        { day: 4, title: "Nubra to Pangong", description: "Scenic drive via Shyok route. Arrive Pangong Lake. Overnight in lakeside camp." },
        { day: 5, title: "Pangong to Leh", description: "Sunrise at lake. Return to Leh via Chang La. Rest evening." },
        { day: 6, title: "Hemis & Local", description: "Hemis Monastery. Hall of Fame war museum. Leh Palace." },
        { day: 7, title: "Alchi & Likir", description: "Day trip to Alchi monastery — 11th century frescoes. Likir Monastery." },
        { day: 8, title: "Leisure Day", description: "Optional rafting on Zanskar, mountain biking, or shopping for Pashmina." },
        { day: 9, title: "Departure", description: "Early breakfast. Transfer to Kushok Bakula Rinpoche Airport." },
      ],
      featured: true,
      images: [I.ladakh, I.ladakh2],
      coverImage: I.ladakh,
      category: "Adventure",
      status: "published",
      faqs: DEFAULT_FAQS,
      mapEmbedUrl: MAPS.ladakh,
    },
    {
      title: "Goa Beach & Heritage Getaway",
      slug: "goa-beach-heritage-getaway",
      location: "North & South Goa",
      destination: goa._id,
      price: 24999,
      duration: 4,
      description:
        "Sun, sand, and Portuguese charm — this long-weekend escape covers Goa's best beaches, historic churches of Old Goa, spice plantations, and vibrant nightlife. Ideal for couples and friend groups.",
      highlights: [
        "Calangute & Baga Beach Time",
        "Old Goa UNESCO Churches",
        "Spice Plantation Tour with Lunch",
        "Sunset at Chapora Fort",
        "Beachside Resort Stay",
        "Optional Water Sports",
      ],
      includes: [
        "3 nights beach resort",
        "Daily breakfast",
        "Airport transfers",
        "North & South Goa sightseeing",
        "Spice plantation visit",
      ],
      excludes: ["Flights", "Lunch & dinner", "Water sports", "Nightlife entry fees"],
      itinerary: [
        { day: 1, title: "Arrive & North Goa", description: "Airport pickup. Check in. Afternoon at Calangute Beach. Evening at Baga shacks." },
        { day: 2, title: "Old Goa & Panjim", description: "Basilica of Bom Jesus, Se Cathedral. Latin Quarter walk in Fontainhas, Panjim." },
        { day: 3, title: "South Goa", description: "Colva & Palolem beaches. Spice plantation tour with traditional Goan lunch." },
        { day: 4, title: "Departure", description: "Morning at leisure. Checkout and airport transfer." },
      ],
      featured: false,
      images: [I.goa, I.goa2],
      coverImage: I.goa,
      category: "Beach",
      status: "published",
      faqs: DEFAULT_FAQS,
    },
    {
      title: "Swiss Alps & Scenic Rail Journey",
      slug: "swiss-alps-scenic-rail",
      location: "Zurich · Lucerne · Interlaken",
      destination: europe._id,
      price: 179999,
      duration: 8,
      description:
        "Glide through Switzerland on legendary scenic trains, ascend to snow-capped peaks, and stay in charming alpine towns. A dream journey for nature lovers and photography enthusiasts.",
      highlights: [
        "Glacier Express Scenic Rail",
        "Mount Titlis Rotair Cable Car",
        "Lake Lucerne Cruise",
        "Interlaken Adventure Activities",
        "Swiss Travel Pass Included",
        "4-Star Alpine Hotels",
      ],
      includes: [
        "Return flights to Zurich",
        "7 nights 4-star hotels",
        "Daily breakfast",
        "Swiss Travel Pass (8 days)",
        "Glacier Express reservation",
        "Mount Titlis excursion",
      ],
      excludes: ["Schengen visa", "Lunch & dinner", "Optional activities"],
      itinerary: [
        { day: 1, title: "Zurich Arrival", description: "Arrive Zurich. Old Town walking tour. Lake Zurich promenade." },
        { day: 2, title: "Zurich to Lucerne", description: "Short train to Lucerne. Chapel Bridge, Lion Monument, lake cruise." },
        { day: 3, title: "Mount Titlis", description: "Day trip to Mount Titlis — Rotair revolving cable car, Ice Flyer, glacier park." },
        { day: 4, title: "Glacier Express", description: "Board Glacier Express to Zermatt. Matterhorn views (weather permitting)." },
        { day: 5, title: "Zermatt to Interlaken", description: "Scenic train journey. Check into Interlaken hotel." },
        { day: 6, title: "Jungfrau Region", description: "Jungfraujoch excursion or Grindelwald First adventure." },
        { day: 7, title: "Interlaken Leisure", description: "Paragliding, lake cruise, or Harder Kulm funicular." },
        { day: 8, title: "Departure", description: "Train to Zurich Airport. Return flight." },
      ],
      featured: false,
      images: [I.switzerland, I.europe2],
      coverImage: I.switzerland,
      category: "Adventure",
      status: "published",
      faqs: DEFAULT_FAQS,
      mapEmbedUrl: MAPS.europe,
    },
  ]);

  console.log("Created 9 premium packages");

  await Gallery.insertMany([
    { title: "Maldives Overwater Villa", image: I.maldives, category: "Beach", featured: true, order: 1 },
    { title: "Swiss Alpine Peaks", image: I.switzerland, category: "Mountains", featured: true, order: 2 },
    { title: "Paris at Twilight", image: I.europe, category: "City", featured: true, order: 3 },
    { title: "Rajasthan Palace", image: I.rajasthan, category: "Heritage", featured: true, order: 4 },
    { title: "Pangong Lake, Ladakh", image: I.ladakh, category: "Adventure", featured: true, order: 5 },
    { title: "Dubai Skyline", image: I.dubai, category: "City", featured: true, order: 6 },
    { title: "Kerala Backwaters", image: I.kerala, category: "Nature", featured: true, order: 7 },
    { title: "Bali Rice Terraces", image: I.bali, category: "Culture", featured: true, order: 8 },
    { title: "African Safari", image: I.safari, category: "Wildlife", featured: false, order: 9 },
    { title: "Desert Sunset", image: I.desert, category: "Desert", featured: false, order: 10 },
    { title: "Luxury Cruise", image: I.cruise, category: "Cruise", featured: false, order: 11 },
    { title: "Ancient Temple", image: I.temple, category: "Heritage", featured: false, order: 12 },
  ]);

  console.log("Created 12 gallery items");
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required. Set it in .env.local.");
    process.exit(1);
  }

  await connectDB();
  console.log("Connected to MongoDB");

  await seedAdmin();
  await seedContent();

  console.log("\nSeed completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
