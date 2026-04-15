export const SITE = {
  name: "GarageGymBuilders",
  alternateName: "Garage Gym Builders",
  url: "https://garagegymbuilders.com",
  tagline: "Build Your Iron Paradise",
  description:
    "Expert reviews, budget builds, and guides to help you build the perfect garage gym. Compare power racks, weights, and cardio equipment.",
  locale: "en_US",
  language: "en-US",
  twitter: "@garagegymbuilders",
  email: "hello@garagegymbuilders.com",
  defaultOgImage: "/og-default.png",
  // Per-section OG fallbacks — used when an article has no featuredImage
  sectionOgImage: {
    "best-gear": "/og/best-gear.png",
    reviews: "/og/review.png",
    guides: "/og/guide.png",
    builds: "/og/build.png",
  } as Record<string, string>,
  social: {
    twitter: "https://twitter.com/garagegymbuilders",
    facebook: "https://www.facebook.com/garagegymbuilders",
    pinterest: "https://www.pinterest.com/garagegymbuilders",
    youtube: "",
    instagram: "",
  },
  feed: {
    rss: "/feed.xml",
    atom: "/atom.xml",
  },
} as const;

export function absoluteUrl(path: string): string {
  if (!path) return SITE.url;
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Parse messy human-entered prices like "$499.99", "From $199", "$89 - $129"
// into a { price: string, priceRange?: string } shape schema.org accepts.
export function parsePrice(raw?: string): {
  price?: string;
  priceRange?: string;
} {
  if (!raw) return {};
  const trimmed = raw.trim();
  const range = trimmed.match(/(\$?\d[\d,.]*)\s*[-–—]\s*(\$?\d[\d,.]*)/);
  if (range) {
    const lo = range[1].replace(/[^\d.]/g, "");
    const hi = range[2].replace(/[^\d.]/g, "");
    return { price: lo, priceRange: `$${lo}-$${hi}` };
  }
  const single = trimmed.match(/(\$?\d[\d,.]*)/);
  if (single) return { price: single[1].replace(/[^\d.]/g, "") };
  return {};
}
