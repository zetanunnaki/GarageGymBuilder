import type { Metadata } from "next";
import { SITE } from "./site-config";

export interface PageMetaInput {
  title: string;
  description: string;
  path: string; // canonical path, e.g. "/guides/"
  image?: string; // absolute path under public, e.g. "/og/guide.png"
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  section?: string;
  keywords?: string[];
  noIndex?: boolean;
}

// buildMetadata — single source of truth for page-level <head> metadata.
// Wires canonical, hreflang, OG, Twitter, robots, keywords consistently.
export function buildMetadata(input: PageMetaInput): Metadata {
  const image = input.image || SITE.defaultOgImage;
  const imageAlt = input.imageAlt || `${input.title} — ${SITE.name}`;
  const canonical = input.path.endsWith("/") ? input.path : `${input.path}/`;

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    authors: input.authors?.map((name) => ({ name })),
    alternates: {
      canonical,
      languages: { "en-US": canonical, "x-default": canonical },
      types: {
        "application/rss+xml": [
          { url: SITE.feed.rss, title: `${SITE.name} — RSS Feed` },
        ],
      },
    },
    openGraph: {
      type: input.type || "website",
      url: canonical,
      siteName: SITE.name,
      title: input.title,
      description: input.description,
      locale: SITE.locale,
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime || input.publishedTime,
      authors: input.authors,
      tags: input.tags,
      section: input.section,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: image.endsWith(".png") ? "image/png" : undefined,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      creator: SITE.twitter,
      title: input.title,
      description: input.description,
      images: [{ url: image, alt: imageAlt }],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
