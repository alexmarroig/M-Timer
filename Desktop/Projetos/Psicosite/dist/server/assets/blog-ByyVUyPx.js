import { V as jsxRuntimeExports } from "./server-BqT9Ay6l.js";
import { L as Layout, P as PageHero, i as images, g as articles, F as FinalContact } from "./Primitives-B9O0eYRr.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-YKjFpduk.js";
function BlogPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: "Blog", title: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Reflexões clínicas para ler com calma." }), intro: "Uma base editorial preparada para crescer em torno de psicoterapia online, ansiedade, relacionamentos e autoconhecimento.", image: images.life2 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-editorial grid gap-10 md:grid-cols-3", children: articles.map((article) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "photo-shell overflow-hidden rounded-[2px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: article.image, alt: "", className: "image-wash aspect-[5/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.035] md:aspect-[4/5]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-6 block num-eyebrow", children: article.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-serif text-[28px] leading-tight", children: article.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[15px] leading-relaxed text-muted-foreground", children: article.excerpt }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-[12px] uppercase tracking-[0.2em] text-muted-foreground", children: "Em breve" })
    ] }, article.slug)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalContact, {})
  ] });
}
export {
  BlogPage as component
};
