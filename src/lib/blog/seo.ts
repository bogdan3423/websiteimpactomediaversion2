import type { Metadata } from "next";
import { blogInfo, type BlogCategory } from "@/content/blog";
import { site } from "@/content/site";
import type { Post } from "@/lib/blog/posts";
import { defaultShareImage, pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site-url";
import { breadcrumbSchema, organizationId, websiteId } from "@/lib/structured-data";

export const blogId = `${absoluteUrl("/blog")}#blog`;
export const rssPath = "/blog/rss.xml";

const withFeed = (metadata: Metadata): Metadata => ({
  ...metadata,
  alternates: {
    ...metadata.alternates,
    types: { "application/rss+xml": [{ url: absoluteUrl(rssPath), title: `Blog ${site.name}` }] },
  },
});

/** Title and description of a listing page: /blog, /blog/pagina/N, /blog/categorie/X and their pages. */
export function listingText({ category, page }: { category?: BlogCategory; page: number }) {
  const suffix = page > 1 ? `, pagina ${page}` : "";
  const title = category
    ? `${category.name}: articole și ghiduri${suffix} | ${site.name}`
    : page > 1
      ? `Blog de marketing${suffix} | ${site.name}`
      : blogInfo.title;
  const base = category ? category.description : blogInfo.description;
  return { title, description: page > 1 ? `Pagina ${page}. ${base}` : base };
}

export function listingMetadata({ category, page, path }: { category?: BlogCategory; page: number; path: string }): Metadata {
  return withFeed(pageMetadata({ ...listingText({ category, page }), path }));
}

/** "Title | ImpactoMedia" when it fits in Google's ~60-65 characters, otherwise the title alone. */
export const articleTitle = (post: Post) => {
  const full = `${post.seoTitle} | ${site.name}`;
  return full.length <= 65 ? full : post.seoTitle;
};

export function articleMetadata(post: Post): Metadata {
  const title = articleTitle(post);
  const image = post.cover
    ? { url: post.cover.src, width: post.cover.width, height: post.cover.height, alt: post.cover.alt }
    : defaultShareImage;
  const base = pageMetadata({ title, description: post.description, path: post.path, image });
  return withFeed({
    ...base,
    authors: [{ name: post.author.name, url: absoluteUrl("/despre-noi") }],
    keywords: post.tags.length ? post.tags : undefined,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.publishedIso,
      modifiedTime: post.updatedIso ?? post.publishedIso,
      authors: [absoluteUrl("/despre-noi")],
      section: post.category.name,
      tags: post.tags,
    },
  });
}

/** Blog + CollectionPage + breadcrumbs + the list of articles shown on the page. */
export function listingSchema({
  path,
  name,
  description,
  posts,
  category,
}: {
  path: string;
  name: string;
  description: string;
  posts: Post[];
  category?: BlogCategory;
}) {
  const crumbs = [{ name: "Blog", path: "/blog" }, ...(category ? [{ name: category.name, path: `/blog/categorie/${category.slug}` }] : [])];
  return [
    {
      "@type": "Blog",
      "@id": blogId,
      url: absoluteUrl("/blog"),
      name: `Blog ${site.name}`,
      description: blogInfo.description,
      inLanguage: "ro-RO",
      publisher: { "@id": organizationId },
      isPartOf: { "@id": websiteId },
    },
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(path)}#webpage`,
      url: absoluteUrl(path),
      name,
      description,
      inLanguage: "ro-RO",
      isPartOf: { "@id": websiteId },
      about: category ? category.name : undefined,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: posts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(post.path),
          name: post.title,
        })),
      },
    },
    breadcrumbSchema(crumbs),
  ];
}

export function articleSchema(post: Post) {
  const url = absoluteUrl(post.path);
  const image = post.cover ? absoluteUrl(post.cover.src) : absoluteUrl(defaultShareImage.url);
  return [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      headline: post.title,
      description: post.description,
      image: [image],
      datePublished: post.publishedIso,
      dateModified: post.updatedIso ?? post.publishedIso,
      author: {
        "@type": "Person",
        name: post.author.name,
        jobTitle: post.author.role,
        url: absoluteUrl("/despre-noi"),
        worksFor: { "@id": organizationId },
      },
      publisher: { "@id": organizationId },
      isPartOf: { "@id": blogId },
      articleSection: post.category.name,
      keywords: post.tags.length ? post.tags.join(", ") : undefined,
      wordCount: post.words,
      timeRequired: `PT${post.minutes}M`,
      inLanguage: "ro-RO",
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: articleTitle(post),
      description: post.description,
      inLanguage: "ro-RO",
      isPartOf: { "@id": websiteId },
      primaryImageOfPage: { "@type": "ImageObject", url: image },
      datePublished: post.publishedIso,
      dateModified: post.updatedIso ?? post.publishedIso,
    },
    breadcrumbSchema([
      { name: "Blog", path: "/blog" },
      { name: post.category.name, path: `/blog/categorie/${post.category.slug}` },
      { name: post.title, path: post.path },
    ]),
  ];
}
