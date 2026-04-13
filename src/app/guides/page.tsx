import { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";
import { ArticleCard } from "@/components/article-card";
import { generateCollectionPageSchema } from "@/lib/json-ld";
import { BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Complete guides to building your home gym. Flooring, lighting, ventilation, and everything else.",
  alternates: { canonical: "/guides/" },
};

export default function GuidesIndexPage() {
  const articles = getAllArticles("guides");
  const featured = articles[0];
  const rest = articles.slice(1);

  const collectionSchema = generateCollectionPageSchema(
    "Home Gym Guides",
    "Complete guides to building your home gym.",
    "/guides/",
    articles.map((a) => ({
      name: a.title,
      url: `/guides/${a.slug}/`,
      description: a.description,
      image: a.featuredImage,
    }))
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <header className="mb-16">
        <div className="mb-4 flex items-center gap-3">
          <div className="skew-x-[-12deg] bg-orange-600 p-2">
            <BookOpen className="skew-x-[12deg] text-black" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Learn
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-black uppercase italic tracking-tighter md:text-6xl">
          Guides
        </h1>
        <p className="max-w-2xl text-lg text-zinc-500">
          Everything you need to know about building and optimizing your garage
          gym — from flooring to programming.
        </p>
      </header>

      {/* Featured Guide */}
      {featured && (
        <Link
          href={`/guides/${featured.slug}`}
          className="group mb-8 block overflow-hidden border-2 border-zinc-800 bg-zinc-900/60 transition-colors hover:border-orange-600/50"
        >
          {featured.featuredImage && (
            <div className="aspect-[21/9] w-full overflow-hidden border-b border-zinc-800">
              <img
                src={featured.featuredImage}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-8 md:p-12">
            <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-orange-500">
              Featured Guide &middot; {featured.category}
            </div>
            <h2 className="mb-4 text-3xl font-black uppercase italic tracking-tighter transition-colors group-hover:text-orange-500 md:text-4xl">
              {featured.title}
            </h2>
            <p className="mb-6 max-w-3xl text-zinc-500">{featured.description}</p>
            <span className="inline-flex items-center gap-2 text-sm font-black uppercase italic tracking-tighter text-orange-500">
              Read Guide <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="py-20 text-center text-zinc-600">
          No guides yet. Check back soon.
        </p>
      )}
    </div>
  );
}
