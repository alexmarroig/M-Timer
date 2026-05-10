import { V as jsxRuntimeExports } from "./server-BqT9Ay6l.js";
import { L as Layout, P as PageHero, i as images, f as faqs, F as FinalContact } from "./Primitives-B9O0eYRr.js";
import { P as Plus } from "./plus-Cfa5ZVF9.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-YKjFpduk.js";
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
