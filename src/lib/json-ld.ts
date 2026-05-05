import { ArticleFrontmatter } from "./mdx";
import { SITE, absoluteUrl, parsePrice } from "./site-config";

const SITE_URL = SITE.url;

const publisher = {
  "@type": "Organization",
  name: SITE.name,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/icon-512.png"),
    width: 512,
    height: 512,
  },
} as const;

function articleImage(frontmatter: ArticleFrontmatter, fallback?: string) {
  const src = frontmatter.featuredImage || fallback;
  if (!src) return undefined;
  return {
    "@type": "ImageObject",
    url: absoluteUrl(src),
    width: 1200,
    height: 675,
    caption: frontmatter.title,
  };
}

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
  const authorSlug = options?.authorSlug || frontmatter.authorSlug;
  const authorObj = authorSlug
    ? {
        "@type": "Person",
        name: frontmatter.author || SITE.name,
        url: `${SITE_URL}/team/${authorSlug}/`,
      }
    : {
        "@type": "Organization",
        name: frontmatter.author || SITE.name,
        url: `${SITE_URL}/team/`,
      };

  const canonicalUrl = `${SITE_URL}/${contentType}/${slug}/`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    name: frontmatter.title,
    description: frontmatter.description,
    image: articleImage(frontmatter),
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated || frontmatter.date,
    author: authorObj,
    publisher,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    url: canonicalUrl,
    articleSection: frontmatter.category,
    keywords:
      frontmatter.keywords?.join(", ") ||
      frontmatter.tags?.join(", ") ||
      frontmatter.category,
    inLanguage: SITE.language,
    wordCount: options?.wordCount,
    timeRequired: options?.readingTimeMinutes
      ? `PT${options.readingTimeMinutes}M`
      : undefined,
    isAccessibleForFree: true,
    copyrightHolder: publisher,
    copyrightYear: new Date(frontmatter.date).getFullYear(),
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
      ? absoluteUrl(frontmatter.featuredImage)
      : undefined,
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated || frontmatter.date,
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE_URL,
    },
    publisher,
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
    url: absoluteUrl(url),
    inLanguage: SITE.language,
    publisher,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: absoluteUrl(item.url),
        name: item.name,
        description: item.description,
        image: item.image ? absoluteUrl(item.image) : undefined,
      })),
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
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
    price?: string;
    image?: string;
  },
  reviewBody?: string
) {
  const { price, priceRange } = parsePrice(product?.price);
  const canonicalUrl = `${SITE_URL}/reviews/${slug}/`;

  const itemReviewed = product
    ? {
        "@type": "Product",
        name: product.name,
        brand: {
          "@type": "Brand",
          name: product.brand,
        },
        image: absoluteUrl(
          product.image || frontmatter.featuredImage || ""
        ),
        offers: price
          ? {
              "@type": "Offer",
              priceCurrency: "USD",
              price,
              priceRange,
              availability: "https://schema.org/InStock",
              url: canonicalUrl,
              seller: { "@type": "Organization", name: SITE.name },
            }
          : undefined,
        aggregateRating: frontmatter.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: frontmatter.rating,
              bestRating: 5,
              worstRating: 1,
              reviewCount: 1,
              ratingCount: 1,
            }
          : undefined,
      }
    : {
        "@type": "Product",
        name: frontmatter.title.replace(/ Review.*$/i, "").trim(),
        image: frontmatter.featuredImage
          ? absoluteUrl(frontmatter.featuredImage)
          : undefined,
      };

  const authorSlug = frontmatter.authorSlug;
  const authorObj = authorSlug
    ? {
        "@type": "Person",
        name: frontmatter.author || SITE.name,
        url: `${SITE_URL}/team/${authorSlug}/`,
      }
    : {
        "@type": "Organization",
        name: frontmatter.author || SITE.name,
      };

  return {
    "@context": "https://schema.org",
    "@type": "Review",
    headline: frontmatter.title,
    name: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated || frontmatter.date,
    inLanguage: SITE.language,
    itemReviewed,
    author: authorObj,
    reviewBody: reviewBody || frontmatter.description,
    reviewRating: frontmatter.rating
      ? {
          "@type": "Rating",
          ratingValue: frontmatter.rating,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    publisher,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    url: canonicalUrl,
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
      url: absoluteUrl(item.url),
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
      item: absoluteUrl(item.url),
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
  const { price: numericPrice, priceRange } = parsePrice(price);
  const canonicalUrl = `${SITE_URL}/reviews/${slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    brand: {
      "@type": "Brand",
      name: productBrand,
    },
    image: productImage ? absoluteUrl(productImage) : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: numericPrice,
      priceRange,
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
      seller: { "@type": "Organization", name: SITE.name },
    },
    aggregateRating: reviewRating
      ? {
          "@type": "AggregateRating",
          ratingValue: reviewRating,
          bestRating: 5,
          worstRating: 1,
          reviewCount: 1,
          ratingCount: 1,
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
            name: SITE.name,
          },
        }
      : undefined,
    url: canonicalUrl,
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
      name: SITE.name,
      url: SITE_URL,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon-512.png"),
      width: 512,
      height: 512,
    },
    description: SITE.description,
    sameAs: Object.values(SITE.social).filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.email,
      availableLanguage: ["English"],
    },
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

export function generateSoftwareApplicationSchema(
  name: string,
  description: string,
  url: string,
  featureList: string[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: absoluteUrl(url),
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList,
    publisher,
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: SITE_URL,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { "@id": `${SITE_URL}#organization` },
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
