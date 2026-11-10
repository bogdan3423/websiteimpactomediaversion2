/**
 * Minimal front matter reader for blog articles (a small, predictable subset of
 * YAML, so no dependency is needed):
 *
 *   key: value            plain or "quoted" string, true / false
 *   key: [a, "b, c"]      inline list
 *   key:                  block list
 *     - a
 *     - b
 *   # comment
 */
export type FrontmatterValue = string | boolean | string[];
export type Frontmatter = Record<string, FrontmatterValue>;

function unquote(raw: string): string {
  const value = raw.trim();
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value) as string;
    } catch {
      return value.slice(1, -1);
    }
  }
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
  return value;
}

function splitInlineList(raw: string): string[] {
  const items: string[] = [];
  let current = "";
  let quote: string | null = null;
  for (const char of raw) {
    if (quote) {
      if (char === quote) quote = null;
      current += char;
    } else if (char === '"' || char === "'") {
      quote = char;
      current += char;
    } else if (char === ",") {
      items.push(current);
      current = "";
    } else current += char;
  }
  items.push(current);
  return items.map(unquote).filter(Boolean);
}

function scalar(raw: string): FrontmatterValue {
  const value = raw.trim();
  if (value.startsWith("[") && value.endsWith("]")) return splitInlineList(value.slice(1, -1));
  if (value === "true") return true;
  if (value === "false") return false;
  return unquote(value);
}

export function parseFrontmatter(source: string): { data: Frontmatter; body: string } {
  const match = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/);
  if (!match) throw new Error("lipsește blocul de date de la început (--- ... ---)");
  const data: Frontmatter = {};
  let listKey: string | null = null;

  for (const line of (match[1] ?? "").split(/\r?\n/)) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && listKey) {
      const list = data[listKey];
      if (Array.isArray(list)) list.push(unquote(item[1] ?? ""));
      continue;
    }
    const pair = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/);
    if (!pair) throw new Error(`rând neînțeles în blocul de date: "${line.trim()}"`);
    const key = pair[1] as string;
    const raw = pair[2] ?? "";
    if (raw.trim() === "") {
      data[key] = [];
      listKey = key;
    } else {
      data[key] = scalar(raw);
      listKey = null;
    }
  }
  return { data, body: match[2] ?? "" };
}
