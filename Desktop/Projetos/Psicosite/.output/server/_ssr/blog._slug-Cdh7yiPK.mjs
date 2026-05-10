import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Layout, b as FadeIn, F as FinalContact } from "./Layout-D7gehF66.mjs";
import { R as Route, g as getWhatsAppLink, c as camila } from "./router-k3VwZQIo.mjs";
import { D as DocumentRenderer } from "../_libs/keystatic__core.mjs";
import { d as ArrowLeft, T as Tag, e as Clock } from "../_libs/lucide-react.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
function PostPage() {
  const {
    article
  } = Route.useLoaderData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: "pb-24 pt-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FadeIn, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog", className: "inline-flex items-center gap-2 text-[13px] uppercase tracking-widest text-[var(--clay)] transition-colors hover:text-[var(--forest)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Voltar ao blog"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mt-12 max-w-4xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 text-[12px] uppercase tracking-[0.15em] text-[var(--clay)]/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5" }),
              " ",
              article.category
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-[var(--clay)]/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
              " ",
              new Date(article.date).toLocaleDateString("pt-BR")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-serif text-[42px] leading-[1.1] text-[var(--ink)] sm:text-[54px] md:text-[64px]", children: article.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-[18px] leading-relaxed text-[var(--ink)]/80 sm:text-[20px]", children: article.excerpt })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { delay: 0.2, className: "mt-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[21/9] w-full overflow-hidden rounded-[2rem]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: article.coverImage, alt: `Imagem de capa: ${article.title}`, className: "h-full w-full object-cover", width: 1200, height: 600, fetchPriority: "high" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 grid gap-16 md:grid-cols-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prose prose-stone prose-lg md:col-span-8 lg:col-span-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rich-text-content font-serif text-[18px] leading-relaxed text-[var(--ink)]/90 sm:text-[20px]", children: article.content ? /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentRenderer, { document: article.content }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Conteúdo em breve..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-20 border-t border-border pt-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-[24px]", children: "Interessou-se por este tema?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Se você se identificou com este texto e sente que este é o momento de buscar um espaço de escuta profissional, estou à disposição." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: getWhatsAppLink(`Olá Psicóloga Camila Freitas, li seu artigo sobre "${article.title}" e gostaria de agendar uma sessão de psicoterapia.`), className: "mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[var(--forest)] px-8 text-[13px] tracking-wide text-white transition-all hover:bg-[var(--ink)]", children: "Agendar sessão de psicoterapia" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "md:col-span-4 lg:col-offset-1 lg:col-span-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-32 rounded-xl bg-[var(--bone)]/40 p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square w-24 overflow-hidden rounded-full grayscale", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: camila.portrait || "/images/camila-portrait.jpg", alt: `Retrato de ${camila.name}`, className: "h-full w-full object-cover", width: 96, height: 96, loading: "lazy" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-6 font-serif text-[20px]", children: camila.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] text-muted-foreground", children: camila.approach }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[14px] leading-relaxed text-muted-foreground", children: "Psicóloga formada pela PUC-SP, acompanho adultos em processos de autoconhecimento e cuidado emocional." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/sobre", className: "mt-6 block text-[13px] font-medium uppercase tracking-widest text-[var(--clay)] underline decoration-[var(--clay)]/30 underline-offset-4", children: "Saiba mais sobre mim" })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalContact, {})
  ] });
}
export {
  PostPage as component
};
