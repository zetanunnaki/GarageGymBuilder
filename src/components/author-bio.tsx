import Link from "next/link";
import { Dumbbell, ArrowRight } from "lucide-react";
import { authors } from "@/data/authors";

interface AuthorBioProps {
  author: string;
}

function findAuthorSlug(authorName: string): string | null {
  const normalized = authorName.trim().toLowerCase();
  for (const [slug, author] of Object.entries(authors)) {
    if (author.name.toLowerCase() === normalized) return slug;
  }
  return null;
}

export function AuthorBio({ author }: AuthorBioProps) {
  const slug = findAuthorSlug(author);
  const authorData = slug ? authors[slug] : null;

  if (authorData && slug) {
    return (
      <Link
        href={`/team/${slug}/`}
        className="group mt-12 flex items-start gap-4 border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-orange-600/50"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-orange-600/10 transition-colors group-hover:bg-orange-600/20">
          <Dumbbell className="text-orange-500" size={24} />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            {authorData.role}
          </div>
          <p className="text-sm font-black uppercase italic tracking-tighter transition-colors group-hover:text-orange-500">
            {authorData.name}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">
            {authorData.shortBio}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-500">
            Read full bio <ArrowRight size={10} />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="mt-12 flex items-start gap-4 border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-orange-600/10">
        <Dumbbell className="text-orange-500" size={24} />
      </div>
      <div>
        <p className="text-sm font-black uppercase italic tracking-tighter">
          {author}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
          Our team tests every product hands-on before recommending it. We buy
          the equipment with our own money and train with it daily. No sponsored
          reviews, no pay-to-play rankings.{" "}
          <Link
            href="/team/"
            className="text-orange-500 hover:underline"
          >
            Meet the team &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
