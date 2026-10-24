"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

export default function StackingHero({ slides }) {
  const sectionRef = useRef(null);
  const [layout, setLayout] = useState(null);

  // Sticky cards don't report their natural position once pinned, so we add
  // up each card's height and gap to find where it sits in the page. Cards
  // can differ in height (the portrait poster is taller than the stills).
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const measure = () => {
      const cards = [...section.children];
      if (!cards.length) return;
      let y = section.getBoundingClientRect().top + window.scrollY;
      const positions = cards.map((card, i) => {
        const style = getComputedStyle(card);
        if (i > 0) y += Number.parseFloat(style.marginTop) || 0;
        const top = y;
        const height = card.getBoundingClientRect().height;
        y += height;
        // Where the card pins: 0 on desktop, mid-screen on portrait phones.
        return { top, height, stick: Number.parseFloat(style.top) || 0 };
      });
      setLayout({
        positions,
        viewport: window.innerHeight,
        inset: Number.parseFloat(getComputedStyle(cards[0]).borderTopWidth) || 0,
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(section);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="hero" ref={sectionRef}>
      {slides.map((slide, i) => (
        <Slide
          key={slide.src}
          slide={slide}
          index={i}
          isFinal={i === slides.length - 1}
          layout={layout}
        />
      ))}
    </section>
  );
}

function Slide({ slide, index, isFinal, layout }) {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  const self = layout?.positions[index] ?? { top: 0, height: 1, stick: 0 };
  const next = layout?.positions[index + 1];
  const viewport = layout?.viewport ?? 1;
  const inset = layout?.inset ?? 0;

  // Card enters at the bottom of the screen, pins, then is covered once the
  // next card pins.
  const enter = self.top - viewport;
  const pinned = self.top - self.stick;
  const covered = next ? next.top - next.stick : self.top + self.height;

  const y = useTransform(
    scrollY,
    [enter, covered],
    reduceMotion || slide.keepWhole ? ["0%", "0%"] : ["-8%", "8%"]
  );

  // A card covered by a smaller one (the portrait poster) would still show
  // around the edges, so it fades almost to black instead of just dimming.
  const coveredBySmaller = next && next.height < self.height - 2;
  const shade = useTransform(
    scrollY,
    [pinned, covered],
    [0, isFinal ? 0 : coveredBySmaller ? 0.94 : 0.55]
  );

  const clip = useTransform(scrollY, [enter, pinned], [inset, 0]);
  const clipPath = useMotionTemplate`inset(${clip}px)`;

  const className = [
    "slide",
    isFinal ? "slide--final" : "slide--sticky",
    slide.keepWhole && "slide--whole",
    slide.portraitSrc && "slide--poster",
  ].filter(Boolean).join(" ");

  return (
    <motion.div
      className={className}
      style={isFinal ? { clipPath } : undefined}
    >
      <motion.div className="media" style={{ y }}>
        {/* Phones held upright get the portrait poster when there is one;
            each device downloads only the image it shows. */}
        <picture>
          {slide.portraitSrc && (
            <source media="(max-aspect-ratio: 1/1)" srcSet={slide.portraitSrc} />
          )}
          <img
            src={slide.src}
            alt={slide.alt}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        </picture>
      </motion.div>
      {!isFinal && <motion.div className="shade" style={{ opacity: shade }} />}
    </motion.div>
  );
}
