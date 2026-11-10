import type { Metadata } from "next";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** Social image path in /public. Defaults to the brand share image. */
  image?: { url: string; width: number; height: number; alt: string };
  noindex?: boolean;
};

export const defaultShareImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "ImpactoMedia, agenție de marketing din Cluj-Napoca",
};

/** Builds consistent per-page metadata: canonical, Open Graph and X cards. */
export function pageMetadata({ title, description, path, image = defaultShareImage, noindex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ro_RO",
      siteName: site.name,
      url,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
