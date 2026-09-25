import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/lib/site";
import "./globals.css";

// All type is self-hosted so builds never depend on a font CDN.
const cabinet = localFont({
  src: [
    { path: "../fonts/cabinet-800.woff2", weight: "800" },
    { path: "../fonts/cabinet-900.woff2", weight: "900" },
  ],
  variable: "--font-cabinet",
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "../fonts/satoshi-400.woff2", weight: "400" },
    { path: "../fonts/satoshi-500.woff2", weight: "500" },
    { path: "../fonts/satoshi-700.woff2", weight: "700" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const plexMono = localFont({
  src: [
    { path: "../fonts/plex-mono-400.woff2", weight: "400" },
    { path: "../fonts/plex-mono-500.woff2", weight: "500" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

const anekTamil = localFont({
  src: "../fonts/anek-tamil-tamil.woff2",
  weight: "100 800",
  variable: "--font-anek-tamil",
  display: "swap",
  preload: false,
});

const description =
  "JustCliks plans, shoots and posts for restaurants, caterers, creators and founders. Content creation, social media, branding, influencer marketing and video production.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "JustCliks | Content, social media and video production",
    template: "%s | JustCliks",
  },
  description,
  openGraph: {
    title: "JustCliks",
    description,
    siteName: "JustCliks",
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: "JustCliks", description },
};

export const viewport: Viewport = {
  themeColor: [
    { color: "#f5f3ee" },
  ],
};

// Skip the intro for anyone who already saw it this session.
const introScript = `try{if(sessionStorage.getItem('jc-intro'))document.documentElement.dataset.introSeen='1'}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cabinet.variable} ${satoshi.variable} ${plexMono.variable} ${anekTamil.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-dvh" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
