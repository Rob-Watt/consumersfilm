import { btsVideos } from "../../lib/bts";
import { navItems } from "../../lib/nav";
import { absoluteUrl, site } from "../../lib/site";

const item = navItems.find(({ slug }) => slug === "bts");

export const metadata = {
  title: item.title,
  description: `Behind the scenes of ${site.title}: interviews with the filmmakers.`,
  alternates: { canonical: "/bts/" },
  robots: item.ready ? undefined : { index: false, follow: true },
};

// VideoObject data so search engines can show and understand each video.
const videoJsonLd = (video) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: `${video.title} — ${site.title} behind the scenes`,
  description: video.description,
  thumbnailUrl: absoluteUrl(video.poster),
  contentUrl: absoluteUrl(video.src),
  uploadDate: video.uploadDate,
  duration: video.duration,
  transcript: video.transcript.join("\n\n"),
  about: { "@type": "Movie", name: site.title, url: absoluteUrl("/") },
});

export default function BtsPage() {
  return (
    <main className="bts">
      <h1 className="display-heading">{item.title}</h1>

      {btsVideos.map((video) => (
        <section key={video.slug} id={video.slug} className="bts-video" aria-labelledby={`${video.slug}-title`}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd(video)) }}
          />
          <div className="bts-video__player">
            <video
              controls
              playsInline
              preload="metadata"
              poster={video.poster}
              width={video.width}
              height={video.height}
            >
              <source src={video.src} type="video/mp4" />
              <track kind="captions" src={video.captions} srcLang="en" label="English" />
            </video>
          </div>
          <div className="bts-video__text">
            <h2 id={`${video.slug}-title`} className="bts-video__title">{video.title}</h2>
            <p className="bts-video__role">{video.role}</p>
            <h3 className="bts-video__transcript-heading">Transcript</h3>
            <div className="bts-video__transcript" tabIndex={0} role="region" aria-label={`Transcript: ${video.title}`}>
              {video.transcript.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
