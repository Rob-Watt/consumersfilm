import { formatDate } from "../lib/notes";

// Tag pill + date line, as on a24films.com/notes.
export default function NoteMeta({ note }) {
  return (
    <span className="note-meta">
      {note.type && <span className="note-pill">{note.type}</span>}
      {note.date && <time dateTime={note.date}>{formatDate(note.date)}</time>}
    </span>
  );
}
