import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListing } from "@/components/blog/BlogListing";
import { activeCategories, getCategory } from "@/lib/blog/posts";
import { listingMetadata } from "@/lib/blog/seo";

type Props = { params: Promise<{ categorie: string }> };

export const dynamicParams = false;

/** Only categories with at least one article get a page (no empty, thin pages). */
export function generateStaticParams() {
  return activeCategories().map(({ category }) => ({ categorie: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).categorie);
  if (!category) return {};
  return listingMetadata({ category, page: 1, path: `/blog/categorie/${category.slug}` });
}

export default async function BlogCategoryPage({ params }: Props) {
  const category = getCategory((await params).categorie);
  if (!category) notFound();
  return <BlogListing page={1} category={category} />;
}
