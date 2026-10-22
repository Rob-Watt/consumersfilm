import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Each journal entry is a Markdown file in content/notes/. The file name is
// the page address: content/notes/first-day.md → /notes/first-day/.
// Files starting with "_" (like the template) are ignored.
const dir = path.join(process.cwd(), "content", "notes");

export function getNotes() {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title ?? "",
        date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
        type: data.type ?? "",
        image: data.image ?? "",
        excerpt: data.excerpt ?? "",
        featured: Boolean(data.featured),
        html: marked.parse(content),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getNote(slug) {
  return getNotes().find((note) => note.slug === slug);
}

// "2026-10-22" → "OCT 22 2026", as on A24's notes.
export function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const month = new Date(Date.UTC(y, m - 1, d)).toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${month} ${String(d).padStart(2, "0")} ${y}`.toUpperCase();
}
