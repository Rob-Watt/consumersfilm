import "./globals.css";
import { site, absoluteUrl } from "../lib/site";

const description = site.description || `${site.title} — ${site.tagline}`;
const shareImage = {
  url: absoluteUrl(site.shareImage.path),
  width: site.shareImage.width,
  height: site.shareImage.height,
  alt: `${site.title} — ${site.tagline}`,
};

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.title} | Official Film Site`,
    template: `%s | ${site.title}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "video.movie",
    url: "/",
    siteName: site.title,
    title: site.title,
    description,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description,
    images: [shareImage.url],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang={site.language}>
      <body>{children}</body>
    </html>
  );
}
