import { V as jsxRuntimeExports } from "./server-BqT9Ay6l.js";
import { c as createLucideIcon, L as Layout, P as PageHero, i as images, E as Eyebrow, a as camila, M as MapPin, F as FinalContact } from "./Primitives-B9O0eYRr.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-YKjFpduk.js";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
      key: "j76jl0"
    }
  ],
  ["path", { d: "M22 10v6", key: "1lu8f3" }],
  ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5", key: "1r8lef" }]
];
const GraduationCap = createLucideIcon("graduation-cap", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
function SobrePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: "Sobre", title: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Uma presença clínica feita de escuta, ética e precisão." }), intro: "Camila Freitas é psicóloga clínica formada pela PUC-SP. Atende adultos em psicoterapia online e presencial na Vila Nova Conceição, em São Paulo.", image: images.life4 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial grid gap-14 md:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Abordagem" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-7 font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[56px]", children: "Um trabalho que não apressa o sujeito." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-[16px] leading-[1.9] text-foreground/78 md:col-span-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A psicoterapia é um espaço para elaborar aquilo que, muitas vezes, aparece como ansiedade, conflito nos vínculos, cansaço emocional ou sensação de repetição." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A condução clínica preserva sigilo, responsabilidade profissional e respeito ao tempo de cada pessoa. Não se trata de aconselhamento rápido, promessa de cura ou roteiro pronto de mudança." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-mist section-pad", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-editorial grid gap-5 md:grid-cols-3", children: [[GraduationCap, "Formação", camila.education], [ShieldCheck, "Registro profissional", camila.crp], [MapPin, "Atendimento", "Online e presencial em São Paulo"]].map(([Icon, title, text]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quiet-card p-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-[var(--clay)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-6 font-serif text-[25px]", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[15px] leading-relaxed text-muted-foreground", children: text })
    ] }, title)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinalContact, {})
  ] });
}
export {
  SobrePage as component
};
