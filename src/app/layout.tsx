import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { ScrollProgress } from "@/components/scroll-progress";
import { CookieConsent } from "@/components/cookie-consent";

const GA_ID = "G-FEZWDYPY41";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { SITE } from "@/lib/site-config";

const SITE_NAME = SITE.name;
const SITE_URL = SITE.url;
const SITE_DESCRIPTION = SITE.description;
const DEFAULT_OG_IMAGE = `${SITE_URL}${SITE.defaultOgImage}`;
const DEFAULT_OG_IMAGE_ALT = `${SITE_NAME} — ${SITE.tagline}. Expert reviews, real testing, no fluff.`;

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — ${SITE.tagline}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  generator: "Next.js",
  category: "Sports & Fitness",
  keywords: [
    "home gym",
    "garage gym",
    "power rack",
    "barbell",
    "adjustable dumbbells",
    "home gym equipment",
    "best home gym",
    "garage gym ideas",
    "home gym reviews",
    "build a home gym",
    "budget home gym",
    "home gym on a budget",
    "garage gym setup",
    "olympic barbell",
    "home gym flooring",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: { "en-US": "/", "x-default": "/" },
    types: {
      "application/rss+xml": [
        { url: SITE.feed.rss, title: `${SITE_NAME} — RSS Feed` },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE.tagline}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE.tagline}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: DEFAULT_OG_IMAGE_ALT,
        width: 1200,
        height: 630,
      },
    ],
    creator: SITE.twitter,
    site: SITE.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": "#ea580c",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ea580c" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_NAME} — RSS Feed`}
          href="/feed.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title={`${SITE_NAME} — Atom Feed`}
          href="/atom.xml"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title={SITE_NAME}
          href="/opensearch.xml"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-zinc-100">
        {/* Google Consent Mode v2 defaults — denied until user consents.
            Must execute BEFORE the gtag script loads. */}
        <Script id="consent-defaults" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { anonymize_ip: true });
          `}
        </Script>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[100] focus:bg-orange-600 focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-bold"
        >
          Skip to content
        </a>
        <Navbar />
        <ScrollProgress />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
        <CookieConsent />
      </body>
    </html>
  );
}
