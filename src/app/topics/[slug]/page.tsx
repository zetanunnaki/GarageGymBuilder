import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { topics, getTopic } from "@/data/topics";
import { getArticlesForTopic } from "@/lib/topic-matching";
import { ArticleCard } from "@/components/article-card";
import { MdxContent } from "@/components/mdx/mdx-content";
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
} from "@/lib/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Target,
  Dumbbell,
  Shield,
  Heart,
  Users,
  Home,
  Calendar,
  Flame,
  Wrench,
  Compass,
  Trophy,
  Sparkles,
} from "lucide-react";

const iconMap = {
  target: Target,
  dumbbell: Dumbbell,
  shield: Shield,
  heart: Heart,
  users: Users,
  home: Home,
  calendar: Calendar,
  flame: Flame,
  wrench: Wrench,
  compass: Compass,
  trophy: Trophy,
  sparkles: Sparkles,
};

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "Topic Not Found" };
  return buildMetadata({
    title: `${topic.name} — Home Gym Hub`,
    description: topic.description,
    path: `/topics/${slug}/`,
    image: "/og-default.png",
    keywords: topic.keywords || [topic.name, "home gym", "garage gym"],
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const articles = getArticlesForTopic(topic);
  const Icon = iconMap[topic.icon];

  // Read long-form hub content if it exists
  const hubMdxPath = path.join(
    process.cwd(),
    "src/content/topics",
    `${slug}.mdx`
  );
  const hubContent = fs.existsSync(hubMdxPath)
    ? matter(fs.readFileSync(hubMdxPath, "utf8")).content
    : null;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Topics", url: "/topics/" },
    { name: topic.name, url: `/topics/${slug}/` },
  ]);

  const collectionSchema = generateCollectionPageSchema(
    `${topic.name} Topic`,
    topic.description,
    `/topics/${slug}/`,
    articles.map((a) => ({
      name: a.title,
      url: `/${a.contentType}/${a.slug}/`,
      description: a.description,
      image: a.featuredImage,
    }))
  );

  // Group by content type
  const grouped: Record<string, typeof articles> = {};
  for (const a of articles) {
    if (!grouped[a.contentType]) grouped[a.contentType] = [];
    grouped[a.contentType].push(a);
  }
  const contentTypeOrder = ["guides", "reviews", "best-gear", "builds"];
  const contentTypeLabels: Record<string, string> = {
    "best-gear": "Best Gear Roundups",
    reviews: "Product Reviews",
    guides: "Guides & How-Tos",
    builds: "Build Guides",
  };

  return (
    <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: "Topics", href: "/topics" },
          { label: topic.name },
        ]}
      />

      <header className="mb-12">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center border-2 border-orange-600/50 bg-zinc-900">
            <Icon className="text-orange-500" size={28} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
              Topic
            </div>
            <h1 className="text-5xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-6xl">
              {topic.name}
            </h1>
          </div>
        </div>
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
          {topic.description}
        </p>
        <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          {articles.length} article{articles.length === 1 ? "" : "s"} in this
          topic
        </div>
      </header>

      {/* Long-form hub content */}
      {hubContent && (
        <section className="mb-16">
          <MdxContent source={hubContent} />
        </section>
      )}

      {/* Article grid header */}
      {articles.length > 0 && hubContent && (
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
            All {topic.name} Articles
          </span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>
      )}

      {articles.length === 0 ? (
        <div className="border border-zinc-800 bg-zinc-900/40 p-12 text-center text-zinc-400">
          No articles yet in this topic.{" "}
          <Link href="/" className="text-orange-500 hover:underline">
            Back to home
          </Link>
        </div>
      ) : (
        contentTypeOrder.map((type) => {
          const items = grouped[type];
          if (!items || items.length === 0) return null;
          return (
            <section key={type} className="mb-12">
              <h2 className="mb-6 border-l-8 border-orange-600 pl-4 text-2xl font-black uppercase italic tracking-tighter">
                {contentTypeLabels[type]}
                <span className="ml-3 text-[10px] tracking-widest text-zinc-400">
                  ({items.length})
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((article) => (
                  <ArticleCard
                    key={`${article.contentType}/${article.slug}`}
                    article={article}
                    showType={false}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}

      {/* Related topics */}
      <section className="mt-16 border-t border-zinc-800 pt-12">
        <h2 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Other Topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {topics
            .filter((t) => t.slug !== slug)
            .slice(0, 10)
            .map((t) => (
              <Link
                key={t.slug}
                href={`/topics/${t.slug}/`}
                className="border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:border-orange-600/50 hover:text-orange-400"
              >
                {t.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
