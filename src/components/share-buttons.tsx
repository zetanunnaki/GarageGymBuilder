"use client";

import { Share2, LinkIcon, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
  contentType: string;
}

export function ShareButtons({ title, slug, contentType }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://garagegymbuilders.com/${contentType}/${slug}/`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedTitleAndUrl = encodeURIComponent(`${title} - ${url}`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
    }
  };

  const links = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=garagegymbuilders`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    },
  ];

  return (
    <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-zinc-800 pt-6">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
        <Share2 size={12} className="mr-1 inline" />
        Share
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-orange-500"
        >
          {link.label}
        </a>
      ))}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitleAndUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-orange-500"
      >
        <MessageCircle size={10} />
        WhatsApp
      </a>
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedTitleAndUrl}`}
        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-orange-500"
      >
        <Mail size={10} />
        Email
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-orange-500"
      >
        <LinkIcon size={10} />
        {copied ? "Copied!" : "Link"}
      </button>
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-orange-500 md:hidden"
      >
        <Share2 size={10} />
        More
      </button>
    </div>
  );
}
