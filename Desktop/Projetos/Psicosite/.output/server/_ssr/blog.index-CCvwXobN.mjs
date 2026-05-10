import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Layout, P as PageHero, F as FinalContact } from "./Layout-D7gehF66.mjs";
import { i as images, a as articles } from "./router-k3VwZQIo.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/vercel__analytics.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
function BlogPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: "Blog", title: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Reflexões clínicas para ler com calma." }), intro: "Uma base editorial preparada para crescer em torno de psicoterapia online, ansiedade, relacionamentos e autoconhecimento.", image: images.life2 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-editorial grid gap-10 md:grid-cols-3", children: articles.map((article) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog/$slug", params: {
      slug: article.slug
    }, className: "group block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "photo-shell overflow-hidden rounded-[2rem]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: article.coverImage, alt: `Capa do artigo: ${article.title}`, className: "image-wash aspect-[5/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.035] md:aspect-[4/5]", loading: "lazy", width: 400, height: 500 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-6 block num-eyebrow", children: article.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-serif text-[28px] leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--forest)]", children: article.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[15px] leading-relaxed text-muted-foreground", children: article.excerpt }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[var(--clay)] transition-all group-hover:translate-x-1", children: [
        "Ler artigo ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-4 bg-[var(--clay)]" })
      ] })
    ] }) }, article.slug)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalContact, {})
  ] });
}
export {
  BlogPage as component
};
