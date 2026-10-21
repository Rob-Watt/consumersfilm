import { absoluteUrl } from "../lib/site";

export const dynamic = "force-static";

// Allow every crawler, including AI answer engines (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended), so the film can be cited in AI answers.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
