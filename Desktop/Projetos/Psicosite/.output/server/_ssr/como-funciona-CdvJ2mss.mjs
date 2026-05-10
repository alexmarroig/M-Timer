import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Layout, P as PageHero, F as FinalContact } from "./Layout-D7gehF66.mjs";
import { i as images } from "./router-k3VwZQIo.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
function ComoFuncionaPage() {
  const steps = [["1. Contato inicial", "Você envia uma mensagem pelo WhatsApp ou e-mail. A resposta é pessoal, com informações sobre disponibilidade, valores e formato."], ["2. Primeira sessão", "O encontro inicial é dedicado a compreender sua busca, seu momento de vida e a possibilidade de seguirmos em acompanhamento."], ["3. Regularidade", "As sessões costumam ter 50 minutos e frequência semanal, online por videochamada ou presencialmente em São Paulo."], ["4. Processo", "A continuidade é construída no encontro clínico, sem promessas de cura, sem urgência artificial e sem roteiro padronizado."]];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: "Como funciona", title: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Um começo simples, com a seriedade que a clínica pede." }), intro: "A entrada em psicoterapia pode ser objetiva e cuidadosa. O essencial é preservar clareza, sigilo e respeito ao tempo de cada pessoa.", image: images.consultorio }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-24 md:py-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-editorial grid gap-px bg-border md:grid-cols-2", children: steps.map(([title, text]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "bg-[var(--ivory)] p-8 md:p-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-[28px]", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[15.5px] leading-relaxed text-muted-foreground", children: text })
      ] }, title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-editorial mt-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[15px] text-muted-foreground", children: [
        "Tem dúvidas sobre o que esperar? Leia: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/blog/expectativas-inicio-terapia", className: "underline hover:text-[var(--forest)] transition-colors", children: "O que esperar do início da psicoterapia?" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalContact, {})
  ] });
}
export {
  ComoFuncionaPage as component
};
