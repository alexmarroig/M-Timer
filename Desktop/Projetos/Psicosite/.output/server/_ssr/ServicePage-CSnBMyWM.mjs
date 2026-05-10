import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Layout, P as PageHero, F as FinalContact } from "./Layout-D7gehF66.mjs";
import { s as serviceAreas, a as articles } from "./router-k3VwZQIo.mjs";
import { C as Check, A as ArrowUpRight, P as Plus } from "../_libs/lucide-react.mjs";
function ServicePage({
  eyebrow,
  title,
  intro,
  image,
  alt,
  lead,
  points,
  faqItems,
  cta
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow, title, intro, image, alt }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial grid gap-14 md:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[52px]", children: "Um trabalho clínico que prioriza a escuta." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "safe-measure mt-6 text-[16px] leading-[1.85] text-muted-foreground", children: lead })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "quiet-card grid gap-px overflow-hidden", children: points.map((point) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex gap-4 bg-[var(--ivory)] p-5 sm:p-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mt-1 h-4 w-4 shrink-0 text-[var(--forest)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[15.5px] leading-relaxed text-foreground/78", children: point })
            ]
          },
          point
        )) }),
        cta
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-mist section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "max-w-2xl font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[52px]", children: "Outras perspectivas e temas clínicos." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/blog",
            className: "premium-link text-[13px] tracking-wide text-[var(--forest)]",
            children: "Ver todos os textos"
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[52px]", children: "Reflexões da clínica" }),
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
    faqItems && faqItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial max-w-4xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num-eyebrow", children: "Dúvidas comuns" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-4 font-serif text-[34px] leading-tight sm:text-[42px] md:text-[52px]", children: [
          "Perguntas sobre ",
          eyebrow
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quiet-card divide-y divide-border p-4 sm:p-8", children: faqItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group py-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "flex cursor-pointer list-none items-start justify-between gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-[21px] leading-tight text-[var(--ink)] sm:text-[23px]", children: item.q }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mt-1 h-5 w-5 shrink-0 text-[var(--forest)] transition-transform group-open:rotate-45" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted-foreground", children: item.a })
      ] }, item.q)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalContact, {})
  ] });
}
export {
  ServicePage as S
};
