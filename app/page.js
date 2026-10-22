import StackingHero from "../components/StackingHero";
import WelcomePrompt from "../components/WelcomePrompt";
import { site, basePath, movieJsonLd } from "../lib/site";

const slides = [
  // Title is baked into the bottom-left of this image, so it must never crop.
  { src: `${basePath}/images/close-up.jpg`, alt: `${site.title} — ${site.tagline}`, keepWhole: true },
  { src: `${basePath}/images/reflection.jpg`, alt: "Jennifer's reflection" },
  { src: `${basePath}/images/shock.jpg`, alt: "Jennifer DeWinter in shock" },
];

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd()) }}
      />
      {/* The visible title lives in the first image; this gives crawlers and
          screen readers the same heading as text. */}
      <h1 className="visually-hidden">
        {site.title}: {site.tagline}
      </h1>
      <StackingHero slides={slides} />
      <WelcomePrompt />
    </main>
  );
}
