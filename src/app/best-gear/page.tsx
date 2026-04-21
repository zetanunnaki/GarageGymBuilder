import { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";
import { ArticleCard } from "@/components/article-card";
import { generateCollectionPageSchema } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { Trophy, ArrowRight } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Best Gear Roundups",
  description:
    "Our tested picks for the best home gym equipment. Power racks, dumbbells, barbells, and more — ranked, compared, and updated.",
  path: "/best-gear/",
  image: "/og/best-gear.png",
  keywords: [
    "best home gym equipment",
    "best power rack",
    "best barbell",
    "best adjustable dumbbells",
    "home gym roundups",
  ],
});

export default function BestGearIndexPage() {
  const articles = getAllArticles("best-gear");
  const featured = articles[0];
  const rest = articles.slice(1);

  const collectionSchema = generateCollectionPageSchema(
    "Best Home Gym Gear",
    "Our tested picks for the best home gym equipment.",
    "/best-gear/",
    articles.map((a) => ({
      name: a.title,
      url: `/best-gear/${a.slug}/`,
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
            <Trophy className="skew-x-[12deg] text-black" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Roundups
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-black uppercase italic tracking-tighter md:text-6xl">
          Best Gear
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          Every product tested, ranked, and compared. No pay-to-play — only
          equipment we&apos;d put in our own gym.
        </p>
      </header>

      {/* Featured Article */}
      {featured && (
        <Link
          href={`/best-gear/${featured.slug}`}
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
              Featured &middot; {featured.category}
            </div>
            <h2 className="mb-4 text-3xl font-black uppercase italic tracking-tighter transition-colors group-hover:text-orange-500 md:text-4xl">
              {featured.title}
            </h2>
            <p className="mb-6 max-w-3xl text-zinc-400">{featured.description}</p>
            <span className="inline-flex items-center gap-2 text-sm font-black uppercase italic tracking-tighter text-orange-500">
              Read Article <ArrowRight size={16} />
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
        <p className="py-20 text-center text-zinc-400">
          No articles yet. Check back soon.
        </p>
      )}
    </div>
  );
}
