// Per-page title, description and canonical URL. index.html carries the home
// values (what link-preview crawlers read, since they don't run JavaScript);
// search engines render the app and pick these up for the other pages.
const SITE = "https://tonylewismanzi.com";
const BRAND = "Tony Lewis - Product Designer";

const PAGES: Record<string, { title: string; description: string }> = {
  "/": {
    title: BRAND,
    description: "Tony Lewis is a product designer in Kigali, Rwanda, turning messy, real-world problems into products people actually understand.",
  },
  "/case-study": {
    title: `Case study | ${BRAND}`,
    description: "A product design case study by Tony Lewis: the problem, the decisions, and the outcome.",
  },
  "/resume": {
    title: `Resume | ${BRAND}`,
    description: "Resume of Tony Lewis, product designer in Kigali, Rwanda.",
  },
};

function setMeta(selector: string, attr: "content" | "href", value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function applyPageMeta(path: string) {
  const page = PAGES[path] ?? PAGES["/"];
  const url = `${SITE}${path === "/" ? "/" : path}`;
  document.title = page.title;
  setMeta('meta[name="description"]', "content", page.description);
  setMeta('link[rel="canonical"]', "href", url);
  setMeta('meta[property="og:title"]', "content", page.title);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[name="twitter:title"]', "content", page.title);
}
