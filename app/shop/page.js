import ProductCard from "../../components/ProductCard";
import ProductRow from "../../components/ProductRow";
import { navItems } from "../../lib/nav";
import { shop } from "../../lib/shop";
import { basePath } from "../../lib/site";

const item = navItems.find(({ slug }) => slug === "shop");

export const metadata = {
  title: item.title,
  alternates: { canonical: "/shop/" },
  robots: item.ready ? undefined : { index: false, follow: true },
};

export default function ShopPage() {
  const { featured, featuredEyebrow, rows, collection, placeholderCount } = shop;
  const collectionItems = Array.from({ length: 5 }, (_, i) => collection.products[i] ?? null);

  return (
    <main className="shop">
      <h1 className="visually-hidden">{item.title}</h1>

      {/* Featured product: large image left, details right. */}
      <section className="shop-hero" aria-label="Featured">
        <div className="shop-hero__media">
          {featured?.image && (
            <img
              src={featured.image.startsWith("/") ? `${basePath}${featured.image}` : featured.image}
              alt={featured.title}
            />
          )}
        </div>
        <div className="shop-hero__details">
          {featured ? (
            <>
              <p className="shop-hero__eyebrow">{featuredEyebrow}</p>
              <h2 className="shop-hero__title">{featured.title}</h2>
              {featured.price && <p className="shop-hero__price">{featured.price}</p>}
              {featured.href && (
                <a className="shop-button" href={featured.href}>
                  Shop now
                </a>
              )}
            </>
          ) : (
            <div className="shop-hero__placeholder" aria-hidden="true">
              <span className="product-card__bar product-card__bar--short" />
              <span className="shop-hero__bar" />
              <span className="shop-hero__bar" />
              <span className="shop-hero__bar shop-hero__bar--short" />
            </div>
          )}
        </div>
      </section>

      {rows.map((row) => (
        <ProductRow
          key={row.title}
          title={row.title}
          products={row.products}
          placeholderCount={placeholderCount}
        />
      ))}

      {/* Collection feature: title left, image grid right. */}
      <section className="shop-collection" aria-label={collection.title}>
        <a className="shop-collection__title" href={collection.href || undefined}>
          {collection.title}
          <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
            <path d="M0 7h20M14 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </a>
        <div className="shop-collection__grid">
          {collectionItems.map((product, i) => (
            <ProductCard key={product?.href || i} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
