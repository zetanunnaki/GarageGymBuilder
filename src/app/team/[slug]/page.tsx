import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { authors, getAuthor } from "@/data/authors";
import { generatePersonSchema, generateBreadcrumbSchema } from "@/lib/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Dumbbell, Award, Target, Calendar } from "lucide-react";

export function generateStaticParams() {
  return Object.keys(authors).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) {
    return { title: "Author Not Found" };
  }
  return {
    title: `${author.name} - ${author.role}`,
    description: author.shortBio,
    alternates: { canonical: `/team/${slug}/` },
    openGraph: {
      title: `${author.name} - ${author.role}`,
      description: author.shortBio,
      type: "profile",
      url: `/team/${slug}/`,
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const personSchema = generatePersonSchema(author);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Team", url: "/team" },
    { name: author.name, url: `/team/${slug}` },
  ]);

  return (
    <article className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: "Team", href: "/team" },
          { label: author.name },
        ]}
      />

      {/* Header */}
      <header className="mb-12">
        <div className="mb-6 flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center border-2 border-orange-600/50 bg-zinc-900">
            <Dumbbell className="text-orange-500" size={56} />
          </div>
          <div>
            <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-orange-500">
              {author.role}
            </div>
            <h1 className="mb-3 text-5xl font-black uppercase italic leading-none tracking-tighter">
              {author.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600 md:justify-start">
              <span className="flex items-center gap-1">
                <Calendar size={10} /> {author.yearsExperience}+ years
              </span>
              <span>&middot;</span>
              <span>GarageGymBuilders</span>
            </div>
          </div>
        </div>
      </header>

      {/* Bio */}
      <section className="mb-12">
        <h2 className="mb-6 border-l-8 border-orange-600 pl-4 text-2xl font-black uppercase italic tracking-tighter">
          About
        </h2>
        <div className="space-y-4 text-zinc-400 leading-relaxed">
          {author.longBio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Credentials */}
      <section className="mb-12">
        <h2 className="mb-6 border-l-8 border-orange-600 pl-4 text-2xl font-black uppercase italic tracking-tighter">
          <Award className="mr-2 inline" size={20} />
          Credentials
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {author.credentials.map((cred, i) => (
            <li
              key={i}
              className="border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-300"
            >
              {cred}
            </li>
          ))}
        </ul>
      </section>

      {/* Expertise */}
      <section className="mb-12">
        <h2 className="mb-6 border-l-8 border-orange-600 pl-4 text-2xl font-black uppercase italic tracking-tighter">
          <Target className="mr-2 inline" size={20} />
          Expertise
        </h2>
        <ul className="flex flex-wrap gap-2">
          {author.expertise.map((skill, i) => (
            <li
              key={i}
              className="border border-orange-600/30 bg-orange-600/5 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-orange-400"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {/* Back to team */}
      <div className="border-t border-zinc-800 pt-8">
        <Link
          href="/team/"
          className="text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-orange-500"
        >
          &larr; Back to Team
        </Link>
      </div>
    </article>
  );
}
