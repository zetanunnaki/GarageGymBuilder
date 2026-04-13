"use client";

import { Share2, LinkIcon, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
  contentType: string;
}

function withUtm(baseUrl: string, source: string): string {
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}utm_source=${source}&utm_medium=social&utm_campaign=share`;
}

export function ShareButtons({ title, slug, contentType }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = `https://garagegymbuilders.com/${contentType}/${slug}/`;

  const twitterUrl = withUtm(baseUrl, "twitter");
  const facebookUrl = withUtm(baseUrl, "facebook");
  const redditUrl = withUtm(baseUrl, "reddit");
  const linkedinUrl = withUtm(baseUrl, "linkedin");
  const pinterestUrl = withUtm(baseUrl, "pinterest");
  const whatsappUrl = withUtm(baseUrl, "whatsapp");
  const emailUrl = withUtm(baseUrl, "email");

  const encodedTitle = encodeURIComponent(title);
  // Use bare URL (no UTM) for clipboard copy so users can share cleanly
  const url = baseUrl;

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
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(twitterUrl)}&via=garagegymbuilders`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(facebookUrl)}`,
    },
    {
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(redditUrl)}&title=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedinUrl)}`,
    },
    {
      label: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pinterestUrl)}&description=${encodedTitle}`,
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
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${whatsappUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-orange-500"
      >
        <MessageCircle size={10} />
        WhatsApp
      </a>
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${title} - ${emailUrl}`)}`}
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
