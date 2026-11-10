import type { Metadata } from "next";
import { BlogListing } from "@/components/blog/BlogListing";
import { getAllPosts, pageCount } from "@/lib/blog/posts";
import { listingMetadata } from "@/lib/blog/seo";

type Props = { params: Promise<{ pagina: string }> };

export const dynamicParams = false;

/** Page 1 is /blog itself; /blog/pagina/1 does not exist (no duplicate). */
export function generateStaticParams() {
  const pages = pageCount(getAllPosts().length);
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ pagina: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = Number((await params).pagina);
  return listingMetadata({ page, path: `/blog/pagina/${page}` });
}

export default async function BlogPaginatedPage({ params }: Props) {
  const page = Number((await params).pagina);
  return <BlogListing page={page} />;
}
