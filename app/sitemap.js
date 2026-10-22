import { absoluteUrl } from "../lib/site";
import { navItems } from "../lib/nav";
import { getNotes } from "../lib/notes";

export const dynamic = "force-static";

export default function sitemap() {
  const now = new Date();
  const notes = getNotes();
  return [
    { url: absoluteUrl("/"), lastModified: now, priority: 1 },
    ...navItems
      .filter(({ ready, slug }) => ready || (slug === "notes" && notes.length))
      .map(({ slug }) => ({ url: absoluteUrl(`/${slug}/`), lastModified: now, priority: 0.7 })),
    ...notes.map(({ slug, date }) => ({
      url: absoluteUrl(`/notes/${slug}/`),
      lastModified: date ? new Date(date) : now,
      priority: 0.6,
    })),
  ];
}
