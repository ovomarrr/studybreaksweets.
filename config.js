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
      name: "nutella",
      description: "sold out in lbss n edison.",
      price: 3.00,
      availability: "Available",
      emoji: "🍪",
      featured: true
    },
    {
      id: "cookie",
      name: "fruity pebble cookie",
      description: "cookie with fruity pebbles.",
      price: 3.00,
      availability: "Available",
      emoji: "🤍",
      featured: true
    },
    {
      id: "brown-butter",
      name: "unavailable",
      description: "blank.",
      price: 3.50,
      availability: "Available",
      emoji: "🍫",
      featured: true
    },
    {
      id: "ctc",
      name: "Coming soon",
      description: "Warm cinnamon-sugar cookie with a crunchy cereal finish.",
      price: 3.00,
      availability: "Sample / editable",
      emoji: "✨",
      featured: true
    },
    {
      id: "red-velvet",
      name: "coming soon",
      description: "coming soon.",
      price: 3.25,
      availability: "Sample / editable",
      emoji: "❤️",
      featured: false
    }
  ]
};
