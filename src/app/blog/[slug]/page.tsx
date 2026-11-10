import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleToc } from "@/components/blog/ArticleToc";
import { PostGrid } from "@/components/blog/PostCard";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { ButtonLink, TextLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { JsonLd } from "@/components/ui/JsonLd";
import { formatDate } from "@/lib/blog/dates";
import { getAllPosts, getPost, relatedPosts } from "@/lib/blog/posts";
import { articleMetadata, articleSchema } from "@/lib/blog/seo";
import { absoluteUrl } from "@/lib/site-url";
import { graph, organizationSchema } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? articleMetadata(post) : {};
}

export default async function ArticlePage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const related = relatedPosts(post);
  const url = encodeURIComponent(absoluteUrl(post.path));
  const share = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${absoluteUrl(post.path)}`)}` },
  ];

  return (
    <>
      <JsonLd data={graph(...articleSchema(post), organizationSchema())} />

      <article>
        {/* Header ---------------------------------------------------------------- */}
        <header className="shell pt-[clamp(2.5rem,1.5rem+5vw,6.5rem)]">
          <div className="flex items-center justify-between gap-6 border-b border-line pb-5">
            <nav aria-label="Breadcrumb">
              <ol className="type-label flex flex-wrap items-center gap-2 text-graphite">
                <li>
                  <Link href="/" className="link-line">
                    Acasă
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="link-line">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/blog/categorie/${post.category.slug}`} className="link-line text-ink">
                    {post.category.name}
                  </Link>
                </li>
              </ol>
            </nav>
            <p className="type-label hidden shrink-0 text-graphite sm:block">{post.minutes} min de citit</p>
          </div>

          <div className="grid-site mt-[clamp(2.5rem,1.5rem+4vw,5rem)] gap-y-8">
            <h1 className="article-title hero-rise col-span-4 md:col-span-8 lg:col-span-10">{post.title}</h1>
            <p
              className="type-lead hero-rise col-span-4 max-w-2xl text-graphite md:col-span-7 lg:col-span-6"
              style={{ "--rise-delay": 120 } as React.CSSProperties}
            >
              {post.description}
            </p>
          </div>

          <div
            className="hero-rise mt-10 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-line pt-6 md:mt-14"
            style={{ "--rise-delay": 220 } as React.CSSProperties}
          >
            <div className="flex items-center gap-3">
              <Image
                src={post.author.image}
                alt=""
                aria-hidden="true"
                width={44}
                height={44}
                sizes="44px"
                className="h-11 w-11 rounded-full object-cover"
              />
              <div className="leading-tight">
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-graphite">{post.author.role}</p>
              </div>
            </div>
            <dl className="type-label flex flex-wrap gap-x-10 gap-y-3 text-graphite">
              <div>
                <dt className="text-ash">Publicat</dt>
                <dd className="mt-1.5 text-ink">
                  <time dateTime={post.publishedIso}>{formatDate(post.published)}</time>
                </dd>
              </div>
              {post.updated ? (
                <div>
                  <dt className="text-ash">Actualizat</dt>
                  <dd className="mt-1.5 text-ink">
                    <time dateTime={post.updatedIso}>{formatDate(post.updated)}</time>
                  </dd>
                </div>
              ) : null}
              <div className="sm:hidden">
                <dt className="text-ash">Lectură</dt>
                <dd className="mt-1.5 text-ink">{post.minutes} min</dd>
              </div>
            </dl>
          </div>
        </header>

        {post.cover ? (
          <figure className="shell mt-10 md:mt-14">
            <div
              className="relative aspect-[16/10] overflow-hidden bg-paper-deep md:aspect-[2/1]"
              suppressHydrationWarning
              data-reveal="media"
            >
              <Image
                src={post.cover.src}
                alt={post.cover.alt}
                fill
                priority
                sizes="(min-width: 1536px) 1424px, 96vw"
                className="object-cover"
              />
            </div>
          </figure>
        ) : null}

        {/* Body ------------------------------------------------------------------ */}
        <div className="shell grid-site gap-y-10 py-[var(--section-tight)]">
          <aside className="col-span-4 md:col-span-8 lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              <ArticleToc items={post.toc} />
            </div>
          </aside>

          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-5">
            <div className="prose-blog" dangerouslySetInnerHTML={{ __html: post.html }} />

            {post.tags.length ? (
              <ul className="mt-14 flex flex-wrap gap-2" aria-label="Subiecte">
                {post.tags.map((tag) => (
                  <li key={tag} className="type-label border border-line px-3 py-2 text-graphite">
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
              <p className="type-label text-graphite">Distribuie</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {share.map((item) => (
                  <li key={item.label}>
                    <TextLink href={item.href} external>
                      {item.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Author ------------------------------------------------------------ */}
            <section aria-label="Despre autor" className="mt-12 flex gap-5 border border-line bg-paper p-6 md:p-8">
              <Image
                src={post.author.image}
                alt={`${post.author.name}, ${post.author.role}`}
                width={72}
                height={72}
                sizes="72px"
                className="h-16 w-16 shrink-0 rounded-full object-cover md:h-[4.5rem] md:w-[4.5rem]"
              />
              <div>
                <p className="type-label text-graphite">Autor</p>
                <p className="type-h4 mt-2">{post.author.name}</p>
                <p className="mt-1 text-sm text-graphite">{post.author.role}</p>
                <p className="mt-4 text-graphite">{post.author.bio}</p>
                <TextLink href="/despre-noi" className="mt-4">
                  Despre echipă
                </TextLink>
              </div>
            </section>

            {/* Contextual service ----------------------------------------------- */}
            <aside aria-label="Serviciu" className="mt-6 bg-ink p-6 text-paper md:p-8">
              <p className="type-label flex items-center gap-2.5 text-ash">
                <span aria-hidden="true" className="h-2 w-2 bg-signal" />
                {post.category.name}
              </p>
              <p className="type-h3 mt-5 max-w-lg">{post.category.service.title}</p>
              <p className="mt-4 max-w-lg text-ash">{post.category.service.text}</p>
              <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <ButtonLink href="/contact" variant="solid-inverse">
                  Hai să discutăm
                </ButtonLink>
                <TextLink href={post.category.service.href}>Vezi serviciul</TextLink>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length ? (
        <section className="border-t border-line" aria-labelledby="citeste-si">
          <div className="shell section">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div suppressHydrationWarning data-reveal="fade">
                  <Eyebrow>Citește și</Eyebrow>
                </div>
                <h2 id="citeste-si" className="type-h2 mt-6">
                  Mai multe din blog
                </h2>
              </div>
              <TextLink href="/blog">Toate articolele</TextLink>
            </div>
            <div className="mt-12">
              <PostGrid posts={related} />
            </div>
          </div>
        </section>
      ) : null}

      <ClosingCta
        kicker="Contact"
        title="Vrei să aplicăm asta pentru afacerea ta?"
        text="Spune-ne ce urmărești și îți propunem pașii potriviți pentru video, reclame sau website."
      />
    </>
  );
}
