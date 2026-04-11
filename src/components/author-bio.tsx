import { Dumbbell } from "lucide-react";

interface AuthorBioProps {
  author: string;
}

export function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="mt-12 flex items-start gap-4 border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-orange-600/10">
        <Dumbbell className="text-orange-500" size={24} />
      </div>
      <div>
        <p className="text-sm font-black uppercase italic tracking-tighter">
          {author}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Our team tests every product hands-on before recommending it. We buy
          the equipment with our own money and train with it daily. No sponsored
          reviews, no pay-to-play rankings.
        </p>
      </div>
    </div>
  );
}
