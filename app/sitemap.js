import { absoluteUrl } from "../lib/site";
import { navItems } from "../lib/nav";

export const dynamic = "force-static";

export default function sitemap() {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, priority: 1 },
    ...navItems
      .filter(({ ready }) => ready)
      .map(({ slug }) => ({ url: absoluteUrl(`/${slug}/`), lastModified: now, priority: 0.7 })),
  ];
}
