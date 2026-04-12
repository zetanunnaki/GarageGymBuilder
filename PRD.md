# PRD: GarageGymBuilder (Static / No-DB Affiliate Architecture)

## 1. Project Overview

GarageGymBuilder is an SEO-optimized, highly performant affiliate marketing website in the home and garage gym niche. The site generates revenue through Amazon Associates and Walmart Associates.

**Strict Constraint:** This project must use ZERO databases (No PostgreSQL, No Supabase, No Firebase, no external headless CMS). All content and product data must be managed locally via static files (`.mdx` and `.json`) committed directly to the Git repository.

## 2. Technology Stack

Initialize the project using these specific tools:

- **Framework:** Next.js 14+ (App Router, strictly configured for Static Site Generation).
- **Styling:** Tailwind CSS.
- **UI Components:** Shadcn UI (for quick, accessible, lightweight components).
- **Content Parsing:** `next-mdx-remote` or Next.js native MDX integration.
- **Icons:** Lucide React.
- **Deployment:** Configured for Vercel (`output: 'export'` in `next.config.js` is optional depending on Vercel deployment style, but the architecture must be 100% static).

## 3. The "No DB" Data Architecture

Because gym equipment often has specific technical specs (weight capacity, footprint), and because managing affiliate links across 100+ articles is a nightmare, you must set up a central JSON "database" for products and an MDX folder structure for content.

### A. The Product Catalog (`src/data/products.json`)

Claude must create a central JSON file. When building UI components in MDX, we will just pass the product ID, and the component will pull the data and affiliate links from this file.

```json
{
  "fitness-reality-810xlt": {
    "name": "Fitness Reality 810XLT Super Max Power Cage",
    "brand": "Fitness Reality",
    "price": "$299.00",
    "image": "/images/products/fitness-reality-810xlt.jpg",
    "specs": {
      "weightCapacity": "800 lbs",
      "footprint": "50.5\" L x 46.5\" W",
      "material": "2x2\" Tubular Steel"
    },
    "amazonLink": "https://amazon.com/dp/YOUR_ID?tag=garagegym-20",
    "walmartLink": "https://walmart.com/ip/YOUR_ID?irgwc=1",
    "pros": ["Incredible value for the price", "Includes pull-up bar", "Standard 2x2 spacing for attachments"],
    "cons": ["Not suited for elite powerlifters lifting 800+ lbs"]
  }
}
```

### B. The Content Folders (`src/content/`)

Articles will be written in MDX (Markdown + React components). Set up these directories:

- `src/content/best-gear/` (e.g., `best-power-racks-under-500.mdx`)
- `src/content/reviews/` (e.g., `bowflex-selecttech-552-review.mdx`)
- `src/content/guides/` (e.g., `garage-gym-flooring-guide.mdx`)
- `src/content/builds/` (e.g., `home-gym-setup-under-1000.mdx`)

**MDX Frontmatter Schema:**

```yaml
---
title: "The 7 Best Power Racks Under $500 (2026 Testing)"
seoTitle: "Best Budget Power Racks & Squat Cages | GarageGymBuilder"
description: "We tested the top budget power racks. Here are the safest and most versatile cages for your home gym."
author: "Gym Builder Team"
date: "2026-04-10"
featuredImage: "/images/covers/budget-power-racks.jpg"
category: "Strength Equipment"
---
```

## 4. Core UI Components (To be built by Claude)

Build these custom React components to be used directly inside the `.mdx` files. They must read from `products.json`.

- **`<AffiliateDisclaimer />`**: A banner at the top of every article: "GarageGymBuilder is reader-supported. We may earn a commission through products purchased using links on this page."
- **`<DualBuyButton productId="fitness-reality-810xlt" />`**: Outputs two styled buttons: "Check Price on Amazon" (Orange/Yellow) and "Check Price on Walmart" (Blue). Must include `target="_blank"` and `rel="sponsored nofollow"`.
- **`<EquipmentCard productId="..." badge="Best Budget Rack" />`**: A high-converting product box. Pulls the image, pros/cons, specs (weight capacity/footprint), and buy buttons from `products.json`.
- **`<ComparisonTable productIds={["id-1", "id-2", "id-3"]} />`**: A responsive, scrollable table for "Best of" posts. Should compare Price, Weight Capacity, Footprint, and include the Buy buttons.
- **`<ProsCons list={["Pro 1", "Pro 2"]} type="pros" />`**: Simple styled lists with green checkmarks or red X icons.

## 5. Site Architecture & Routing

Set up the Next.js App Router structure:

- `/` (Home): Hero section ("Build Your Dream Gym"), Budget Build pathways ($500, $1k, $2k), category grid (Racks, Weights, Cardio), recent articles.
- `/best-gear/[slug]` (Roundups): Renders files from `src/content/best-gear/`.
- `/reviews/[slug]` (Reviews): Renders files from `src/content/reviews/`.
- `/guides/[slug]` (Guides): Renders files from `src/content/guides/`.
- `/builds/[slug]` (Budget Setups): Renders files from `src/content/builds/`.
- `/about` & `/privacy-policy` & `/affiliate-disclosure`: Static pages (Mandatory for FTC/Amazon compliance).

## 6. SEO & Performance Requirements

Implement the following technical SEO features:

- **JSON-LD Schema Markup:** Auto-generate Article schema for guides, Review schema for single product reviews (with star ratings), and ItemList schema for roundup pages.
- **Next/Image:** All images must use `<Image>` for WebP optimization and CLS (Cumulative Layout Shift) prevention.
- **Dynamic Sitemap:** Auto-generate a `sitemap.xml` by reading the local MDX files during the build step.
- **Table of Contents:** Auto-generate a sticky ToC for long articles based on H2/H3 tags to improve user time-on-page.

## 7. Execution Plan for Claude Code

Please execute this project in the following phases. Do not move to the next phase until the current one is complete and reviewed.

- **Phase 1: Foundation.** Initialize Next.js 14+ with Tailwind and Shadcn UI. Set up the exact folder structure (`src/data`, `src/content`). Create the `products.json` file with 2 dummy gym products.
- **Phase 2: Content Pipeline.** Set up the MDX parsing utility to read frontmatter and content from the `.mdx` files. Create dynamic routes (`app/best-gear/[slug]/page.tsx`, etc.).
- **Phase 3: Affiliate Components.** Build the `<EquipmentCard>`, `<DualBuyButton>`, and `<ComparisonTable>` components. Ensure they successfully pull data from `products.json`.
- **Phase 4: Layout & UI.** Build the global Navbar, Footer, and the Homepage layout. Ensure the `<AffiliateDisclaimer>` is globally available.
- **Phase 5: SEO & Polish.** Implement the JSON-LD schemas, sitemap generation, and ensure `rel="sponsored nofollow"` is on all outbound affiliate links.
