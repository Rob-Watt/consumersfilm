import Link from "next/link";
import NoteMeta from "../../components/NoteMeta";
import { getNotes } from "../../lib/notes";
import { navItems } from "../../lib/nav";

const item = navItems.find(({ slug }) => slug === "notes");
const notes = getNotes();

export const metadata = {
  title: item.title,
  description: "Journal entries and material from the making of Consumers.",
  alternates: { canonical: "/notes/" },
  // Hidden from search until the first note is published.
  robots: notes.length ? undefined : { index: false, follow: true },
};

export default function NotesPage() {
  const featured = notes.find((note) => note.featured) ?? notes[0];
  const rest = notes.filter((note) => note !== featured);
  const grid = notes.length ? rest : Array(6).fill(null);

  return (
    <main className="notes theme-light">
      <h1 className="display-heading">{item.title}</h1>

      <NoteThumb note={featured} featured />

      <div className="notes__grid">
        {grid.map((note, i) => (
          <NoteThumb key={note?.slug ?? i} note={note} />
        ))}
      </div>

    </main>
  );
}

function NoteThumb({ note, featured = false }) {
  const className = `note-thumb${featured ? " note-thumb--featured" : ""}`;

  if (!note) {
    return (
      <div className={`${className} is-placeholder`} aria-hidden="true">
        <span className="skeleton skeleton--meta" />
        <span className="skeleton skeleton--title" />
        <span className="note-thumb__image" />
      </div>
    );
  }

  return (
    <article className={className}>
      <Link href={`/notes/${note.slug}/`} className="note-thumb__link">
        <NoteMeta note={note} />
        <span className="note-thumb__title">{note.title}</span>
        <span className="note-thumb__image">
          {note.image && <img src={note.image} alt={note.imageAlt} loading={featured ? "eager" : "lazy"} />}
        </span>
      </Link>
    </article>
  );
}
