import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleSlugs } from "@/lib/mdx";
import { getProduct } from "@/lib/products";
import { MdxContent } from "@/components/mdx/mdx-content";
import {
  generateReviewSchema,
  generateBreadcrumbSchema,
  generateProductSchema,
} from "@/lib/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TableOfContents } from "@/components/table-of-contents";
import { StickyToc } from "@/components/sticky-toc";
import { RelatedArticles } from "@/components/related-articles";
import { ShareButtons } from "@/components/share-buttons";
import { AuthorBio } from "@/components/author-bio";
import { StarRating } from "@/components/star-rating";
import { LastUpdatedBadge } from "@/components/last-updated-badge";
import { CalendarDays, User, Clock } from "lucide-react";

const CONTENT_TYPE = "reviews";

export function generateStaticParams() {
  return getArticleSlugs(CONTENT_TYPE).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter } = getArticleBySlug(CONTENT_TYPE, slug);
  return {
    title: frontmatter.seoTitle || frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      title: frontmatter.seoTitle || frontmatter.title,
      description: frontmatter.description,
      type: "article",
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
      images: frontmatter.featuredImage
        ? [{ url: frontmatter.featuredImage, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.seoTitle || frontmatter.title,
      description: frontmatter.description,
      images: frontmatter.featuredImage ? [frontmatter.featuredImage] : [],
    },
  };
}

function extractProductIdFromSlug(slug: string): string | null {
  const mapping: Record<string, string> = {
    "fitness-reality-810xlt-review": "fitness-reality-810xlt",
    "rep-fitness-pr4000-review": "rep-pr-4000",
    "bowflex-selecttech-552-review": "bowflex-selecttech-552",
    "titan-t3-power-rack-review": "titan-t3",
    "rogue-echo-bike-review": "rogue-echo-bike",
    "flybird-adjustable-bench-review": "flybird-adjustable-bench",
    "cap-barbell-300-review": "cap-barbell-olympic",
    "rogue-monster-lite-r3-review": "rogue-monster-lite-r3",
  };
  return mapping[slug] || null;
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let article;
  try {
    article = getArticleBySlug(CONTENT_TYPE, slug);
  } catch {
    notFound();
  }

  const { frontmatter, content, readingTime } = article;
  const reviewSchema = generateReviewSchema(frontmatter, slug);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Reviews", url: "/reviews" },
    { name: frontmatter.title, url: `/reviews/${slug}` },
  ]);

  // Generate Product schema if we can map the review to a product
  const productId = extractProductIdFromSlug(slug);
  const product = productId ? getProduct(productId) : null;
  const productSchema =
    product && productId
      ? generateProductSchema(
          product.name,
          product.brand,
          product.price,
          frontmatter.rating,
          slug
        )
      : null;

  return (
    <article className="mx-auto max-w-4xl px-6 pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <Breadcrumbs
        items={[
          { label: "Reviews", href: "/reviews" },
          { label: frontmatter.title },
        ]}
      />
      {/* Cover Image */}
      {frontmatter.featuredImage && (
        <div className="mb-8 aspect-[16/9] w-full overflow-hidden border-2 border-zinc-800">
          <img
            src={frontmatter.featuredImage}
            alt={frontmatter.title}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
      )}
      <header className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Review &middot; {frontmatter.category}
          </span>
          <LastUpdatedBadge date={frontmatter.date} />
        </div>
        <h1 className="mb-6 text-4xl font-black uppercase italic leading-none tracking-tighter md:text-5xl">
          {frontmatter.title}
        </h1>
        {frontmatter.rating && (
          <div className="mb-6">
            <StarRating rating={frontmatter.rating} />
          </div>
        )}
        <p className="mb-6 text-lg italic leading-relaxed text-zinc-500">
          {frontmatter.description}
        </p>
        <div className="flex items-center gap-4 border-t border-zinc-800 pt-4 text-[10px] uppercase tracking-widest text-zinc-600">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {frontmatter.author}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {new Date(frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readingTime} min read
          </span>
        </div>
      </header>
      <StickyToc />
      <TableOfContents />
      <MdxContent source={content} />
      <AuthorBio author={frontmatter.author} />
      <ShareButtons title={frontmatter.title} slug={slug} contentType={CONTENT_TYPE} />
      <RelatedArticles currentSlug={slug} contentType={CONTENT_TYPE} />
    </article>
  );
}
