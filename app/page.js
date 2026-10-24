import StackingHero from "../components/StackingHero";
import WelcomePrompt from "../components/WelcomePrompt";
import { site, basePath, movieJsonLd } from "../lib/site";

const slides = [
  // Title is baked into the bottom-left of this image, so it must never crop.
  // portraitSrc: the vertical version shown on screens held upright.
  { src: `${basePath}/images/close-up.jpg`, alt: `${site.title} key art: a close-up of Jennifer Michele De Winter beside the title and the tagline 'Safety is an illusion'.`, keepWhole: true, portraitSrc: `${basePath}/images/poster-mobile.jpg` },
  { src: `${basePath}/images/reflection.jpg`, alt: `Still from ${site.title}: Jennifer Michele De Winter's reflection in a car window at night, with golden lights glowing behind her.`, portraitSrc: `${basePath}/images/reflection-vert.jpg` },
  { src: `${basePath}/images/shock.jpg`, alt: `Still from ${site.title}: Jennifer Michele De Winter stares in shock from inside a car at night.`, portraitSrc: `${basePath}/images/shock-vert.jpg` },
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
