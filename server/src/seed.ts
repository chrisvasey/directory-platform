import { db, initDb } from "./db";

initDb();

// Clear existing data
db.exec("DELETE FROM listings; DELETE FROM categories;");

const categories = [
  { name: "Restaurants", slug: "restaurants", description: "Dining experiences from casual to fine dining", icon: "🍽️" },
  { name: "Shops", slug: "shops", description: "Retail stores, boutiques, and markets", icon: "🛍️" },
  { name: "Services", slug: "services", description: "Professional services for your everyday needs", icon: "🔧" },
  { name: "Entertainment", slug: "entertainment", description: "Fun activities and entertainment venues", icon: "🎭" },
  { name: "Health", slug: "health", description: "Health, wellness, and medical services", icon: "💊" },
];

const insertCategory = db.prepare(
  "INSERT INTO categories (name, slug, description, icon) VALUES ($name, $slug, $description, $icon)"
);

for (const cat of categories) {
  insertCategory.run({ $name: cat.name, $slug: cat.slug, $description: cat.description, $icon: cat.icon });
}

const getCatId = (slug: string): number => {
  const row = db.query("SELECT id FROM categories WHERE slug = $slug").get({ $slug: slug }) as { id: number };
  return row.id;
};

const listings = [
  // Restaurants
  {
    category_id: getCatId("restaurants"),
    name: "Trattoria Bella Napoli",
    slug: "trattoria-bella-napoli",
    location: "123 Main St, Downtown",
    description: "Authentic Neapolitan pizza and handmade pasta in a warm, family-owned setting. Wood-fired oven imported from Italy, using only the finest San Marzano tomatoes and buffalo mozzarella.",
    tags: JSON.stringify(["Italian", "Pizza", "Pasta", "Family-Friendly", "Dine-In"]),
    phone: "(555) 234-5678",
    email: "info@bellanapoli.com",
    website: "https://bellanapoli.com",
    image_url: null,
  },
  {
    category_id: getCatId("restaurants"),
    name: "El Rancho Taqueria",
    slug: "el-rancho-taqueria",
    location: "456 Oak Ave, Midtown",
    description: "Family recipes from Oaxaca served fresh daily. Famous for slow-cooked birria tacos, homemade salsas, and the best margaritas in town. Street-food atmosphere with full table service.",
    tags: JSON.stringify(["Mexican", "Tacos", "Margaritas", "Casual", "Takeout"]),
    phone: "(555) 345-6789",
    email: "hola@elrancho.com",
    website: "https://elrancho.com",
    image_url: null,
  },
  {
    category_id: getCatId("restaurants"),
    name: "Sakura Sushi & Ramen",
    slug: "sakura-sushi-ramen",
    location: "789 Cherry Blvd, Eastside",
    description: "Premium omakase sushi and tonkotsu ramen crafted by Chef Kenji Mori, trained in Tokyo for 15 years. Fresh fish flown in daily. Private dining rooms available for special occasions.",
    tags: JSON.stringify(["Japanese", "Sushi", "Ramen", "Omakase", "Fine Dining"]),
    phone: "(555) 456-7890",
    email: "reservations@sakurasushi.com",
    website: "https://sakurasushi.com",
    image_url: null,
  },
  {
    category_id: getCatId("restaurants"),
    name: "Smoke & Ember BBQ",
    slug: "smoke-ember-bbq",
    location: "321 Hickory Lane, Westend",
    description: "Pit-smoked Texas-style BBQ slow-cooked for 12-18 hours over applewood and hickory. Brisket, pulled pork, and ribs served with house-made sides. A local institution since 1987.",
    tags: JSON.stringify(["BBQ", "American", "Smoked Meats", "Comfort Food", "Family-Friendly"]),
    phone: "(555) 567-8901",
    email: "smokeandember@bbq.com",
    website: "https://smokeemberbbq.com",
    image_url: null,
  },

  // Shops
  {
    category_id: getCatId("shops"),
    name: "The Wandering Page Bookstore",
    slug: "wandering-page-bookstore",
    location: "88 Library Row, Old Quarter",
    description: "Independent bookstore with over 30,000 titles spanning every genre. Cozy reading nooks, a resident cat named Dewey, and weekly author readings. Specializing in rare and out-of-print books.",
    tags: JSON.stringify(["Books", "Independent", "Rare Books", "Events", "Pet-Friendly"]),
    phone: "(555) 678-9012",
    email: "hello@wanderingpage.com",
    website: "https://wanderingpage.com",
    image_url: null,
  },
  {
    category_id: getCatId("shops"),
    name: "Revival Vintage Collective",
    slug: "revival-vintage-collective",
    location: "55 Retro Road, Arts District",
    description: "Curated vintage clothing and accessories from the 1920s through the 1990s. Expert staff help you find your perfect look. New arrivals every Tuesday, monthly themed styling events.",
    tags: JSON.stringify(["Vintage", "Clothing", "Accessories", "Sustainable", "Fashion"]),
    phone: "(555) 789-0123",
    email: "shop@revivalvintage.com",
    website: "https://revivalvintage.com",
    image_url: null,
  },
  {
    category_id: getCatId("shops"),
    name: "Circuit & Spark Electronics",
    slug: "circuit-spark-electronics",
    location: "200 Tech Plaza, Innovation Hub",
    description: "Local electronics retailer with expert staff and repair services. Components for makers and hobbyists, consumer electronics, and same-day repair on most devices. Price-match guarantee.",
    tags: JSON.stringify(["Electronics", "Repair", "Maker", "Components", "Tech"]),
    phone: "(555) 890-1234",
    email: "help@circuitspark.com",
    website: "https://circuitspark.com",
    image_url: null,
  },
  {
    category_id: getCatId("shops"),
    name: "Greenfield Farmers Market",
    slug: "greenfield-farmers-market",
    location: "Greenfield Park, Central Square",
    description: "Open-air market every Saturday with 60+ local vendors selling organic produce, artisan cheeses, homemade preserves, fresh flowers, and handcrafted goods. Rain or shine, year-round.",
    tags: JSON.stringify(["Farmers Market", "Organic", "Local", "Weekend", "Artisan"]),
    phone: "(555) 901-2345",
    email: "market@greenfield.org",
    website: "https://greenfieldmarket.org",
    image_url: null,
  },

  // Services
  {
    category_id: getCatId("services"),
    name: "Reliable Plumbing Co.",
    slug: "reliable-plumbing-co",
    location: "Service Area: Metro-Wide",
    description: "Licensed and insured plumbing services for residential and commercial clients. 24/7 emergency response, free estimates, and a satisfaction guarantee on all work. Family-owned since 2001.",
    tags: JSON.stringify(["Plumbing", "Emergency", "Residential", "Commercial", "Licensed"]),
    phone: "(555) 012-3456",
    email: "dispatch@reliableplumbing.com",
    website: "https://reliableplumbing.com",
    image_url: null,
  },
  {
    category_id: getCatId("services"),
    name: "Studio Luxe Hair Salon",
    slug: "studio-luxe-hair-salon",
    location: "11 Style Street, Uptown",
    description: "Award-winning salon offering cuts, color, keratin treatments, and extensions. Team of 12 stylists trained in New York and Paris. Online booking available, walk-ins welcome on weekdays.",
    tags: JSON.stringify(["Hair Salon", "Color", "Extensions", "Beauty", "Award-Winning"]),
    phone: "(555) 123-4560",
    email: "book@studioluxe.com",
    website: "https://studioluxe.com",
    image_url: null,
  },
  {
    category_id: getCatId("services"),
    name: "Prestige Auto Repair",
    slug: "prestige-auto-repair",
    location: "500 Garage Way, Industrial District",
    description: "ASE-certified mechanics specializing in European and domestic vehicles. Diagnostics, routine maintenance, engine rebuilds, and collision repair. Loaner cars available. 2-year parts warranty.",
    tags: JSON.stringify(["Auto Repair", "ASE-Certified", "European Cars", "Diagnostics", "Warranty"]),
    phone: "(555) 234-5670",
    email: "service@prestigeauto.com",
    website: "https://prestigeauto.com",
    image_url: null,
  },
  {
    category_id: getCatId("services"),
    name: "Clarity Accounting Group",
    slug: "clarity-accounting-group",
    location: "1200 Finance Tower, Business District",
    description: "Full-service CPA firm offering tax preparation, bookkeeping, payroll, and business consulting. Serving individuals and small businesses. Free initial consultation, transparent flat-fee pricing.",
    tags: JSON.stringify(["Accounting", "CPA", "Tax", "Bookkeeping", "Small Business"]),
    phone: "(555) 345-6780",
    email: "info@clarityaccounting.com",
    website: "https://clarityaccounting.com",
    image_url: null,
  },

  // Entertainment
  {
    category_id: getCatId("entertainment"),
    name: "Starlight Cinema 8",
    slug: "starlight-cinema-8",
    location: "900 Marquee Drive, Riverside",
    description: "Eight-screen cinema with Dolby Atmos sound and 4K laser projection. Premium recliner seating, full food and bar service, and a monthly film club featuring classic and indie screenings.",
    tags: JSON.stringify(["Cinema", "Movies", "Dolby Atmos", "Recliners", "Bar Service"]),
    phone: "(555) 456-7891",
    email: "info@starlightcinema.com",
    website: "https://starlightcinema.com",
    image_url: null,
  },
  {
    category_id: getCatId("entertainment"),
    name: "Kingpin Bowling & Arcade",
    slug: "kingpin-bowling-arcade",
    location: "750 Strike Lane, Northside",
    description: "24-lane bowling alley with cosmic bowling on weekends, vintage arcade, laser tag, and a sports bar. Group packages and birthday parties a specialty. Shoe rental included with lane booking.",
    tags: JSON.stringify(["Bowling", "Arcade", "Laser Tag", "Bar", "Family Fun"]),
    phone: "(555) 567-8902",
    email: "fun@kingpinbowling.com",
    website: "https://kingpinbowling.com",
    image_url: null,
  },
  {
    category_id: getCatId("entertainment"),
    name: "Mind Heist Escape Rooms",
    slug: "mind-heist-escape-rooms",
    location: "33 Puzzle Street, Old Town",
    description: "Six immersive escape room experiences rated in the top 10 in the region. Themes range from Egyptian tombs to cyberpunk heists. Private bookings for 2-10 players, great for corporate team-building.",
    tags: JSON.stringify(["Escape Room", "Puzzle", "Team Building", "Corporate", "Immersive"]),
    phone: "(555) 678-9013",
    email: "book@mindheist.com",
    website: "https://mindheist.com",
    image_url: null,
  },
  {
    category_id: getCatId("entertainment"),
    name: "The Blue Note Lounge",
    slug: "blue-note-lounge",
    location: "42 Jazz Alley, Cultural Quarter",
    description: "Intimate live music venue showcasing local and touring jazz, blues, and soul acts nightly. Full cocktail bar, artisan charcuterie boards, and no cover charge on Sundays. Capacity 120.",
    tags: JSON.stringify(["Live Music", "Jazz", "Blues", "Cocktails", "Intimate Venue"]),
    phone: "(555) 789-0124",
    email: "bookings@bluenoteloungedemo.com",
    website: "https://bluenoteloungedemo.com",
    image_url: null,
  },

  // Health
  {
    category_id: getCatId("health"),
    name: "Sunrise Yoga & Wellness",
    slug: "sunrise-yoga-wellness",
    location: "8 Serenity Ave, Park District",
    description: "Holistic wellness studio offering yoga, pilates, meditation, and sound bath sessions. 15 certified instructors, beginner to advanced classes, and monthly wellness retreats. First class free.",
    tags: JSON.stringify(["Yoga", "Pilates", "Meditation", "Wellness", "Holistic"]),
    phone: "(555) 890-1235",
    email: "hello@sunriseyoga.com",
    website: "https://sunriseyoga.com",
    image_url: null,
  },
  {
    category_id: getCatId("health"),
    name: "Bright Smile Dental Clinic",
    slug: "bright-smile-dental",
    location: "600 Oral Health Blvd, Medical Row",
    description: "Comprehensive family dental care including cleanings, fillings, orthodontics, implants, and cosmetic procedures. Digital X-rays, same-day crowns, and gentle care for anxious patients.",
    tags: JSON.stringify(["Dental", "Family", "Orthodontics", "Cosmetic", "Implants"]),
    phone: "(555) 901-2346",
    email: "smile@brightsmile.com",
    website: "https://brightsmile.com",
    image_url: null,
  },
  {
    category_id: getCatId("health"),
    name: "MediQuick Pharmacy",
    slug: "mediquick-pharmacy",
    location: "150 Health Lane, Community Center",
    description: "Independent pharmacy with licensed pharmacists available for free medication counseling. Compounding services, vaccinations, blister packaging for seniors, and fast prescription transfers.",
    tags: JSON.stringify(["Pharmacy", "Compounding", "Vaccinations", "Independent", "Consultation"]),
    phone: "(555) 012-3457",
    email: "rx@mediquick.com",
    website: "https://mediquickrx.com",
    image_url: null,
  },
  {
    category_id: getCatId("health"),
    name: "Iron & Grace Fitness",
    slug: "iron-grace-fitness",
    location: "400 Power Street, Athletic District",
    description: "Full-service gym with 20,000 sq ft of equipment, group fitness classes, personal training, and a recovery zone with saunas, ice baths, and massage chairs. 24/7 access for members.",
    tags: JSON.stringify(["Gym", "Fitness", "Personal Training", "Group Classes", "24/7"]),
    phone: "(555) 123-4561",
    email: "join@ironandgrace.com",
    website: "https://ironandgrace.com",
    image_url: null,
  },
];

const insertListing = db.prepare(`
  INSERT INTO listings (category_id, name, slug, location, description, tags, phone, email, website, image_url)
  VALUES ($category_id, $name, $slug, $location, $description, $tags, $phone, $email, $website, $image_url)
`);

for (const listing of listings) {
  insertListing.run({
    $category_id: listing.category_id,
    $name: listing.name,
    $slug: listing.slug,
    $location: listing.location,
    $description: listing.description,
    $tags: listing.tags,
    $phone: listing.phone,
    $email: listing.email,
    $website: listing.website,
    $image_url: listing.image_url,
  });
}

const catCount = (db.query("SELECT COUNT(*) as n FROM categories").get() as any).n;
const listCount = (db.query("SELECT COUNT(*) as n FROM listings").get() as any).n;
console.log(`✅ Seeded ${catCount} categories and ${listCount} listings.`);
