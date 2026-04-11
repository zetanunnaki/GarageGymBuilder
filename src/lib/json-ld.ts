import { ArticleFrontmatter } from "./mdx";

const SITE_URL = "https://garagegymbuilder.com";

export function generateArticleSchema(
  frontmatter: ArticleFrontmatter,
  slug: string,
  contentType: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.featuredImage
      ? `${SITE_URL}${frontmatter.featuredImage}`
      : undefined,
    datePublished: frontmatter.date,
    author: {
      "@type": "Organization",
      name: frontmatter.author || "GarageGymBuilder",
    },
    publisher: {
      "@type": "Organization",
      name: "GarageGymBuilder",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${contentType}/${slug}`,
    },
  };
}

export function generateReviewSchema(
  frontmatter: ArticleFrontmatter & { rating?: number },
  slug: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    author: {
      "@type": "Organization",
      name: frontmatter.author || "GarageGymBuilder",
    },
    reviewRating: frontmatter.rating
      ? {
          "@type": "Rating",
          ratingValue: frontmatter.rating,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "GarageGymBuilder",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/reviews/${slug}`,
    },
  };
}

export function generateItemListSchema(
  items: { name: string; url: string; position: number }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateProductSchema(
  productName: string,
  productBrand: string,
  price: string,
  reviewRating: number | undefined,
  slug: string
) {
  const numericPrice = price.replace(/[^0-9.]/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    brand: {
      "@type": "Brand",
      name: productBrand,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: numericPrice,
      availability: "https://schema.org/InStock",
    },
    review: reviewRating
      ? {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: reviewRating,
            bestRating: 5,
          },
          author: {
            "@type": "Organization",
            name: "GarageGymBuilder",
          },
        }
      : undefined,
    url: `${SITE_URL}/reviews/${slug}`,
  };
}

export function generateFaqSchema(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GarageGymBuilder",
    url: SITE_URL,
    description:
      "Expert reviews, budget builds, and guides to help you build the perfect garage gym.",
    publisher: {
      "@type": "Organization",
      name: "GarageGymBuilder",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
  };
}
