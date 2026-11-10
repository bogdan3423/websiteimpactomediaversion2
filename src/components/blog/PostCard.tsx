import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { formatShortDate } from "@/lib/blog/dates";
import type { Post } from "@/lib/blog/posts";

/** Ink panel used when an article has no cover image: category in the display face. */
export function CoverPlaceholder({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <div aria-hidden="true" className="flex h-full w-full flex-col justify-between bg-ink p-6 text-paper md:p-7">
      <span className="h-2 w-2 bg-signal" />
      <span className={`font-display font-[540] leading-[0.95] tracking-[-0.04em] [font-variation-settings:'wdth'_112] ${large ? "text-[clamp(3rem,2rem+4vw,6rem)]" : "text-[clamp(2.4rem,1.8rem+2vw,3.6rem)]"}`}>
        {post.category.short}
      </span>
    </div>
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <p className="type-label flex flex-wrap items-center gap-x-3 gap-y-1 text-graphite">
      <span className="flex items-center gap-2 text-ink">
        <span aria-hidden="true" className="h-1.5 w-1.5 bg-signal" />
        {post.category.name}
      </span>
      <span aria-hidden="true" className="text-ash">/</span>
      <time dateTime={post.publishedIso}>{formatShortDate(post.published)}</time>
    </p>
  );
}

/**
 * Article card on the hairline grid: cover, category and date, title, excerpt,
 * reading time. The whole cell is clickable through the title link (one link per
 * card for crawlers and screen readers); on hover the cell lifts to surface white
 * and the cover zooms in slightly, like the client wall.
 */
export function PostCard({ post, heading = "h3", index = 0 }: { post: Post; heading?: "h2" | "h3"; index?: number }) {
  const Heading = heading;
  return (
    <li
      className="post-card group relative flex flex-col border-b border-r border-line bg-paper"
      suppressHydrationWarning
      data-reveal
      style={{ "--reveal-delay": (index % 3) * 90 } as React.CSSProperties}
    >
      <div className="post-card-media relative aspect-[16/10] overflow-hidden bg-paper-deep">
        {post.cover ? (
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw"
            className="object-cover"
          />
        ) : (
          <CoverPlaceholder post={post} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <Meta post={post} />
        <Heading className="post-card-title type-h3 mt-5">
          <Link href={post.path} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-4 line-clamp-3 text-graphite">{post.excerpt}</p>
        <p className="type-label mt-auto flex items-center justify-between gap-4 pt-8 text-graphite">
          <span>{post.minutes} min de citit</span>
          <ArrowRight className="arrow-nudge arrow-nudge-right text-base text-ink" />
        </p>
      </div>
    </li>
  );
}

/** Newest article, set large across the grid on the first blog page. */
export function FeaturedPost({ post }: { post: Post }) {
  return (
    <article
      className="post-card group relative grid border border-line bg-paper lg:grid-cols-12"
      suppressHydrationWarning
      data-reveal
    >
      <div className="post-card-media relative aspect-[16/10] overflow-hidden bg-paper-deep lg:col-span-7 lg:aspect-auto lg:min-h-[28rem]">
        {post.cover ? (
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            priority
            sizes="(min-width: 1024px) 56vw, 92vw"
            className="object-cover"
          />
        ) : (
          <CoverPlaceholder post={post} large />
        )}
      </div>
      <div className="flex flex-col border-line p-6 md:p-9 lg:col-span-5 lg:border-l lg:p-10">
        <p className="type-label text-signal">Cel mai nou articol</p>
        <div className="mt-6">
          <Meta post={post} />
        </div>
        <h2 className="post-card-title type-h2 mt-6">
          <Link href={post.path} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h2>
        <p className="type-lead mt-6 text-graphite">{post.excerpt}</p>
        <p className="type-label mt-auto flex items-center justify-between gap-4 pt-10 text-graphite">
          <span>
            {post.author.name} · {post.minutes} min de citit
          </span>
          <ArrowRight className="arrow-nudge arrow-nudge-right text-lg text-ink" />
        </p>
      </div>
    </article>
  );
}

export function PostGrid({ posts, heading = "h3" }: { posts: Post[]; heading?: "h2" | "h3" }) {
  return (
    <ul className="grid border-l border-t border-line md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <PostCard key={post.slug} post={post} heading={heading} index={index} />
      ))}
    </ul>
  );
}
