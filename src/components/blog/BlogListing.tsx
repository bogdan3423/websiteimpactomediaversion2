import { notFound } from "next/navigation";
import { CategoryNav } from "@/components/blog/CategoryNav";
import { Pagination } from "@/components/blog/Pagination";
import { FeaturedPost, PostGrid } from "@/components/blog/PostCard";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { blogInfo, type BlogCategory } from "@/content/blog";
import { site } from "@/content/site";
import { getAllPosts, pageCount, pageSlice, postsInCategory } from "@/lib/blog/posts";
import { listingSchema, listingText } from "@/lib/blog/seo";
import { graph, organizationSchema } from "@/lib/structured-data";

/** Shared view for /blog, /blog/pagina/N and the category pages. */
export function BlogListing({ page, category }: { page: number; category?: BlogCategory }) {
  const all = category ? postsInCategory(category.slug) : getAllPosts();
  const pages = pageCount(all.length);
  if (page < 1 || page > pages || (category && all.length === 0)) notFound();

  const base = category ? `/blog/categorie/${category.slug}` : "/blog";
  const path = page === 1 ? base : `${base}/pagina/${page}`;
  const posts = pageSlice(all, page);
  const featured = !category && page === 1 ? posts[0] : undefined;
  const rest = featured ? posts.slice(1) : posts;
  const text = listingText({ category, page });

  return (
    <>
      <JsonLd
        data={graph(
          ...listingSchema({ path, name: text.title, description: text.description, posts, category }),
          organizationSchema(),
        )}
      />

      <PageHero
        breadcrumb={category ? category.name : "Blog"}
        parents={category ? [{ label: "Blog", href: "/blog" }] : []}
        label={page > 1 ? `Blog · pagina ${page} din ${pages}` : `Blog · ${site.name}`}
        title={category ? category.name : blogInfo.heading}
        intro={category ? category.intro : blogInfo.intro}
      />

      <section className="shell pb-[var(--section)]" aria-label={category ? `Articole: ${category.name}` : "Articole"}>
        <CategoryNav current={category?.slug} />

        {all.length === 0 ? (
          <div className="mt-10 border border-line p-8 md:p-12">
            <p className="type-label text-signal">În curând</p>
            <p className="type-h3 mt-5 max-w-xl">Primele articole sunt în lucru. Revino în curând.</p>
          </div>
        ) : (
          <div className="mt-10 space-y-[clamp(2.5rem,1.5rem+3vw,4.5rem)]">
            {featured ? <FeaturedPost post={featured} /> : null}
            {rest.length ? <PostGrid posts={rest} heading="h2" /> : null}
          </div>
        )}

        <Pagination base={base} page={page} pages={pages} />
      </section>

      <ClosingCta
        kicker="Contact"
        title="Vrei să aplicăm asta pentru afacerea ta?"
        text="Spune-ne ce urmărești: mai multe solicitări, vânzări online sau conținut video constant."
      />
    </>
  );
}
