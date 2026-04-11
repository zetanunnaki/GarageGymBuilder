"use client";

import { Share2, LinkIcon } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
  contentType: string;
}

export function ShareButtons({ title, slug, contentType }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://garagegymbuilder.com/${contentType}/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="mt-12 flex items-center gap-4 border-t border-zinc-800 pt-6">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
        <Share2 size={12} className="mr-1 inline" />
        Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-orange-500"
      >
        Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-orange-500"
      >
        Facebook
      </a>
      <a
        href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-orange-500"
      >
        Reddit
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-orange-500"
      >
        <LinkIcon size={10} />
        {copied ? "Copied!" : "Link"}
      </button>
    </div>
  );
}
