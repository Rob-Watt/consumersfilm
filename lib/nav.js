// Menu sections, in menu order. `title` is the page heading and browser tab
// title. `ownPage` sections have their own folder in app/ instead of the shared
// placeholder page. Flip `ready` to true once a page has real content: it is then listed
// in the sitemap and allowed into search results.
export const navItems = [
  { slug: "contact", label: "Contact", title: "Contact", ready: false },
  { slug: "news", label: "News", title: "News", ready: false },
  { slug: "bts", label: "BTS", title: "Behind the Scenes", ready: false },
  { slug: "shop", label: "Shop", title: "Shop", ready: false, ownPage: true },
  { slug: "notes", label: "Notes", title: "Notes", ready: false },
];
