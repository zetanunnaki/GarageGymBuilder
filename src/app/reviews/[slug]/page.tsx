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
import { PinterestSave } from "@/components/pinterest-save";
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
  const canonicalPath = `/${CONTENT_TYPE}/${slug}/`;
  return {
    title: frontmatter.seoTitle || frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: frontmatter.seoTitle || frontmatter.title,
      description: frontmatter.description,
      type: "article",
      url: canonicalPath,
      siteName: "GarageGymBuilders",
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.date,
      authors: [frontmatter.author],
      tags: frontmatter.category ? [frontmatter.category] : [],
      images: frontmatter.featuredImage
        ? [{ url: frontmatter.featuredImage, width: 1200, height: 630, alt: frontmatter.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.seoTitle || frontmatter.title,
      description: frontmatter.description,
      site: "@garagegymbuilders",
      creator: "@garagegymbuilders",
      images: frontmatter.featuredImage ? [frontmatter.featuredImage] : [],
    },
  };
}

function extractProductIdFromSlug(slug: string): string | null {
  const mapping: Record<string, string> = {
    "fitness-reality-810xlt-review": "fitness-reality-810xlt",
    "bowflex-selecttech-552-review": "bowflex-selecttech-552",
    "cap-barbell-300-review": "cap-barbell-olympic",
    "flybird-adjustable-bench-review": "flybird-adjustable-bench",
    "concept2-rowerg-review": "concept2-rowerg",
    "powerblock-elite-90-review": "powerblock-elite-90",
    "assault-airbike-review": "assault-airbike-classic",
    "mikolo-f4-power-cage-review": "mikolo-f4-power-cage",
    "sportsroyals-power-cage-review": "sportsroyals-power-cage",
    "synergee-olympic-barbell-review": "synergee-olympic-barbell",
    "marcy-olympic-bench-review": "marcy-olympic-bench",
    "yes4all-kettlebell-set-review": "yes4all-kettlebell-set",
    "yes4all-olympic-plates-review": "yes4all-olympic-plates",
    "titan-deadlift-jack-review": "titan-deadlift-jack",
    "yes4all-hex-trap-bar-review": "yes4all-hex-trap-bar",
    "yes4all-plyo-box-review": "yes4all-plyo-box",
    "wod-nation-jump-rope-review": "wod-nation-jump-rope",
    "bodylastics-resistance-bands-review": "bodylastics-resistance-bands",
    "iron-bull-dip-belt-review": "iron-bull-dip-belt",
    "sunny-sf-rw5515-rower-review": "sunny-sf-rw5515-rower",
    "iron-gym-pull-up-bar-review": "iron-gym-pull-up-bar",
    "cap-hex-dumbbells-review": "cap-hex-dumbbells",
    "dark-iron-lifting-belt-review": "dark-iron-lifting-belt",
    "trx-go-suspension-trainer-review": "trx-go-suspension-trainer",
    "yes4all-slam-ball-review": "yes4all-slam-ball",
    "yes4all-roman-chair-review": "yes4all-roman-chair",
    "rogue-style-gymnastic-rings-review": "rogue-style-gymnastic-rings",
    "rogue-style-weight-vest-review": "rogue-style-weight-vest",
    "yes4all-sandbag-review": "yes4all-sandbag",
    "perfect-fitness-ab-wheel-review": "perfect-fitness-ab-wheel",
    "nordic-lifting-knee-sleeves-review": "nordic-lifting-knee-sleeves",
    "harbinger-lifting-straps-review": "harbinger-lifting-straps",
    "rip-toned-wrist-wraps-review": "rip-toned-wrist-wraps",
    "luxfit-foam-roller-review": "luxfit-foam-roller",
    "power-guidance-battle-rope-review": "power-guidance-battle-rope",
    "yes4all-parallettes-review": "yes4all-parallettes",
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

  // Resolve product first so Review schema can reference it
  const productId = extractProductIdFromSlug(slug);
  const product = productId ? getProduct(productId) : null;

  const reviewSchema = generateReviewSchema(
    frontmatter,
    slug,
    product
      ? {
          name: product.name,
          brand: product.brand,
          image: product.image,
        }
      : undefined
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Reviews", url: "/reviews" },
    { name: frontmatter.title, url: `/reviews/${slug}` },
  ]);

  const productSchema =
    product && productId
      ? generateProductSchema(
          product.name,
          product.brand,
          product.price,
          frontmatter.rating,
          slug,
          frontmatter.featuredImage
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
        <div className="group relative mb-8 aspect-[16/9] w-full overflow-hidden border-2 border-zinc-800">
          <PinterestSave
            imageUrl={frontmatter.featuredImage}
            description={frontmatter.title}
            pageUrl={`/${CONTENT_TYPE}/${slug}/`}
          />
          <img
            src={frontmatter.featuredImage}
            alt={frontmatter.title}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            width={1200}
            height={675}
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
