export const DONATION_TIERS = [
  { amount: 25, label: "$25", blurb: "≈ 75 meals" },
  { amount: 50, label: "$50", blurb: "≈ 150 meals", featured: true },
  { amount: 100, label: "$100", blurb: "≈ 300 meals" },
  { amount: 250, label: "$250", blurb: "≈ 750 meals" },
] as const;

export const MIN_DONATION = 5;
export const MAX_DONATION = 25000;

export const SITE = {
  name: "Full Plate YYC",
  tagline: "Turning every $1 into 3× its value in food for Calgary.",
  instagram: "https://instagram.com/fullplateyyc",
  instagramHandle: "@fullplateyyc",
  email: "hello@runsable.com",
  city: "Calgary, Alberta",
} as const;
