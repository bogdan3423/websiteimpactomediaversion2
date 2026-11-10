/**
 * URL-safe slug from Romanian text: diacritics stripped (ă â î ș ț), lowercase,
 * words joined by single hyphens. Used for article URLs and heading anchors.
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&[a-z]+;/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
