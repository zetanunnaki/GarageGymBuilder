import { ArticleFrontmatter } from "./mdx";

const SITE_URL = "https://garagegymbuilders.com";

export function generateArticleSchema(
  frontmatter: ArticleFrontmatter,
  slug: string,
  contentType: string,
  options?: {
    wordCount?: number;
    readingTimeMinutes?: number;
    authorSlug?: string;
  }
) {
  const authorObj = options?.authorSlug
    ? {
        "@type": "Person",
        name: frontmatter.author || "GarageGymBuilders",
        url: `${SITE_URL}/team/${options.authorSlug}/`,
      }
    : {
        "@type": "Organization",
        name: frontmatter.author || "GarageGymBuilders",
        url: `${SITE_URL}/team/`,
      };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    name: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.featuredImage
      ? {
          "@type": "ImageObject",
          url: `${SITE_URL}${frontmatter.featuredImage}`,
          width: 1200,
          height: 675,
        }
      : undefined,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: authorObj,
    publisher: {
      "@type": "Organization",
      name: "GarageGymBuilders",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${contentType}/${slug}/`,
    },
    articleSection: frontmatter.category,
    inLanguage: "en-US",
    wordCount: options?.wordCount,
    timeRequired: options?.readingTimeMinutes
      ? `PT${options.readingTimeMinutes}M`
      : undefined,
    isAccessibleForFree: true,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-description"],
    },
  };
}

export function generateHowToSchema(
  frontmatter: ArticleFrontmatter,
  slug: string,
  steps: { name: string; text: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.featuredImage
      ? `${SITE_URL}${frontmatter.featuredImage}`
      : undefined,
    datePublished: frontmatter.date,
    author: {
      "@type": "Organization",
      name: "GarageGymBuilders",
      url: SITE_URL,
    },
    step: steps.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: step.name,
      text: step.text,
      url: `${SITE_URL}/guides/${slug}/#step-${idx + 1}`,
    })),
  };
}

export function generateCollectionPageSchema(
  name: string,
  description: string,
  url: string,
  items: { name: string; url: string; description?: string; image?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${url}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_URL}${item.url}`,
        name: item.name,
        description: item.description,
        image: item.image ? `${SITE_URL}${item.image}` : undefined,
      })),
    },
    isPartOf: {
      "@type": "WebSite",
      name: "GarageGymBuilders",
      url: SITE_URL,
    },
  };
}

export function generateReviewSchema(
  frontmatter: ArticleFrontmatter & { rating?: number },
  slug: string,
  product?: {
    name: string;
    brand: string;
    image?: string;
  }
) {
  const itemReviewed = product
    ? {
        "@type": "Product",
        name: product.name,
        brand: {
          "@type": "Brand",
          name: product.brand,
        },
        image: product.image
          ? `${SITE_URL}${product.image}`
          : frontmatter.featuredImage
          ? `${SITE_URL}${frontmatter.featuredImage}`
          : undefined,
      }
    : {
        "@type": "Product",
        name: frontmatter.title.replace(/ Review.*$/i, "").trim(),
        image: frontmatter.featuredImage
          ? `${SITE_URL}${frontmatter.featuredImage}`
          : undefined,
      };

  return {
    "@context": "https://schema.org",
    "@type": "Review",
    headline: frontmatter.title,
    name: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    itemReviewed,
    author: {
      "@type": "Organization",
      name: frontmatter.author || "GarageGymBuilders",
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
      name: "GarageGymBuilders",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/reviews/${slug}/`,
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
  slug: string,
  productImage?: string
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
    image: productImage ? `${SITE_URL}${productImage}` : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: numericPrice,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/reviews/${slug}/`,
    },
    aggregateRating: reviewRating
      ? {
          "@type": "AggregateRating",
          ratingValue: reviewRating,
          bestRating: 5,
          worstRating: 1,
          reviewCount: 1,
        }
      : undefined,
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
            name: "GarageGymBuilders",
          },
        }
      : undefined,
    url: `${SITE_URL}/reviews/${slug}/`,
  };
}

export function generatePersonSchema(author: {
  slug: string;
  name: string;
  role: string;
  shortBio: string;
  credentials: string[];
  expertise: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.shortBio,
    url: `${SITE_URL}/team/${author.slug}/`,
    knowsAbout: author.expertise,
    hasCredential: author.credentials.map((cred) => ({
      "@type": "EducationalOccupationalCredential",
      name: cred,
    })),
    worksFor: {
      "@type": "Organization",
      name: "GarageGymBuilders",
      url: SITE_URL,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GarageGymBuilders",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "Expert reviews, budget builds, and guides to help you build the perfect garage gym.",
    sameAs: [
      "https://twitter.com/garagegymbuilders",
      "https://www.facebook.com/garagegymbuilders",
      "https://www.pinterest.com/garagegymbuilders",
    ],
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
    name: "GarageGymBuilders",
    alternateName: "Garage Gym Builders",
    url: SITE_URL,
    description:
      "Expert reviews, budget builds, and guides to help you build the perfect garage gym.",
    publisher: {
      "@type": "Organization",
      name: "GarageGymBuilders",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
