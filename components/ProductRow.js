"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductRow({ title, products, placeholderCount }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const items = products.length ? products : Array(placeholderCount).fill(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setCanPrev(track.scrollLeft > 2);
      setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 2);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items.length]);

  const page = (dir) =>
    trackRef.current?.scrollBy({ left: dir * trackRef.current.clientWidth, behavior: "smooth" });

  return (
    <section className="product-row" aria-label={title}>
      <header className="shop-eyebrow">
        <h2>{title}</h2>
      </header>
      <div className="product-row__viewport">
        <div className="product-row__track" ref={trackRef}>
          {items.map((product, i) => (
            <ProductCard key={product?.href || product?.title || i} product={product} />
          ))}
        </div>
        <button
          type="button"
          className="product-row__arrow product-row__arrow--prev"
          aria-label={`Previous ${title}`}
          onClick={() => page(-1)}
          hidden={!canPrev}
        >
          <Chevron />
        </button>
        <button
          type="button"
          className="product-row__arrow"
          aria-label={`More ${title}`}
          onClick={() => page(1)}
          hidden={!canNext}
        >
          <Chevron />
        </button>
      </div>
    </section>
  );
}

function Chevron() {
  return (
    <svg width="14" height="36" viewBox="0 0 14 36" aria-hidden="true">
      <path d="M1 1l12 17L1 35" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
