import { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";
import { ArticleCard } from "@/components/article-card";
import { generateCollectionPageSchema } from "@/lib/json-ld";
import { DollarSign, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Budget Builds",
  description:
    "Complete home gym builds at every budget. From $500 starter setups to $2,000+ dream gyms.",
  alternates: { canonical: "/builds/" },
};

export default function BuildsIndexPage() {
  const articles = getAllArticles("builds");

  const collectionSchema = generateCollectionPageSchema(
    "Home Gym Builds",
    "Complete home gym builds at every budget.",
    "/builds/",
    articles.map((a) => ({
      name: a.title,
      url: `/builds/${a.slug}/`,
      description: a.description,
      image: a.featuredImage,
    }))
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <header className="mb-16">
        <div className="mb-4 flex items-center gap-3">
          <div className="skew-x-[-12deg] bg-orange-600 p-2">
            <DollarSign className="skew-x-[12deg] text-black" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Budget
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-black uppercase italic tracking-tighter md:text-6xl">
          Budget Builds
        </h1>
        <p className="max-w-2xl text-lg text-zinc-500">
          Tested, complete home gym builds at every price point. Every dollar
          accounted for.
        </p>
      </header>

      {/* Budget Quick Links */}
      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        {articles.map((article) => {
          const budgetMatch = article.title.match(/\$[\d,]+/);
          const budget = budgetMatch ? budgetMatch[0] : "";
          return (
            <Link
              key={article.slug}
              href={`/builds/${article.slug}`}
              className="group flex items-center justify-between border-2 border-zinc-800 bg-zinc-900/60 p-6 transition-colors hover:border-orange-600"
            >
              <div>
                <p className="text-3xl font-black italic text-orange-500">
                  {budget || "Build"}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {article.description.slice(0, 60)}...
                </p>
              </div>
              <ArrowRight
                className="text-zinc-700 transition-all group-hover:translate-x-1 group-hover:text-orange-500"
                size={24}
              />
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="py-20 text-center text-zinc-600">
          No builds yet. Check back soon.
        </p>
      )}
    </div>
  );
}
