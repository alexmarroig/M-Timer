import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as Analytics } from "../_libs/vercel__analytics.mjs";
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
const appCss = "/assets/styles-BG060FYE.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$d = createRootRouteWithContext()(
  {
    head: (ctx) => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Encontre acolhimento com a Psicóloga Camila Freitas (PUC-SP). Atendimento especializado em ansiedade, relacionamentos e autoconhecimento. Terapia Online e Presencial na Vila Nova Conceição, SP. Agende sua sessão."
        },
        { name: "author", content: "Camila Freitas" },
        { name: "keywords", content: "psicóloga sao paulo, psicoterapia online, psicóloga vila nova conceição, terapia ansiedade sp, camila freitas psicóloga, psicólogo junguiano sp, atendimento psicoterapêutico especializado" },
        { property: "og:title", content: "Camila Freitas | Psicóloga Clínica em São Paulo e Online" },
        {
          property: "og:image",
          content: "https://psicosite.vercel.app/images/camila-og.png"
        },
        {
          property: "og:description",
          content: "Atendimento psicológico ético e humano na Vila Nova Conceição e Online. Especialista em ansiedade e relacionamentos."
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@psi.cavfreitas" },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        {
          rel: "canonical",
          href: `https://psicamilafreitas.com.br${ctx?.location?.pathname === "/" ? "" : ctx?.location?.pathname || ""}`
        },
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous"
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@300;400;500;600&display=swap"
        }
      ]
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent
  }
);
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "script",
        {
          type: "application/ld+json",
          dangerouslySetInnerHTML: {
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://psicamilafreitas.com.br/#person",
                  "name": "Camila Freitas",
                  "jobTitle": "Psicóloga Clínica",
                  "description": "Psicóloga clínica formada pela PUC-SP com foco em atendimento online e presencial na Vila Nova Conceição, São Paulo.",
                  "url": "https://psicamilafreitas.com.br",
                  "telephone": "+5511943937007",
                  "email": "psi.camilafreitas@gmail.com",
                  "sameAs": [
                    "https://instagram.com/psi.cavfreitas"
                  ],
                  "image": "https://psicosite.vercel.app/images/camila-portrait.jpg"
                },
                {
                  "@type": "MedicalBusiness",
                  "@id": "https://psicamilafreitas.com.br/#organization",
                  "name": "Consultório de Psicologia Camila Freitas",
                  "url": "https://psicamilafreitas.com.br",
                  "logo": "https://psicosite.vercel.app/images/camila-logo.png",
                  "image": "https://psicosite.vercel.app/images/consultorio.jpg",
                  "description": "Atendimento psicológico especializado em ansiedade, relacionamentos e autoconhecimento na Vila Nova Conceição, São Paulo.",
                  "telephone": "+5511943937007",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Vila Nova Conceição",
                    "addressLocality": "São Paulo",
                    "addressRegion": "SP",
                    "postalCode": "04508-030",
                    "addressCountry": "BR"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": -23.5888,
                    "longitude": -46.6667
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      "opens": "08:00",
                      "closes": "21:00"
                    }
                  ],
                  "priceRange": "$$$"
                }
              ]
            })
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Analytics, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$d.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$c = () => import("./sobre-B8XNin_C.mjs");
const Route$c = createFileRoute("/sobre")({
  head: () => ({
    meta: [{
      title: "Sobre Camila Freitas | Psicóloga Clínica PUC-SP na Vila Nova Conceição"
    }, {
      name: "description",
      content: "Conheça a trajetória de Camila Freitas (PUC-SP), Psicóloga com abordagem Junguiana. Atendimento clínico presencial na Vila Nova Conceição, SP e online."
    }, {
      property: "og:title",
      content: "Conheça a Psicóloga Camila Freitas | Formação e Ética Clínica"
    }, {
      property: "og:description",
      content: "Saiba mais sobre o percurso clínico e a formação acadêmica de Camila Freitas na PUC-SP."
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Camila Freitas",
        "jobTitle": "Psicóloga Clínica",
        "description": "Psicóloga clínica formada pela PUC-SP. Especialista em Psicologia Analítica.",
        "url": "https://psicamilafreitas.com.br/sobre",
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "PUC-SP - Pontifícia Universidade Católica de São Paulo"
        },
        "knowsAbout": ["Psicoterapia", "Psicologia Analítica", "Saúde Mental", "Ansiedade", "Relacionamentos"],
        "image": "https://psicosite.vercel.app/images/camila-portrait.jpg"
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./relacionamentos-CyKxvkuS.mjs");
const Route$b = createFileRoute("/relacionamentos")({
  head: () => ({
    meta: [{
      title: "Terapia para Relacionamentos e Conflitos Afetivos | Camila Freitas"
    }, {
      name: "description",
      content: "Psicoterapia focada em vínculos amorosos, familiares e profissionais na Vila Nova Conceição e Online. Compreenda padrões e melhore sua saúde emocional com Camila Freitas."
    }, {
      property: "og:title",
      content: "Terapia para Relacionamentos com Psicóloga Camila Freitas"
    }, {
      property: "og:description",
      content: "Um espaço clínico para olhar vínculos, repetições e formas saudáveis de se relacionar."
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Psicoterapia para Relacionamentos",
        "provider": {
          "@type": "Psychologist",
          "name": "Camila Freitas",
          "url": "https://psicamilafreitas.com.br"
        },
        "areaServed": "São Paulo, Vila Nova Conceição e Online",
        "description": "Atendimento especializado em vínculos afetivos, familiares e profissionais, focado na compreensão de padrões e saúde emocional."
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./psicoterapia-online-XkvF3jv6.mjs");
const Route$a = createFileRoute("/psicoterapia-online")({
  head: () => ({
    meta: [{
      title: "Psicoterapia Online: Atendimento Clínico por Vídeo | Camila Freitas"
    }, {
      name: "description",
      content: "A psicoterapia online funciona? Entenda a eficácia e o sigilo do atendimento por videochamada com a Psicóloga Camila Freitas. Atendimento para brasileiros em todo o mundo."
    }, {
      property: "og:title",
      content: "Psicoterapia Online: Eficácia e Sigilo com Psicóloga Camila Freitas"
    }, {
      property: "og:description",
      content: "Cuidado clínico ético e humano através do atendimento online por vídeo com a mesma qualidade do presencial."
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Psicoterapia Online",
        "provider": {
          "@type": "Psychologist",
          "name": "Camila Freitas",
          "url": "https://psicamilafreitas.com.br"
        },
        "areaServed": "Global (Atendimento para brasileiros em qualquer lugar)",
        "description": "Atendimento psicoterapêutico por videochamada com garantia de sigilo profissional e ética clínica."
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./privacidade-DZMpJjux.mjs");
const Route$9 = createFileRoute("/privacidade")({
  head: () => ({
    meta: [{
      title: "Privacidade e Ética Clínica | Psicóloga Camila Freitas"
    }, {
      name: "description",
      content: "Saiba como seus dados são tratados com ética e sigilo. Política de privacidade em conformidade com a LGPD e o Código de Ética do Psicólogo."
    }, {
      property: "og:title",
      content: "Privacidade e Ética | Camila Freitas"
    }, {
      property: "og:description",
      content: "Compromisso com o sigilo e a proteção de dados na clínica."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const q$3 = "Como funciona o primeiro contato?";
const a$3 = "Você pode enviar uma mensagem pelo WhatsApp ou e-mail. Responderei pessoalmente com informações sobre horários, valores e o formato inicial de acolhimento.";
const contato = {
  q: q$3,
  a: a$3
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  a: a$3,
  default: contato,
  q: q$3
}, Symbol.toStringTag, { value: "Module" }));
const q$2 = "Atende por convênio médico?";
const a$2 = "O atendimento é particular, o que garante maior autonomia e sigilo no processo clínico. No entanto, emito recibos para que você possa solicitar o reembolso junto ao seu plano de saúde.";
const convenio = {
  q: q$2,
  a: a$2
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  a: a$2,
  default: convenio,
  q: q$2
}, Symbol.toStringTag, { value: "Module" }));
const q$1 = "Qual a duração de cada atendimento?";
const a$1 = "Cada sessão individual de psicoterapia tem duração de 50 minutos, tempo dedicado à escuta qualificada e ao trabalho clínico.";
const duracao = {
  q: q$1,
  a: a$1
};
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  a: a$1,
  default: duracao,
  q: q$1
}, Symbol.toStringTag, { value: "Module" }));
const q = "Qual a frequência das sessões?";
const a = "A regularidade é fundamental para o processo terapêutico. Geralmente os encontros ocorrem uma vez por semana, no mesmo dia e horário, criando um espaço de continuidade.";
const frequencia = {
  q,
  a
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  a,
  default: frequencia,
  q
}, Symbol.toStringTag, { value: "Module" }));
const label$3 = "Ansiedade";
const title$9 = "Ansiedade não é só excesso de pensamento.";
const description$3 = "Quando o pensamento corre mais rápido do que a vida consegue acompanhar.";
const image$3 = "/images/services/ansiedade.jpg";
const to$3 = "/ansiedade";
const ansiedade = {
  label: label$3,
  title: title$9,
  description: description$3,
  image: image$3,
  to: to$3
};
const __vite_glob_1_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ansiedade,
  description: description$3,
  image: image$3,
  label: label$3,
  title: title$9,
  to: to$3
}, Symbol.toStringTag, { value: "Module" }));
const label$2 = "Autoconhecimento";
const title$8 = "Autoconhecimento exige presença, não performance.";
const description$2 = "Um percurso para compreender a própria história com mais honestidade e menos cobrança.";
const image$2 = "/images/services/autoconhecimento.jpg";
const to$2 = "/autoconhecimento";
const autoconhecimento = {
  label: label$2,
  title: title$8,
  description: description$2,
  image: image$2,
  to: to$2
};
const __vite_glob_1_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: autoconhecimento,
  description: description$2,
  image: image$2,
  label: label$2,
  title: title$8,
  to: to$2
}, Symbol.toStringTag, { value: "Module" }));
const label$1 = "Psicoterapia Online";
const title$7 = "A escuta clínica não apressa o sujeito.";
const description$1 = "Atendimento sigiloso e ético por videochamada para brasileiros em qualquer lugar.";
const image$1 = "/images/services/online.jpg";
const to$1 = "/psicoterapia-online";
const online = {
  label: label$1,
  title: title$7,
  description: description$1,
  image: image$1,
  to: to$1
};
const __vite_glob_1_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: online,
  description: description$1,
  image: image$1,
  label: label$1,
  title: title$7,
  to: to$1
}, Symbol.toStringTag, { value: "Module" }));
const label = "Relacionamentos";
const title$6 = "Vínculos também contam histórias.";
const description = "Um espaço para olhar para as formas de se relacionar e o que se repete nos encontros.";
const image = "/images/services/relacionamentos.jpg";
const to = "/relacionamentos";
const relacionamentos = {
  label,
  title: title$6,
  description,
  image,
  to
};
const __vite_glob_1_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: relacionamentos,
  description,
  image,
  label,
  title: title$6,
  to
}, Symbol.toStringTag, { value: "Module" }));
const slug$4 = "ansiedade-quando-buscar-ajuda";
const title$5 = "Ansiedade: quando buscar acompanhamento profissional?";
const excerpt$4 = "A ansiedade faz parte da vida, mas quando ela paralisa, é hora de olhar com cuidado. Saiba diferenciar a preocupação normal do transtorno.";
const category$4 = "Ansiedade";
const date$4 = "2024-05-12";
const coverImage$4 = "/images/blog/ansiedade-ajuda.jpg";
const seoTitle$4 = "Sinais de ansiedade excessiva: quando procurar psicólogo | Camila Freitas";
const seoDescription$4 = "Aprenda a identificar quando a ansiedade deixa de ser uma reação natural e passa a exigir tratamento profissional especializado.";
const index$4 = {
  slug: slug$4,
  title: title$5,
  excerpt: excerpt$4,
  category: category$4,
  date: date$4,
  coverImage: coverImage$4,
  seoTitle: seoTitle$4,
  seoDescription: seoDescription$4
};
const __vite_glob_2_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  category: category$4,
  coverImage: coverImage$4,
  date: date$4,
  default: index$4,
  excerpt: excerpt$4,
  seoDescription: seoDescription$4,
  seoTitle: seoTitle$4,
  slug: slug$4,
  title: title$5
}, Symbol.toStringTag, { value: "Module" }));
const slug$3 = "expectativas-inicio-terapia";
const title$4 = "O que esperar do início do atendimento psicológico?";
const excerpt$3 = "A primeira sessão costuma gerar ansiedade. Entenda como funciona o acolhimento inicial e o estabelecimento do vínculo terapêutico.";
const category$3 = "Clínica";
const date$3 = "2024-05-11";
const coverImage$3 = "/images/blog/inicio-terapia.jpg";
const seoTitle$3 = "Como funciona a primeira sessão de terapia? | Psicóloga Camila Freitas";
const seoDescription$3 = "Tire suas dúvidas sobre o início do processo terapêutico. Saiba o que acontece nos primeiros encontros e como o vínculo é construído.";
const index$3 = {
  slug: slug$3,
  title: title$4,
  excerpt: excerpt$3,
  category: category$3,
  date: date$3,
  coverImage: coverImage$3,
  seoTitle: seoTitle$3,
  seoDescription: seoDescription$3
};
const __vite_glob_2_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  category: category$3,
  coverImage: coverImage$3,
  date: date$3,
  default: index$3,
  excerpt: excerpt$3,
  seoDescription: seoDescription$3,
  seoTitle: seoTitle$3,
  slug: slug$3,
  title: title$4
}, Symbol.toStringTag, { value: "Module" }));
const slug$2 = "hora-de-procurar-psicoterapia";
const title$3 = "Como saber se está na hora de procurar psicoterapia?";
const excerpt$2 = "Muitas vezes esperamos uma crise para buscar ajuda. Saiba identificar os sinais sutis de que a terapia pode ser um suporte valioso agora.";
const category$2 = "Autoconhecimento";
const date$2 = "2024-05-10";
const coverImage$2 = "/images/blog/hora-terapia.jpg";
const seoTitle$2 = "Quando procurar psicoterapia? Sinais e orientações | Camila Freitas";
const seoDescription$2 = "Não espere uma crise para cuidar da sua saúde mental. Conheça os sinais de que é o momento ideal para iniciar um processo de psicoterapia.";
const index$2 = {
  slug: slug$2,
  title: title$3,
  excerpt: excerpt$2,
  category: category$2,
  date: date$2,
  coverImage: coverImage$2,
  seoTitle: seoTitle$2,
  seoDescription: seoDescription$2
};
const __vite_glob_2_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  category: category$2,
  coverImage: coverImage$2,
  date: date$2,
  default: index$2,
  excerpt: excerpt$2,
  seoDescription: seoDescription$2,
  seoTitle: seoTitle$2,
  slug: slug$2,
  title: title$3
}, Symbol.toStringTag, { value: "Module" }));
const slug$1 = "terapia-nos-relacionamentos";
const title$2 = "Como a psicoterapia pode ajudar nos relacionamentos?";
const excerpt$1 = "Nossos vínculos afetivos e familiares são espelhos de quem somos. A terapia ajuda a desatar nós e construir relações mais saudáveis.";
const category$1 = "Relacionamentos";
const date$1 = "2024-05-13";
const coverImage$1 = "/images/blog/relacionamentos.jpg";
const seoTitle$1 = "Psicoterapia e Relacionamentos: como melhorar seus vínculos | Camila Freitas";
const seoDescription$1 = "Entenda como o autoconhecimento impacta suas relações amorosas e familiares, ajudando a quebrar padrões e melhorar a comunicação.";
const index$1 = {
  slug: slug$1,
  title: title$2,
  excerpt: excerpt$1,
  category: category$1,
  date: date$1,
  coverImage: coverImage$1,
  seoTitle: seoTitle$1,
  seoDescription: seoDescription$1
};
const __vite_glob_2_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  category: category$1,
  coverImage: coverImage$1,
  date: date$1,
  default: index$1,
  excerpt: excerpt$1,
  seoDescription: seoDescription$1,
  seoTitle: seoTitle$1,
  slug: slug$1,
  title: title$2
}, Symbol.toStringTag, { value: "Module" }));
const slug = "terapia-online-funciona";
const title$1 = "Terapia online funciona?";
const excerpt = "A modalidade online se tornou comum, mas as dúvidas persistem. Conheça as vantagens e a eficácia comprovada do atendimento por vídeo.";
const category = "Psicoterapia Online";
const date = "2024-05-14";
const coverImage = "/images/blog/terapia-online.jpg";
const seoTitle = "Terapia online é eficaz? Vantagens e como funciona | Camila Freitas";
const seoDescription = "Descubra por que a psicoterapia online tem a mesma eficácia do presencial e como ela pode se adaptar perfeitamente à sua rotina.";
const index = {
  slug,
  title: title$1,
  excerpt,
  category,
  date,
  coverImage,
  seoTitle,
  seoDescription
};
const __vite_glob_2_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  category,
  coverImage,
  date,
  default: index,
  excerpt,
  seoDescription,
  seoTitle,
  slug,
  title: title$1
}, Symbol.toStringTag, { value: "Module" }));
const brandLogoHorizontal = "/assets/camila-freitas-logo-horizontal-BoMXHjV6.png";
const brandLogoVertical = "/assets/camila-freitas-logo-vertical-WqIDfVRZ.png";
const portrait = "/assets/camila-freitas-portrait-B4Jm-5zo.png";
const consultorio = "/assets/consultorio-CbxWSBKn.jpg";
const life1 = "/assets/lifestyle-1-B0vapugc.jpg";
const life2 = "/assets/lifestyle-2-vU5GcJUb.jpg";
const life3 = "/assets/lifestyle-3-DCKxnra8.jpg";
const life4 = "/assets/lifestyle-4-DKRwYJ50.jpg";
const name = "Camila Freitas";
const brandedName = "Psicóloga Camila Freitas";
const crp = "CRP 06/201444";
const education = "PUC-SP";
const approach = "Psicologia Analítica (Junguiana)";
const phone = "(11) 94393-7007";
const whatsapp = "https://wa.me/5511943937007?text=Ol%C3%A1%2C%20Camila.%20Gostaria%20de%20agendar%20uma%20primeira%20conversa.";
const email = "psi.camilafreitas@gmail.com";
const instagram = "https://instagram.com/psi.cavfreitas";
const instagramHandle = "@psi.cavfreitas";
const location = "Vila Nova Conceição, São Paulo - SP";
const globalData = {
  name,
  brandedName,
  crp,
  education,
  approach,
  phone,
  whatsapp,
  email,
  instagram,
  instagramHandle,
  location
};
const heroHeadline = "Psicoterapia em São Paulo e Online: Escuta Ética e Presença Clínica.";
const homepageData = {
  heroHeadline
};
const title = "Reflexões sobre a clínica e o cotidiano.";
const posts = [{ "title": "Ansiedade não é só excesso de pensamento.", "tag": "Psicoterapia", "label": "reflexão", "image": "/images/instagram/ansiedade.jpg", "url": "https://instagram.com/psi.cavfreitas" }, { "title": "Vínculos também contam histórias.", "tag": "Relacionamentos", "label": "clínica", "image": "/images/instagram/vinculos.jpg", "url": "https://instagram.com/psi.cavfreitas" }, { "title": "A escuta clínica não apressa o sujeito.", "tag": "Ética Profissional", "label": "percurso", "image": "/images/instagram/escuta.jpg", "url": "https://instagram.com/psi.cavfreitas" }, { "title": "Autoconhecimento exige presença, não performance.", "tag": "Saúde Mental", "label": "cotidiano", "image": "/images/instagram/autoconhecimento.jpg", "url": "https://instagram.com/psi.cavfreitas" }];
const instagramCuratedData = {
  title,
  posts
};
const faqFiles = /* @__PURE__ */ Object.assign({ "../../content/faq/contato.json": __vite_glob_0_0, "../../content/faq/convenio.json": __vite_glob_0_1, "../../content/faq/duracao.json": __vite_glob_0_2, "../../content/faq/frequencia.json": __vite_glob_0_3 });
const serviceFiles = /* @__PURE__ */ Object.assign({ "../../content/services/ansiedade.json": __vite_glob_1_0, "../../content/services/autoconhecimento.json": __vite_glob_1_1, "../../content/services/online.json": __vite_glob_1_2, "../../content/services/relacionamentos.json": __vite_glob_1_3 });
const blogFiles = /* @__PURE__ */ Object.assign({ "../../content/blog/ansiedade-quando-buscar-ajuda/index.json": __vite_glob_2_0, "../../content/blog/expectativas-inicio-terapia/index.json": __vite_glob_2_1, "../../content/blog/hora-de-procurar-psicoterapia/index.json": __vite_glob_2_2, "../../content/blog/terapia-nos-relacionamentos/index.json": __vite_glob_2_3, "../../content/blog/terapia-online-funciona/index.json": __vite_glob_2_4 });
const camila = globalData;
const homepage = homepageData;
const images = {
  consultorio,
  portrait,
  logoHorizontal: brandLogoHorizontal,
  logoVertical: brandLogoVertical,
  life1,
  life2,
  life3,
  life4
};
const serviceAreas = Object.values(serviceFiles).map((f) => f.default);
const faqs = Object.values(faqFiles).map((f) => f.default);
const articles = Object.values(blogFiles).map((f) => f.default);
const instagramTiles = instagramCuratedData.posts.map((post) => ({
  title: post.title,
  tag: post.tag || post.title.split(" ").pop()?.replace(".", "") || "Psicologia",
  caption: post.caption,
  label: post.label,
  image: post.image,
  url: post.url
}));
const instagramSection = {
  title: instagramCuratedData.title
};
const whatsappMessages = {
  default: "Olá Psicóloga Camila Freitas, vim do site e gostaria de agendar minha primeira sessão de psicoterapia.",
  online: "Olá Psicóloga Camila Freitas, vi seu site sobre psicoterapia online e gostaria de agendar uma primeira sessão por vídeo.",
  ansiedade: "Olá Psicóloga Camila Freitas, li sobre seu trabalho com ansiedade e gostaria de agendar um primeiro encontro para conversarmos.",
  relacionamentos: "Olá Psicóloga Camila Freitas, vi seu trabalho sobre relacionamentos e vínculos. Gostaria de agendar uma sessão de psicoterapia.",
  autoconhecimento: "Olá Psicóloga Camila Freitas, vi seu trabalho focado em autoconhecimento e gostaria de iniciar um percurso clínico com você.",
  contato: "Olá Psicóloga Camila Freitas, estou entrando em contato através da sua página de contato e gostaria de mais informações sobre as sessões.",
  faq: "Olá Psicóloga Camila Freitas, li suas dúvidas frequentes no site e gostaria de conversar sobre o início do meu processo terapêutico.",
  instagram: "Olá Camila, te acompanho no Instagram e agora vim pelo site para agendar uma primeira sessão de psicoterapia.",
  google: "Olá Psicóloga Camila Freitas, te encontrei no Google e gostaria de agendar um primeiro contato para psicoterapia.",
  ansiedade_sp: "Olá Psicóloga Camila Freitas, busco atendimento especializado em ansiedade na Vila Nova Conceição. Gostaria de agendar um horário.",
  blog: (title2) => `Olá Psicóloga Camila Freitas, li seu artigo sobre "${title2}" e senti que é o momento de buscar ajuda profissional. Gostaria de agendar uma sessão.`
};
const getWhatsAppLink = (messageKey) => {
  const phone2 = camila.phone.replace(/\D/g, "");
  let text = "";
  if (typeof messageKey === "string" && whatsappMessages[messageKey]) {
    const val = whatsappMessages[messageKey];
    text = typeof val === "function" ? val("") : val;
  } else {
    text = messageKey;
  }
  return `https://wa.me/55${phone2}?text=${encodeURIComponent(text)}`;
};
const $$splitComponentImporter$8 = () => import("./faq-CHawpC2p.mjs");
const Route$8 = createFileRoute("/faq")({
  head: () => ({
    meta: [{
      title: "Dúvidas sobre Terapia: Preço, Frequência e Sigilo | Camila Freitas"
    }, {
      name: "description",
      content: "Encontre respostas para as principais dúvidas sobre psicoterapia: valores, frequência, sigilo, reembolso e atendimento online com Camila Freitas (PUC-SP)."
    }, {
      property: "og:title",
      content: "Perguntas Frequentes sobre Terapia | Psicóloga Camila Freitas"
    }, {
      property: "og:description",
      content: "Respostas claras e éticas sobre o funcionamento da clínica psicológica."
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./depressao-B_KxDT_R.mjs");
const Route$7 = createFileRoute("/depressao")({
  head: () => ({
    meta: [{
      title: "Terapia para depressão | Psicóloga Camila Freitas em São Paulo e online"
    }, {
      name: "description",
      content: "Acompanhamento psicológico para depressão, sofrimento persistente, desânimo, isolamento e cansaço emocional com a Psicóloga Camila Freitas."
    }, {
      property: "og:title",
      content: "Terapia para depressão"
    }, {
      property: "og:description",
      content: "Um espaço clínico para escutar sofrimento persistente, perda de sentido, isolamento e cansaço emocional."
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Psicoterapia para Depressão",
        "provider": {
          "@type": "Psychologist",
          "name": "Camila Freitas",
          "url": "https://psicamilafreitas.com.br"
        },
        "areaServed": "São Paulo, Vila Nova Conceição e Online",
        "description": "Acompanhamento psicológico especializado para depressão, desânimo persistente e sofrimento emocional com ética e cuidado clínico."
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./contato-n6ltApNv.mjs");
const Route$6 = createFileRoute("/contato")({
  head: () => ({
    meta: [{
      title: "Agendar Terapia em São Paulo (Vila Nova Conceição) | Camila Freitas"
    }, {
      name: "description",
      content: "Inicie seu processo terapêutico com a Psicóloga Camila Freitas (PUC-SP). Agende sua sessão presencial na Vila Nova Conceição ou Online via WhatsApp, e-mail ou formulário."
    }, {
      property: "og:title",
      content: "Agende sua Consulta com Psicóloga Camila Freitas"
    }, {
      property: "og:description",
      content: "WhatsApp, e-mail e formulário direto para agendamento de psicoterapia presencial e online."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./como-funciona-CdvJ2mss.mjs");
const Route$5 = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [{
      title: "Como Funciona a Terapia? Sessões e Primeiro Contato | Camila Freitas"
    }, {
      name: "description",
      content: "Entenda o passo a passo para iniciar sua psicoterapia com Camila Freitas (PUC-SP). Saiba sobre o primeiro contato, frequência semanal e o que esperar da primeira sessão."
    }, {
      property: "og:title",
      content: "Como funciona a psicoterapia com Psicóloga Camila Freitas"
    }, {
      property: "og:description",
      content: "Um processo claro, ético e sem pressão para iniciar sua jornada de cuidado emocional."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./autoconhecimento-DR4jUKyf.mjs");
const Route$4 = createFileRoute("/autoconhecimento")({
  head: () => ({
    meta: [{
      title: "Psicoterapia para Autoconhecimento e Saúde Mental | Camila Freitas"
    }, {
      name: "description",
      content: "Inicie um percurso clínico de autoconhecimento e elaboração emocional na Vila Nova Conceição ou Online. Atendimento com a Psicóloga Camila Freitas (PUC-SP)."
    }, {
      property: "og:title",
      content: "Autoconhecimento e Psicoterapia com Psicóloga Camila Freitas"
    }, {
      property: "og:description",
      content: "Um percurso clínico para compreender a própria história com honestidade, ética e responsabilidade."
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Psicoterapia para Autoconhecimento",
        "provider": {
          "@type": "Psychologist",
          "name": "Camila Freitas",
          "url": "https://psicamilafreitas.com.br"
        },
        "areaServed": "São Paulo, Vila Nova Conceição e Online",
        "description": "Percurso clínico de autoconhecimento focado na elaboração de escolhas, desejos e padrões emocionais."
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./ansiedade-D3s0b42K.mjs");
const Route$3 = createFileRoute("/ansiedade")({
  head: () => ({
    meta: [{
      title: "Terapia para Ansiedade em São Paulo (Vila Nova Conceição) | Camila Freitas"
    }, {
      name: "description",
      content: "Tratamento especializado para ansiedade, pânico e estresse crônico. Atendimento psicológico com Camila Freitas (PUC-SP) na Vila Nova Conceição e Online."
    }, {
      property: "og:title",
      content: "Terapia para Ansiedade com Psicóloga Camila Freitas"
    }, {
      property: "og:description",
      content: "Acolhimento clínico ético para sintomas ansiosos, crises de pânico e sobrecarga emocional."
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Psicoterapia para Ansiedade",
        "provider": {
          "@type": "Psychologist",
          "name": "Camila Freitas",
          "url": "https://psicamilafreitas.com.br"
        },
        "areaServed": "São Paulo, Vila Nova Conceição e Online",
        "description": "Tratamento especializado para sintomas ansiosos, crises de pânico e sobrecarga emocional com abordagem ética e profissional."
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-LSQ2Efxj.mjs");
const Route$2 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Psicóloga Camila Freitas | Psicoterapia em São Paulo (Vila Nova Conceição) e Online"
    }, {
      name: "description",
      content: "Encontre acolhimento com a Psicóloga Camila Freitas (PUC-SP). Psicoterapia online e presencial na Vila Nova Conceição. Especialista em ansiedade, relacionamentos e autoconhecimento."
    }, {
      property: "og:title",
      content: "Camila Freitas | Psicóloga Clínica em São Paulo e Online"
    }, {
      property: "og:description",
      content: "Atendimento psicológico ético e humano na Vila Nova Conceição e online."
    }, {
      property: "og:type",
      content: "website"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./blog.index-CCvwXobN.mjs");
const Route$1 = createFileRoute("/blog/")({
  head: () => ({
    meta: [{
      title: "Blog de Psicologia: Reflexões e Saúde Mental | Camila Freitas"
    }, {
      name: "description",
      content: "Explore artigos sobre ansiedade, relacionamentos, autoconhecimento e o cotidiano clínico. Reflexões da Psicóloga Camila Freitas (PUC-SP) para uma leitura consciente."
    }, {
      property: "og:title",
      content: "Blog de Psicologia | Reflexões de Camila Freitas"
    }, {
      property: "og:description",
      content: "Conteúdo editorial ético sobre psicologia, saúde mental e o percurso terapêutico."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./blog._slug-Cdh7yiPK.mjs");
const Route = createFileRoute("/blog/$slug")({
  loader: ({
    params
  }) => {
    const article = articles.find((a2) => a2.slug === params.slug);
    if (!article) throw new Error("Artigo não encontrado");
    return {
      article
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: `${loaderData?.article.seoTitle || loaderData?.article.title} | Camila Freitas`
    }, {
      name: "description",
      content: loaderData?.article.seoDescription || loaderData?.article.excerpt
    }, {
      property: "og:title",
      content: loaderData?.article.title
    }, {
      property: "og:image",
      content: loaderData?.article.coverImage
    }, {
      property: "og:type",
      content: "article"
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": loaderData?.article.title,
        "image": loaderData?.article.coverImage,
        "datePublished": loaderData?.article.date,
        "author": {
          "@type": "Person",
          "name": "Camila Freitas",
          "url": "https://psicamilafreitas.com.br/sobre"
        },
        "description": loaderData?.article.excerpt
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SobreRoute = Route$c.update({
  id: "/sobre",
  path: "/sobre",
  getParentRoute: () => Route$d
});
const RelacionamentosRoute = Route$b.update({
  id: "/relacionamentos",
  path: "/relacionamentos",
  getParentRoute: () => Route$d
});
const PsicoterapiaOnlineRoute = Route$a.update({
  id: "/psicoterapia-online",
  path: "/psicoterapia-online",
  getParentRoute: () => Route$d
});
const PrivacidadeRoute = Route$9.update({
  id: "/privacidade",
  path: "/privacidade",
  getParentRoute: () => Route$d
});
const FaqRoute = Route$8.update({
  id: "/faq",
  path: "/faq",
  getParentRoute: () => Route$d
});
const DepressaoRoute = Route$7.update({
  id: "/depressao",
  path: "/depressao",
  getParentRoute: () => Route$d
});
const ContatoRoute = Route$6.update({
  id: "/contato",
  path: "/contato",
  getParentRoute: () => Route$d
});
const ComoFuncionaRoute = Route$5.update({
  id: "/como-funciona",
  path: "/como-funciona",
  getParentRoute: () => Route$d
});
const AutoconhecimentoRoute = Route$4.update({
  id: "/autoconhecimento",
  path: "/autoconhecimento",
  getParentRoute: () => Route$d
});
const AnsiedadeRoute = Route$3.update({
  id: "/ansiedade",
  path: "/ansiedade",
  getParentRoute: () => Route$d
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$d
});
const BlogIndexRoute = Route$1.update({
  id: "/blog/",
  path: "/blog/",
  getParentRoute: () => Route$d
});
const BlogSlugRoute = Route.update({
  id: "/blog/$slug",
  path: "/blog/$slug",
  getParentRoute: () => Route$d
});
const rootRouteChildren = {
  IndexRoute,
  AnsiedadeRoute,
  AutoconhecimentoRoute,
  ComoFuncionaRoute,
  ContatoRoute,
  DepressaoRoute,
  FaqRoute,
  PrivacidadeRoute,
  PsicoterapiaOnlineRoute,
  RelacionamentosRoute,
  SobreRoute,
  BlogSlugRoute,
  BlogIndexRoute
};
const routeTree = Route$d._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route as R,
  articles as a,
  instagramSection as b,
  camila as c,
  instagramTiles as d,
  faqs as f,
  getWhatsAppLink as g,
  homepage as h,
  images as i,
  router as r,
  serviceAreas as s
};
