import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Layout, P as PageHero, F as FinalContact } from "./Layout-D7gehF66.mjs";
import { i as images, f as faqs } from "./router-k3VwZQIo.mjs";
import { P as Plus } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function FAQPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: "FAQ", title: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Perguntas frequentes, respondidas com clareza." }), intro: "Algumas dúvidas aparecem antes do primeiro contato. Reuni respostas objetivas para ajudar você a decidir com tranquilidade.", image: images.life1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-editorial max-w-4xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quiet-card divide-y divide-border p-4 sm:p-8", children: faqs.map((faq) => /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "flex cursor-pointer list-none items-start justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-[21px] leading-tight text-[var(--ink)] sm:text-[23px]", children: faq.q }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mt-1 h-5 w-5 shrink-0 text-[var(--forest)] transition-transform group-open:rotate-45" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted-foreground", children: faq.a })
    ] }, faq.q)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalContact, {})
  ] });
}
export {
  FAQPage as component
};
