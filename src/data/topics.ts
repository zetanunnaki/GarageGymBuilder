export interface Topic {
  slug: string;
  name: string;
  description: string;
  keywords: string[]; // case-insensitive substrings matched against slug + category
  icon: "target" | "dumbbell" | "shield" | "heart" | "users" | "home" | "calendar" | "flame" | "wrench" | "compass" | "trophy" | "sparkles";
  featured?: boolean;
}

export const topics: Topic[] = [
  {
    slug: "powerlifting",
    name: "Powerlifting",
    description:
      "Squat, bench, deadlift. Heavy barbell training for max strength.",
    keywords: [
      "powerlifting", "powerlifter", "squat", "deadlift", "bench", "belt",
      "knee-sleeve", "knee-sleeves", "wrist-wrap", "wrist-wraps",
      "trap-bar", "rack", "olympic-barbell", "synergee", "fitness-reality",
    ],
    icon: "shield",
    featured: true,
  },
  {
    slug: "bodybuilding",
    name: "Bodybuilding",
    description:
      "Hypertrophy training, isolation work, and variety for muscle growth.",
    keywords: [
      "bodybuilder", "bodybuilding", "dumbbell", "bowflex", "powerblock",
      "cable", "hex-dumbbells", "dip-belt", "ab-wheel", "roman-chair",
      "hyperextension", "sportsroyals",
    ],
    icon: "dumbbell",
    featured: true,
  },
  {
    slug: "crossfit",
    name: "CrossFit",
    description:
      "Constantly varied, high-intensity functional training.",
    keywords: [
      "crossfit", "kettlebell", "plyo-box", "slam-ball", "jump-rope",
      "wod-nation", "rings", "gymnastic", "parallettes", "battle-rope",
      "wod",
    ],
    icon: "flame",
    featured: true,
  },
  {
    slug: "mma-combat",
    name: "MMA & Combat Sports",
    description:
      "Home gym setups for fighters, boxers, and combat athletes.",
    keywords: [
      "mma", "boxing", "combat", "heavy-bag", "fighter", "sandbag",
      "weight-vest",
    ],
    icon: "flame",
  },
  {
    slug: "beginners",
    name: "Beginners",
    description:
      "Starting out? Everything a first-time home gym owner needs.",
    keywords: [
      "beginner", "beginners", "ultimate-beginners", "starter", "first",
      "how-to-build-a-garage", "how-to-choose",
    ],
    icon: "target",
    featured: true,
  },
  {
    slug: "budget-builds",
    name: "Budget Builds",
    description:
      "Complete home gyms at every price tier from $300 to $5,000.",
    keywords: [
      "home-gym-under", "apartment", "dream-gym", "budget", "powerlifter-home-gym",
      "bodybuilder-home-gym", "crossfit-home-gym", "mma-fighter-home-gym",
    ],
    icon: "home",
    featured: true,
  },
  {
    slug: "small-spaces",
    name: "Small Spaces",
    description:
      "Apartment and compact home gym setups under 100 sq ft.",
    keywords: [
      "small-space", "small-spaces", "apartment", "travel", "compact",
      "foldable",
    ],
    icon: "home",
  },
  {
    slug: "cardio",
    name: "Cardio & Conditioning",
    description:
      "Rowers, bikes, jump ropes, and conditioning tools.",
    keywords: [
      "rower", "rowing", "cardio", "air-bike", "airbike", "assault",
      "concept2", "jump-rope", "battle-rope", "crossrope", "how-to-choose-cardio",
    ],
    icon: "heart",
  },
  {
    slug: "recovery",
    name: "Recovery & Mobility",
    description:
      "Foam rolling, rehab, back pain, and recovery tools.",
    keywords: [
      "recovery", "rehab", "back-pain", "foam-roller", "mobility",
      "postpartum",
    ],
    icon: "sparkles",
  },
  {
    slug: "women",
    name: "Women's Training",
    description:
      "Home gym content specifically for women, including postpartum and pregnancy-safe training.",
    keywords: [
      "women", "postpartum", "female",
    ],
    icon: "users",
  },
  {
    slug: "seniors",
    name: "Seniors & Over 40",
    description:
      "Safe, effective training for older lifters and people over 40.",
    keywords: [
      "senior", "seniors", "over-40",
    ],
    icon: "users",
  },
  {
    slug: "safety",
    name: "Safety & Setup",
    description:
      "Flooring, anchoring, lighting, ventilation, and keeping your gym safe.",
    keywords: [
      "safety", "anchor", "lighting", "ventilation", "electrical", "flooring",
      "platform", "mistakes", "insurance", "soundproofing", "cooling",
      "winter", "summer",
    ],
    icon: "wrench",
  },
  {
    slug: "buying-guides",
    name: "Buying Guides",
    description:
      "How to choose the right equipment before you spend a dollar.",
    keywords: [
      "how-to-choose", "buying", "used",
    ],
    icon: "compass",
  },
  {
    slug: "comparisons",
    name: "Head-to-Head",
    description:
      "Direct product comparisons. X vs Y — which should you buy?",
    keywords: [
      "vs-", "-vs-",
    ],
    icon: "trophy",
  },
  {
    slug: "maintenance",
    name: "Maintenance",
    description:
      "Keep your gym running for decades with proper cleaning and upkeep.",
    keywords: [
      "maintenance", "clean", "barbell-maintenance", "organizing",
    ],
    icon: "wrench",
  },
  {
    slug: "programming",
    name: "Programming & Workouts",
    description:
      "Training programs, routines, and how to structure your lifting.",
    keywords: [
      "programming", "workout", "routine", "barbell-only-exercises",
      "nutrition", "setup",
    ],
    icon: "calendar",
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getAllTopics(): Topic[] {
  return topics;
}
