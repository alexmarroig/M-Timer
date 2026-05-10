import { V as jsxRuntimeExports } from "./server-BqT9Ay6l.js";
import { L as Link } from "./router-YKjFpduk.js";
import { c as createLucideIcon, L as Layout, P as PageHero, s as serviceAreas, A as ArrowUpRight, g as articles, F as FinalContact } from "./Primitives-B9O0eYRr.js";
const __iconNode = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode);
function ServicePage({
  eyebrow,
  title,
  intro,
  image,
  lead,
  points
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow, title, intro, image }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial grid gap-14 md:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[52px]", children: "Um cuidado que começa pela escuta." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "safe-measure mt-6 text-[16px] leading-[1.85] text-muted-foreground", children: lead })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "quiet-card grid gap-px overflow-hidden", children: points.map((point) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "flex gap-4 bg-[var(--ivory)] p-5 sm:p-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mt-1 h-4 w-4 shrink-0 text-[var(--forest)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[15.5px] leading-relaxed text-foreground/78", children: point })
          ]
        },
        point
      )) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-mist section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "max-w-2xl font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[52px]", children: "Outros caminhos de leitura clínica." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/blog",
            className: "premium-link text-[13px] tracking-wide text-[var(--forest)]",
            children: "Ver textos"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-5 md:grid-cols-3", children: serviceAreas.slice(0, 3).map((area) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: area.to, className: "quiet-card group p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num-eyebrow", children: area.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-serif text-[24px]", children: area.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14.5px] leading-relaxed text-muted-foreground", children: area.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "mt-5 h-4 w-4 text-[var(--forest)] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" })
      ] }, area.to)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[52px]", children: "Do blog" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-8 md:grid-cols-3", children: articles.map((article) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "article",
        {
          className: "border-t border-border pt-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num-eyebrow", children: article.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-serif text-[24px] leading-tight", children: article.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[14.5px] leading-relaxed text-muted-foreground", children: article.excerpt })
          ]
        },
        article.slug
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalContact, {})
  ] });
}
export {
  ServicePage as S
};
