import { absoluteUrl } from "../lib/site";

export const dynamic = "force-static";

export default function sitemap() {
  return [{ url: absoluteUrl("/"), lastModified: new Date(), priority: 1 }];
}
