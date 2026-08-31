import type { Metadata } from "next";
import { site } from "@/config/site";

type BuildMetaInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  ogImage?: string;
};

export function buildMetadata({ title, description, path, noindex, ogImage }: BuildMetaInput): Metadata {
  const url = new URL(path, site.url).toString();
  const image = ogImage || `${site.url}${site.ogImagePath}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description,
      url,
      siteName: site.brand,
      type: "website",
      locale: "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: site.brand }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
