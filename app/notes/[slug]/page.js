import { notFound } from "next/navigation";
import NoteMeta from "../../../components/NoteMeta";
import { getNote, getNotes } from "../../../lib/notes";
import { absoluteUrl, site } from "../../../lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  const notes = getNotes();
  // A static export needs at least one page here; until the first note exists
  // this builds a stand-in that renders as "not found".
  return notes.length ? notes.map(({ slug }) => ({ slug })) : [{ slug: "_none" }];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.excerpt || undefined,
    alternates: { canonical: `/notes/${note.slug}/` },
    openGraph: {
      type: "article",
      title: note.title,
      description: note.excerpt || undefined,
      publishedTime: note.date || undefined,
      ...(note.image && { images: [absoluteUrl(note.image)] }),
    },
  };
}

export default async function NotePage({ params }) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  // Article structured data, linked to the film, so answer engines can cite it.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: note.title,
    datePublished: note.date || undefined,
    description: note.excerpt || undefined,
    image: note.image ? absoluteUrl(note.image) : undefined,
    url: absoluteUrl(`/notes/${note.slug}/`),
    about: { "@type": "Movie", name: site.title, url: absoluteUrl("/") },
  };

  return (
    <main className="note theme-light">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="note__header">
          <NoteMeta note={note} />
          <h1 className="note__title">{note.title}</h1>
        </header>
        {note.image && (
          <img className="note__image" src={note.image} alt="" />
        )}
        <div className="note__body" dangerouslySetInnerHTML={{ __html: note.html }} />
      </article>
    </main>
  );
}
