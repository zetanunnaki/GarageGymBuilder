import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleSlugs } from "@/lib/mdx";
import { MdxContent } from "@/components/mdx/mdx-content";
import { generateBreadcrumbSchema } from "@/lib/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TableOfContents } from "@/components/table-of-contents";
import { RelatedArticles } from "@/components/related-articles";
import { ShareButtons } from "@/components/share-buttons";
import { AuthorBio } from "@/components/author-bio";
import { StickyToc } from "@/components/sticky-toc";
import { LastUpdatedBadge } from "@/components/last-updated-badge";
import { CalendarDays, User, Clock } from "lucide-react";

const CONTENT_TYPE = "builds";

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

export default async function BuildPage({
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
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Budget Builds", url: "/builds" },
    { name: frontmatter.title, url: `/builds/${slug}` },
  ]);

  return (
    <article className="mx-auto max-w-4xl px-6 pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: "Budget Builds", href: "/builds" },
          { label: frontmatter.title },
        ]}
      />
      {frontmatter.featuredImage && (
        <div className="mb-8 aspect-[16/9] w-full overflow-hidden border-2 border-zinc-800">
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
            Budget Build &middot; {frontmatter.category}
          </span>
          <LastUpdatedBadge date={frontmatter.date} />
        </div>
        <h1 className="mb-6 text-4xl font-black uppercase italic leading-none tracking-tighter md:text-5xl">
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
    </article>
  );
}
