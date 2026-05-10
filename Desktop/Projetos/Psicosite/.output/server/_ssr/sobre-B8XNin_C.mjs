import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Layout, P as PageHero, E as Eyebrow, F as FinalContact } from "./Layout-D7gehF66.mjs";
import { i as images, c as camila } from "./router-k3VwZQIo.mjs";
import { G as GraduationCap, S as ShieldCheck, M as MapPin, a as Sparkles } from "../_libs/lucide-react.mjs";
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
function SobrePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: "Sobre a Psicóloga Camila Freitas", title: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Uma presença clínica feita de escuta, ética e precisão." }), intro: "Camila Freitas é psicóloga clínica formada pela PUC-SP. Atende adultos em psicoterapia online e presencial na Vila Nova Conceição, em São Paulo.", image: images.portrait, alt: "Retrato profissional da Psicóloga Camila Freitas (PUC-SP) em seu consultório" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial grid gap-14 md:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Abordagem" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-7 font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[56px]", children: "Um trabalho que não apressa o sujeito." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-[16px] leading-[1.9] text-foreground/78 md:col-span-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Olá, muito prazer. Sou Camila Freitas, psicóloga formada pela PUC-SP. Minha escuta se orienta pela Psicologia Analítica (Junguiana), pelo sigilo profissional e pela singularidade de cada história." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Em 2024 fundei meu consultório em São Paulo, localizado na Vila Nova Conceição, onde realizo atendimentos presenciais. Também atendo online, mantendo a mesma responsabilidade clínica e cuidado com o enquadre." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A psicoterapia pode acolher questões como ansiedade, depressão, sofrimento emocional recorrente, relacionamentos, dependências, violência doméstica, saúde mental, psicodiagnóstico e autoconhecimento. O processo não promete cura ou respostas prontas: ele cria espaço para elaboração." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-mist section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-editorial grid gap-5 md:grid-cols-4", children: [[GraduationCap, "Formação", camila.education], [ShieldCheck, "Registro profissional", camila.crp], [MapPin, "Atendimento", "Online e presencial em São Paulo"], [Sparkles, "Abordagem", camila.approach]].map(([Icon, title, text]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quiet-card p-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-[var(--clay)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-6 font-serif text-[25px]", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[15px] leading-relaxed text-muted-foreground", children: text })
    ] }, title)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-forest section-pad text-[var(--ivory)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial max-w-4xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--ivory)]/72", children: "Referência" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "mt-8 font-serif text-[34px] leading-tight sm:text-[44px] md:text-[58px]", children: [
        "Quem olha para fora, sonha. Quem olha para dentro, desperta.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("cite", { className: "mt-6 block text-[12px] not-italic uppercase tracking-[0.24em] text-[var(--ivory)]/52", children: "Carl G. Jung" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalContact, {})
  ] });
}
export {
  SobrePage as component
};
