// EDIT THIS FILE to update the weekly menu, schools, contact info, and payment settings.
// The site layout does not need to change when the weekly menu changes.
const SITE_CONFIG = {
  businessName: "Baked by Piper",
  tagline: "Fresh-baked cookies, made for your school day.",
  instagram: "cookies.by.piper",
  email: "cookies.by.piper3@gmail.com",

  // Add Piper's real Cash App link here before publishing.
  // Example format: https://cash.app/$YourCashtag
  cashAppUrl: "https://cash.app/$PiperBork",

  // Paste the deployed Google Apps Script Web App URL here.
  // The included GOOGLE_SHEETS_SETUP.md walks you through the one-time setup.
  googleSheetsEndpoint: "",

  orderingNote: "Orders are sent to the Cookies by Piper order sheet and then you can complete payment through Cash App.",
  schools: [
    "Woodbridge High School",
    "Lake Braddock Secondary School (LBSS)",
    "Edison High School"
  ],

  // WEEKLY MENU: change this list each week. The order page and menu update automatically.
  products: [
    {
      id: "choc-chip",
      name: "Chocolate Chip",
      description: "Classic soft-baked cookie packed with melty chocolate chips.",
      price: 3.00,
      availability: "Available",
      emoji: "🍪",
      featured: true
    },
    {
      id: "cookies-cream",
      name: "Cookies & Cream",
      description: "A soft vanilla cookie loaded with crushed chocolate sandwich cookies.",
      price: 3.00,
      availability: "Available",
      emoji: "🤍",
      featured: true
    },
    {
      id: "brown-butter",
      name: "Brown Butter Chocolate Chip",
      description: "Rich, nutty brown butter dough with plenty of chocolate chips.",
      price: 3.50,
      availability: "Available",
      emoji: "🍫",
      featured: true
    },
    {
      id: "ctc",
      name: "Cinnamon Toast Crunch",
      description: "Warm cinnamon-sugar cookie with a crunchy cereal finish.",
      price: 3.00,
      availability: "Sample / editable",
      emoji: "✨",
      featured: true
    },
    {
      id: "red-velvet",
      name: "Red Velvet",
      description: "Soft red velvet cookie with a rich chocolate flavor.",
      price: 3.25,
      availability: "Sample / editable",
      emoji: "❤️",
      featured: false
    }
  ]
};
