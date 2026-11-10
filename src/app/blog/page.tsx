import type { Metadata } from "next";
import { BlogListing } from "@/components/blog/BlogListing";
import { listingMetadata } from "@/lib/blog/seo";

export const metadata: Metadata = listingMetadata({ page: 1, path: "/blog" });

export default function BlogPage() {
  return <BlogListing page={1} />;
}
