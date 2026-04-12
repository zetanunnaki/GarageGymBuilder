"use client";

interface PinterestSaveProps {
  imageUrl: string;
  description: string;
  pageUrl: string;
}

export function PinterestSave({
  imageUrl,
  description,
  pageUrl,
}: PinterestSaveProps) {
  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `https://garagegymbuilders.com${imageUrl}`;
  const fullPageUrl = pageUrl.startsWith("http")
    ? pageUrl
    : `https://garagegymbuilders.com${pageUrl}`;

  const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    fullPageUrl
  )}&media=${encodeURIComponent(fullImageUrl)}&description=${encodeURIComponent(
    description
  )}`;

  return (
    <a
      href={pinUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Save to Pinterest"
      className="absolute right-4 top-4 z-10 flex items-center gap-1.5 bg-[#E60023] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white opacity-0 shadow-lg transition-opacity duration-300 hover:bg-[#c5001e] group-hover:opacity-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="14"
        height="14"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12c0 5.1 3.2 9.4 7.6 11.2-.1-1-.2-2.4 0-3.4.2-.9 1.4-5.7 1.4-5.7s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4-.3 1.2.6 2.1 1.7 2.1 2.1 0 3.7-2.2 3.7-5.4 0-2.8-2-4.8-4.9-4.8-3.3 0-5.3 2.5-5.3 5.1 0 1 .4 2.1 .9 2.7.1.1.1.2.1.3 0 .3-.3 1.1-.3 1.3-.1.2-.2.3-.4.2-1.4-.7-2.3-2.7-2.3-4.4 0-3.6 2.6-6.9 7.5-6.9 3.9 0 7 2.8 7 6.5 0 3.9-2.5 7.1-5.9 7.1-1.2 0-2.2-.6-2.6-1.3 0 0-.6 2.2-.7 2.7-.3 1-1 2.3-1.5 3.1 1.1.4 2.3.5 3.6.5 6.6 0 12-5.4 12-12S18.6 0 12 0z" />
      </svg>
      Save
    </a>
  );
}
