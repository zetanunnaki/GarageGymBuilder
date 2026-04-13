import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleSlugs } from "@/lib/mdx";
import { MdxContent } from "@/components/mdx/mdx-content";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/lib/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TableOfContents } from "@/components/table-of-contents";
import { RelatedArticles } from "@/components/related-articles";
import { ShareButtons } from "@/components/share-buttons";
import { AuthorBio } from "@/components/author-bio";
import { StickyToc } from "@/components/sticky-toc";
import { LastUpdatedBadge } from "@/components/last-updated-badge";
import { PinterestSave } from "@/components/pinterest-save";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { CalendarDays, User, Clock } from "lucide-react";

const CONTENT_TYPE = "best-gear";

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
        : [{ url: "/og/best-gear.png", width: 1200, height: 630, alt: frontmatter.title, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.seoTitle || frontmatter.title,
      description: frontmatter.description,
      site: "@garagegymbuilders",
      creator: "@garagegymbuilders",
      images: frontmatter.featuredImage ? [frontmatter.featuredImage] : ["/og/best-gear.png"],
    },
  };
}

export default async function BestGearPage({
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
  const wordCount = content.split(/\s+/).length;
  const articleSchema = generateArticleSchema(frontmatter, slug, CONTENT_TYPE, {
    wordCount,
    readingTimeMinutes: readingTime,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Best Gear", url: "/best-gear" },
    { name: frontmatter.title, url: `/best-gear/${slug}` },
  ]);

  return (
    <article className="mx-auto max-w-4xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: "Best Gear", href: "/best-gear" },
          { label: frontmatter.title },
        ]}
      />
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
            {frontmatter.category}
          </span>
          <LastUpdatedBadge date={frontmatter.date} />
        </div>
        <h1 className="text-display-md mb-6 font-black uppercase italic tracking-tighter">
          {frontmatter.title}
        </h1>
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
      <MobileActionBar
        shareTitle={frontmatter.title}
        shareUrl={`/${CONTENT_TYPE}/${slug}/`}
      />
    </article>
  );
}
