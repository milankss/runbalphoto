/*
 * RunBalPhoto: site content
 * ----------------------------------------------------------------------------
 * This is the only file you need to edit to change the text and photos.
 *
 * Photos live in  images/<project-slug>/  (for example images/coastline/01.jpg).
 * In each project, `images` lists the files in the order they should appear.
 * The first image is the project's cover on the home page and the work page.
 *
 * Everything below marked PLACEHOLDER is sample content: replace it.
 */
window.SITE = {
  // Shown under the logo on the home and work pages. PLACEHOLDER
  tagline: "Photography. Portraits, people & places.",

  // Info page. PLACEHOLDER
  bio: [
    "RunBalPhoto is a photographer telling stories through portraits, events and everyday moments. Replace this paragraph with a short introduction.",
    "Available for commissions, collaborations and bookings.",
  ],
  portrait: "images/info/portrait.jpg",
  motto: "Every frame tells a story.", // small line in the info page corner. PLACEHOLDER

  contact: [
    // PLACEHOLDER: check the handle and email before publishing.
    { label: "Instagram", href: "https://www.instagram.com/runbalphoto/" },
    { label: "hello@runbalphoto.com", href: "mailto:hello@runbalphoto.com" },
  ],

  // Filters on the work page, in this order. Each project's `category` should match one of these.
  categories: ["Portraits", "Weddings", "Events", "Street", "Editorial", "Landscape"],

  // Projects, in the order they appear on the work page.
  // featured: true puts the project in the thumbnail strip on the home page.
  // PLACEHOLDER: all ten projects below are samples.
  projects: [
    {
      slug: "studio-portraits",
      title: "Studio Portraits",
      category: "Portraits",
      year: 2026,
      featured: true,
      description: "A short description of the shoot: who, where, and what it was about.",
      images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"],
    },
    {
      slug: "night-walk",
      title: "Night Walk",
      category: "Street",
      year: 2026,
      featured: true,
      description: "",
      images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"],
    },
    {
      slug: "summer-wedding",
      title: "Summer Wedding",
      category: "Weddings",
      year: 2025,
      featured: true,
      description: "",
      images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg"],
    },
    {
      slug: "editorial-session",
      title: "Editorial Session",
      category: "Editorial",
      year: 2025,
      featured: true,
      description: "",
      images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
    },
    {
      slug: "live-at-the-venue",
      title: "Live at the Venue",
      category: "Events",
      year: 2025,
      featured: true,
      description: "",
      images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
    },
    {
      slug: "coastline",
      title: "Coastline",
      category: "Landscape",
      year: 2025,
      featured: true,
      description: "",
      images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
    },
    {
      slug: "golden-hour",
      title: "Golden Hour",
      category: "Portraits",
      year: 2024,
      featured: true,
      description: "",
      images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
    },
    {
      slug: "city-in-motion",
      title: "City in Motion",
      category: "Street",
      year: 2024,
      featured: true,
      description: "",
      images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
    },
    {
      slug: "engagement-session",
      title: "Engagement Session",
      category: "Weddings",
      year: 2024,
      featured: true,
      description: "",
      images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
    },
    {
      slug: "black-and-white",
      title: "Black & White",
      category: "Editorial",
      year: 2024,
      featured: true,
      description: "",
      images: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
    },
  ],
};
