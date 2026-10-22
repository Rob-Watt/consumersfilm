import { basePath } from "../lib/site";

const src = (image) => (image?.startsWith("/") ? `${basePath}${image}` : image);

export default function ProductCard({ product }) {
  if (!product) {
    return (
      <div className="product-card is-placeholder" aria-hidden="true">
        <div className="product-card__media" />
        <span className="product-card__bar" />
        <span className="product-card__bar product-card__bar--short" />
      </div>
    );
  }

  const { title, price, image, href, status } = product;
  const isExternal = href?.startsWith("http");

  return (
    <a
      className="product-card"
      href={href || undefined}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
    >
      <div className="product-card__media">
        {image && <img src={src(image)} alt={title} loading="lazy" />}
      </div>
      {status && <p className="product-card__status">{status}</p>}
      <h3 className="product-card__title">{title}</h3>
      {price && <p className="product-card__price">{price}</p>}
    </a>
  );
}
