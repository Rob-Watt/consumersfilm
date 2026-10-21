// Single source of truth for the film's facts. Search engines and AI answer
// engines read these through the page metadata and structured data, so keep
// them accurate. Leave a field empty ("" or []) and it is simply left out.

export const site = {
  // Set by the deploy workflow; falls back to localhost for local builds.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  title: "Consumers",
  tagline: "Safety is an illusion.",

  // One or two plain sentences: what the film is about. This is the text most
  // likely to be shown in search results and quoted in AI answers.
  description: "",

  genres: ["Psychological Horror"],
  status: "In post-production",
  releaseDate: "",     // ISO date, e.g. "2026-03-14"
  runtimeMinutes: null,
  contentRating: "",   // e.g. "R"
  language: "en",
  country: "",         // e.g. "US"

  directors: [],       // ["Name"]
  writers: ["Rob Watt", "Jennifer Michele De Winter"],
  producers: ["Rob Watt", "Grey Damon", "Audrey Seda"],
  cinematographers: ["Rob Watt"],  // not in schema.org Movie; shown in llms.txt
  editors: ["Rob Watt", "Jennifer Michele De Winter"],
  cast: [],            // [{ actor: "Name", character: "Role" }]
  productionCompany: "",

  trailerUrl: "",      // YouTube/Vimeo link
  imdbUrl: "https://www.imdb.com/title/tt38782648/",
  socialLinks: [],     // Instagram, X, etc. — used as sameAs in structured data

  // Shared-link preview image (Facebook, iMessage, Slack, X, etc.).
  shareImage: { path: "/images/close-up.jpg", width: 1920, height: 1080 },
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const absoluteUrl = (path = "/") => `${site.url}${path}`;

const person = (name) => ({ "@type": "Person", name });

// schema.org Movie markup — the main signal answer engines use to identify the film.
export function movieJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: site.title,
    url: absoluteUrl("/"),
    image: absoluteUrl(site.shareImage.path),
    description: site.description || site.tagline,
    slogan: site.tagline,
    inLanguage: site.language,
    genre: site.genres,
    datePublished: site.releaseDate,
    duration: site.runtimeMinutes ? `PT${site.runtimeMinutes}M` : "",
    contentRating: site.contentRating,
    countryOfOrigin: site.country && { "@type": "Country", name: site.country },
    director: site.directors.map(person),
    author: site.writers.map(person),
    producer: site.producers.map(person),
    actor: site.cast.map(({ actor }) => person(actor)),
    character: site.cast
      .filter(({ character }) => character)
      .map(({ actor, character }) => ({
        "@type": "PerformanceRole",
        roleName: character,
        actor: person(actor),
      })),
    productionCompany: site.productionCompany && {
      "@type": "Organization",
      name: site.productionCompany,
    },
    trailer: site.trailerUrl && {
      "@type": "VideoObject",
      name: `${site.title} — Official Trailer`,
      embedUrl: site.trailerUrl,
      thumbnailUrl: absoluteUrl(site.shareImage.path),
      description: site.description || site.tagline,
    },
    sameAs: [site.imdbUrl, ...site.socialLinks].filter(Boolean),
  };

  return Object.fromEntries(
    Object.entries(data).filter(([, v]) => (Array.isArray(v) ? v.length : Boolean(v)))
  );
}
