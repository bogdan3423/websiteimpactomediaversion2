import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListing } from "@/components/blog/BlogListing";
import { activeCategories, getCategory, pageCount } from "@/lib/blog/posts";
import { listingMetadata } from "@/lib/blog/seo";

type Props = { params: Promise<{ categorie: string; pagina: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return activeCategories().flatMap(({ category, count }) =>
    Array.from({ length: Math.max(0, pageCount(count) - 1) }, (_, i) => ({ categorie: category.slug, pagina: String(i + 2) })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie, pagina } = await params;
  const category = getCategory(categorie);
  if (!category) return {};
  const page = Number(pagina);
  return listingMetadata({ category, page, path: `/blog/categorie/${category.slug}/pagina/${page}` });
}

export default async function BlogCategoryPaginatedPage({ params }: Props) {
  const { categorie, pagina } = await params;
  const category = getCategory(categorie);
  if (!category) notFound();
  return <BlogListing page={Number(pagina)} category={category} />;
}
