import { Metadata } from "next";
import Link from "next/link";
import { topics } from "@/data/topics";
import { getTopicCounts } from "@/lib/topic-matching";
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
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "All Topics",
  description:
    "Browse all home gym topics — powerlifting, CrossFit, cardio, recovery, budget builds, safety, and more.",
  alternates: { canonical: "/topics/" },
};

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

export default function TopicsPage() {
  const counts = getTopicCounts();
  const sorted = [...topics].sort((a, b) => {
    // Featured first, then by count
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (counts[b.slug] || 0) - (counts[a.slug] || 0);
  });

  return (
    <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20">
      <header className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="skew-x-[-12deg] bg-orange-600 p-2">
            <Compass className="skew-x-[12deg] text-black" size={24} />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            Browse
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-7xl">
          All <br />
          <span className="bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800 bg-clip-text text-transparent">
            Topics
          </span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-500">
          {topics.length} topics covering every corner of home gym training.
          Each page pulls in every article, review, build, and comparison on
          that subject.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((topic) => {
          const Icon = iconMap[topic.icon];
          const count = counts[topic.slug] || 0;
          return (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}/`}
              className="group relative block overflow-hidden border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-orange-600/60 hover:shadow-[0_20px_40px_-15px_rgba(234,88,12,0.3)]"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-orange-700 scale-y-0 origin-top transition-transform duration-500 group-hover:scale-y-100" />
              {topic.featured && (
                <div className="absolute right-3 top-3 border border-orange-500/40 bg-orange-600/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-orange-400">
                  Featured
                </div>
              )}
              <div className="mb-4 flex h-12 w-12 items-center justify-center border border-zinc-800 bg-zinc-900 transition-all duration-500 group-hover:border-orange-600/50 group-hover:bg-orange-600/10">
                <Icon
                  className="text-orange-500 transition-transform duration-500 group-hover:scale-110"
                  size={22}
                />
              </div>
              <h2 className="mb-2 text-2xl font-black uppercase italic leading-none tracking-tighter text-zinc-100 transition-colors group-hover:text-orange-400">
                {topic.name}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-zinc-500">
                {topic.description}
              </p>
              <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4 text-[10px] font-black uppercase tracking-widest">
                <span className="text-zinc-600">
                  {count} article{count === 1 ? "" : "s"}
                </span>
                <span className="flex items-center gap-1 text-orange-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  Explore <ArrowRight size={10} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
