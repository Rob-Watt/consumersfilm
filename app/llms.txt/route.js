import { site, absoluteUrl } from "../../lib/site";
import { getNotes } from "../../lib/notes";

export const dynamic = "force-static";

// llms.txt (https://llmstxt.org): a plain-text summary for AI answer engines.
// Built from lib/site.js, the same source as the page metadata, structured
// data, robots.txt and sitemap, so they never disagree.
export function GET() {
  const line = (label, value) => (value ? `- ${label}: ${value}` : null);
  const names = (list) => list.join(", ");

  const facts = [
    line("Title", site.title),
    line("Tagline", site.tagline),
    line("Genre", names(site.genres)),
    line("Status", site.status),
    line("Release date", site.releaseDate),
    line("Runtime", site.runtimeMinutes && `${site.runtimeMinutes} minutes`),
    line("Rating", site.contentRating),
    line("Country", site.country),
    line("Director", names(site.directors)),
    line("Writer", names(site.writers)),
    line("Producer", names(site.producers)),
    line("Cinematographer", names(site.cinematographers)),
    line("Editor", names(site.editors)),
    line("Composer", names(site.composers)),
    line(
      "Cast",
      site.cast
        .map(({ actor, character }) => (character ? `${actor} as ${character}` : actor))
        .join(", ")
    ),
    line("Production company", site.productionCompany),
  ].filter(Boolean);

  const links = [
    `- [Official site](${absoluteUrl("/")})`,
    site.trailerUrl && `- [Trailer](${site.trailerUrl})`,
    site.imdbUrl && `- [IMDb](${site.imdbUrl})`,
    ...site.socialLinks.map((url) => `- [${new URL(url).hostname}](${url})`),
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
  ].filter(Boolean);

  const notes = getNotes().map(
    ({ slug, title, date, excerpt }) =>
      `- [${title}](${absoluteUrl(`/notes/${slug}/`)})${date ? ` (${date})` : ""}${excerpt ? `: ${excerpt}` : ""}`
  );

  const body = [
    `# ${site.title}`,
    "",
    `> ${site.description || site.tagline}`,
    "",
    "## Film",
    "",
    ...facts,
    "",
    "## Links",
    "",
    ...links,
    "",
    ...(notes.length ? ["## Notes", "", ...notes, ""] : []),
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
