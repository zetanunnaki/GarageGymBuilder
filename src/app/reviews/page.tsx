import { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";
import { ArticleCard } from "@/components/article-card";
import { generateCollectionPageSchema } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { Search, ArrowRight, Star } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Equipment Reviews",
  description:
    "In-depth, hands-on reviews of home gym equipment. Real testing, real opinions — no sponsored fluff.",
  path: "/reviews/",
  image: "/og/review.png",
  keywords: [
    "home gym reviews",
    "power rack review",
    "barbell review",
    "adjustable dumbbells review",
    "home gym equipment review",
  ],
});

export default function ReviewsIndexPage() {
  const articles = getAllArticles("reviews");
  const featured = articles[0];
  const rest = articles.slice(1);

  const collectionSchema = generateCollectionPageSchema(
    "Equipment Reviews",
    "In-depth, hands-on reviews of home gym equipment.",
    "/reviews/",
    articles.map((a) => ({
      name: a.title,
      url: `/reviews/${a.slug}/`,
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
            <Search className="skew-x-[12deg] text-black" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            In-Depth
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-black uppercase italic tracking-tighter md:text-6xl">
          Reviews
        </h1>
        <p className="max-w-2xl text-lg text-zinc-500">
          Hands-on reviews from people who actually lift. We buy it, build it,
          and beat on it before writing a word.
        </p>
      </header>

      {/* Featured Review */}
      {featured && (
        <Link
          href={`/reviews/${featured.slug}`}
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
            <div className="mb-3 flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                Latest Review &middot; {featured.category}
              </span>
              {featured.rating && (
                <span className="flex items-center gap-1 text-sm font-black italic text-orange-500">
                  <Star size={14} className="fill-orange-500" />
                  {featured.rating}/5
                </span>
              )}
            </div>
            <h2 className="mb-4 text-3xl font-black uppercase italic tracking-tighter transition-colors group-hover:text-orange-500 md:text-4xl">
              {featured.title}
            </h2>
            <p className="mb-6 max-w-3xl text-zinc-500">{featured.description}</p>
            <span className="inline-flex items-center gap-2 text-sm font-black uppercase italic tracking-tighter text-orange-500">
              Read Review <ArrowRight size={16} />
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
          No reviews yet. Check back soon.
        </p>
      )}
    </div>
  );
}
