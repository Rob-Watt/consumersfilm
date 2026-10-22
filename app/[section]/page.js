import { notFound } from "next/navigation";
import { navItems } from "../../lib/nav";

export const dynamicParams = false;

export function generateStaticParams() {
  return navItems
    .filter(({ ownPage }) => !ownPage)
    .map(({ slug }) => ({ section: slug }));
}

export async function generateMetadata({ params }) {
  const { section } = await params;
  const item = navItems.find(({ slug }) => slug === section);
  if (!item) return {};
  return {
    title: item.title,
    alternates: { canonical: `/${item.slug}/` },
    // Placeholder pages stay out of search results until they have content.
    robots: item.ready ? undefined : { index: false, follow: true },
  };
}

export default async function SectionPage({ params }) {
  const { section } = await params;
  const item = navItems.find(({ slug }) => slug === section);
  if (!item) notFound();

  return (
    <main className="page">
      <h1 className="page__title">{item.title}</h1>
    </main>
  );
}
