// Shop content. When Printify products are ready, fill these in; anything left
// empty shows as a blank placeholder card so the layout holds its shape.
//
// A product looks like:
//   {
//     title: "Consumers Logo Tee",
//     price: "$32",
//     image: "/images/shop/logo-tee.jpg",   // or a full Printify image URL
//     href: "https://…",                     // product / checkout link
//     status: "Preorder",                    // optional: "New", "Sold out", …
//   }

export const shop = {
  featured: null,          // one product, shown large at the top
  featuredEyebrow: "New",

  rows: [
    { title: "New arrivals", products: [] },
    { title: "Best sellers", products: [] },
  ],

  // Collection feature: big title on the left, a grid of up to 5 products on
  // the right (the first one is shown tall).
  collection: { title: "Consumers", href: "", products: [] },

  placeholderCount: 8,     // blank cards per row while a row is empty
};
