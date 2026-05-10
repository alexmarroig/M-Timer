import { V as jsxRuntimeExports } from "./server-BqT9Ay6l.js";
import { L as Layout, P as PageHero, i as images, b as PrimaryCTA, d as Phone, a as camila, e as Mail, I as Instagram, M as MapPin } from "./Primitives-B9O0eYRr.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-YKjFpduk.js";
function ContatoPage() {
  const links = [[Phone, "WhatsApp", camila.phone, camila.whatsapp], [Mail, "E-mail", camila.email, `mailto:${camila.email}`], [Instagram, "Instagram", camila.instagramHandle, camila.instagram], [MapPin, "Consultório", camila.location, ""]];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: "Contato", title: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Um primeiro contato claro, discreto e cuidadoso." }), intro: "Você pode escrever de forma breve sobre sua busca por terapia. O retorno é pessoal, com informações sobre disponibilidade, valores e possibilidades de atendimento.", image: images.consultorio }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-porcelain section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial grid gap-12 md:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[56px]", children: "Canais diretos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "safe-measure mt-6 text-[15.5px] leading-relaxed text-muted-foreground", children: "Para preservar sua privacidade, prefira WhatsApp ou e-mail. Não é necessário enviar detalhes sensíveis no primeiro contato." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mobile-stack mt-8 flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryCTA, { children: "Enviar mensagem pelo WhatsApp" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quiet-card divide-y divide-border", children: links.map(([Icon, label, value, href]) => {
        const content = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 p-5 sm:p-6 md:grid-cols-[24px_120px_1fr]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-[var(--clay)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-words font-serif text-[20px] leading-tight text-[var(--ink)] sm:text-[22px]", children: value })
        ] });
        return href ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href, target: href.startsWith("http") ? "_blank" : void 0, rel: "noopener noreferrer", className: "block transition-colors hover:bg-[var(--bone)] hover:text-[var(--forest)]", children: content }, label) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: content }, label);
      }) }) })
    ] }) })
  ] });
}
export {
  ContatoPage as component
};
