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

  // Sticky cards don't report their natural position once pinned, so we
  // measure the section and derive each card's scroll range from its index.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const measure = () => {
      const first = section.firstElementChild;
      const second = first?.nextElementSibling;
      if (!first) return;
      const height = first.getBoundingClientRect().height;
      const overlap = second
        ? Number.parseFloat(getComputedStyle(second).marginTop) || 0
        : 0;
      setLayout({
        top: section.getBoundingClientRect().top + window.scrollY,
        step: height + overlap,
        viewport: window.innerHeight,
        inset: Number.parseFloat(getComputedStyle(first).borderTopWidth) || 0,
        // Where cards pin: 0 on desktop, mid-screen on portrait phones.
        stick: Number.parseFloat(getComputedStyle(first).top) || 0,
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

  const top = layout ? layout.top + index * layout.step : 0;
  const step = layout?.step ?? 1;
  const viewport = layout?.viewport ?? 1;
  const inset = layout?.inset ?? 0;
  const stick = layout?.stick ?? 0;

  // Card enters at the bottom of the screen, pins, then is covered.
  const enter = top - viewport;
  const pinned = top - stick;
  const covered = top + step - stick;

  const y = useTransform(
    scrollY,
    [enter, covered],
    reduceMotion || slide.keepWhole ? ["0%", "0%"] : ["-8%", "8%"]
  );

  const shade = useTransform(scrollY, [pinned, covered], [0, isFinal ? 0 : 0.55]);

  const clip = useTransform(scrollY, [enter, pinned], [inset, 0]);
  const clipPath = useMotionTemplate`inset(${clip}px)`;

  const className = [
    "slide",
    isFinal ? "slide--final" : "slide--sticky",
    slide.keepWhole && "slide--whole",
  ].filter(Boolean).join(" ");

  return (
    <motion.div
      className={className}
      style={isFinal ? { clipPath } : undefined}
    >
      <motion.div className="media" style={{ y }}>
        {slide.portraitSrc ? (
          // Both versions load up front (no lazy loading): Safari may never
          // load a lazy image that only becomes visible after rotating.
          <>
            <img
              className="media__wide"
              src={slide.src}
              alt={slide.alt}
              decoding="async"
              fetchPriority={index === 0 ? "high" : "auto"}
            />
            <img
              className="media__tall"
              src={slide.portraitSrc}
              alt={slide.alt}
              decoding="async"
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          </>
        ) : (
          <img
            src={slide.src}
            alt={slide.alt}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        )}
      </motion.div>
      {!isFinal && <motion.div className="shade" style={{ opacity: shade }} />}
    </motion.div>
  );
}
