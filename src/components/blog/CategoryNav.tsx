import Link from "next/link";
import { activeCategories, getAllPosts } from "@/lib/blog/posts";

/** Category filter as plain links (each category has its own indexable page). */
export function CategoryNav({ current }: { current?: string }) {
  const items = [
    { href: "/blog", label: "Toate", count: getAllPosts().length, active: !current },
    ...activeCategories().map(({ category, count }) => ({
      href: `/blog/categorie/${category.slug}`,
      label: category.name,
      count,
      active: current === category.slug,
    })),
  ];
  if (items.length < 3) return null;
  return (
    <nav aria-label="Categorii blog" suppressHydrationWarning data-reveal="fade">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className="type-label flex min-h-11 items-center gap-3 border border-line px-4 text-ink transition-colors duration-200 hover:border-ink aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-paper"
            >
              {item.label}
              <span className="text-ash">{item.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
