import { r as reactExports, V as jsxRuntimeExports } from "./server-BqT9Ay6l.js";
import { L as Link } from "./router-YKjFpduk.js";
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$6 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$6);
const __iconNode$5 = [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "2e1cvw" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "9exkf1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "r4j83e" }]
];
const Instagram = createLucideIcon("instagram", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M4 5h16", key: "1tepv9" }],
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 19h16", key: "1djgab" }]
];
const Menu = createLucideIcon("menu", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const consultorio = "/assets/consultorio-CbxWSBKn.jpg";
const life1 = "/assets/lifestyle-1-B0vapugc.jpg";
const life2 = "/assets/lifestyle-2-vU5GcJUb.jpg";
const life3 = "/assets/lifestyle-3-DCKxnra8.jpg";
const life4 = "/assets/lifestyle-4-DKRwYJ50.jpg";
const camila = {
  crp: "CRP 06/201444",
  education: "PUC-SP",
  phone: "(11) 94393-7007",
  whatsapp: "https://wa.me/5511943937007?text=Ol%C3%A1%2C%20Camila.%20Gostaria%20de%20agendar%20uma%20conversa%20inicial.",
  email: "psi.camilafreitas@gmail.com",
  instagram: "https://instagram.com/psi.cavfreitas",
  instagramHandle: "@psi.cavfreitas",
  location: "Vila Nova Conceição, São Paulo - SP"
};
const images = {
  consultorio,
  life1,
  life2,
  life3,
  life4
};
const serviceAreas = [
  {
    to: "/psicoterapia-online",
    label: "Psicoterapia online",
    title: "Terapia online para adultos",
    description: "Atendimento por videochamada, com sigilo, regularidade e cuidado clínico.",
    image: life4
  },
  {
    to: "/ansiedade",
    label: "Ansiedade",
    title: "Quando o pensamento não desacelera",
    description: "Um espaço para compreender sintomas ansiosos, sobrecarga e exigências internas.",
    image: life1
  },
  {
    to: "/relacionamentos",
    label: "Relacionamentos",
    title: "Vínculos que pedem mais presença",
    description: "Reflexão clínica sobre relações afetivas, familiares e profissionais.",
    image: life3
  },
  {
    to: "/autoconhecimento",
    label: "Autoconhecimento",
    title: "Compreender quem se é",
    description: "Um percurso para elaborar escolhas, desejos, repetições e formas de existir.",
    image: life2
  }
];
const faqs = [
  {
    q: "Como funciona a psicoterapia online?",
    a: "As sessões acontecem por videochamada, em plataforma segura. É importante estar em um local reservado, com boa conexão e privacidade para falar."
  },
  {
    q: "Você atende presencialmente?",
    a: "Sim. O atendimento presencial acontece em consultório na Vila Nova Conceição, em São Paulo, com horários combinados previamente."
  },
  {
    q: "Qual é a duração e frequência das sessões?",
    a: "Em geral, os encontros têm 50 minutos e frequência semanal. A continuidade é conversada a partir da necessidade clínica de cada pessoa."
  },
  {
    q: "Quando procurar terapia?",
    a: "A terapia pode ser procurada quando algo na vida emocional, nos vínculos ou nas escolhas começa a pedir mais escuta. Não é preciso esperar uma crise."
  },
  {
    q: "Como saber valores e disponibilidade?",
    a: "Valores e horários são informados no primeiro contato, com transparência, por WhatsApp ou e-mail."
  },
  {
    q: "O atendimento promete resultados?",
    a: "Não. A psicoterapia é um processo ético e singular. Ela não trabalha com promessas de cura, prazos artificiais ou garantias de resultado."
  }
];
const articles = [
  {
    slug: "escuta-clinica-cuidado-emocional",
    title: "O lugar da escuta no cuidado emocional",
    excerpt: "O que diferencia uma escuta clínica de uma conversa cotidiana e por que isso importa.",
    category: "Clínica",
    image: life2
  },
  {
    slug: "ansiedade-contemporanea",
    title: "Ansiedade contemporânea: nomear para elaborar",
    excerpt: "Notas sobre pressa, exigência, corpo e pensamento acelerado.",
    category: "Ansiedade",
    image: life1
  },
  {
    slug: "relacoes-que-pedem-presenca",
    title: "Relações que pedem mais presença",
    excerpt: "Vínculos afetivos no tempo da hiperconexão, da pressa e da imagem.",
    category: "Relacionamentos",
    image: life3
  }
];
const instagramTiles = [
  {
    title: "Ansiedade não é só excesso de pensamento.",
    tag: "Ansiedade",
    image: life1
  },
  {
    title: "Vínculos também contam histórias.",
    tag: "Relações",
    image: life3
  },
  {
    title: "A escuta clínica não apressa o sujeito.",
    tag: "Clínica",
    image: consultorio
  },
  {
    title: "Autoconhecimento exige presença, não performance.",
    tag: "Autoconhecimento",
    image: life2
  }
];
const nav = [
  { to: "/sobre", label: "Sobre" },
  { to: "/psicoterapia-online", label: "Psicoterapia" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/blog", label: "Blog" },
  { to: "/contato", label: "Contato" }
];
function Header() {
  const [open, setOpen] = reactExports.useState(false);
  const [scrolled, setScrolled] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "header",
    {
      className: `sticky top-0 z-40 transition-all duration-500 ${scrolled || open ? "border-b border-border/70 bg-[var(--ivory)]/88 shadow-[0_10px_40px_-36px_var(--ink)] backdrop-blur-xl" : "border-b border-transparent bg-[var(--ivory)]/42 backdrop-blur-sm"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial flex h-[70px] items-center justify-between md:h-[88px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/",
              className: "group flex items-center gap-4",
              "aria-label": "Camila Freitas, psicóloga clínica",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full border border-[var(--ink)]/10 bg-[var(--porcelain)]/70 font-serif text-[20px] text-[var(--ink)] shadow-soft transition-all group-hover:border-[var(--clay)]/30 group-hover:text-[var(--forest)] md:h-11 md:w-11 md:text-[21px]", children: "cf" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden flex-col leading-tight sm:flex", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-[18px] tracking-wide text-[var(--ink)]", children: "Camila Freitas" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 text-[9.5px] uppercase tracking-[0.24em] text-muted-foreground", children: "Psicóloga clínica · CRP 06/201444" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden items-center gap-2 rounded-full border border-[var(--ink)]/8 bg-[var(--porcelain)]/55 p-1.5 shadow-soft backdrop-blur md:flex", children: nav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: item.to,
              className: "rounded-full px-4 py-2 text-[12.5px] tracking-wide text-foreground/72 transition-all hover:bg-[var(--sand)]/70 hover:text-[var(--forest)]",
              activeProps: {
                className: "bg-[var(--ivory)] text-[var(--forest)] shadow-soft"
              },
              children: item.label
            },
            item.to
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: camila.whatsapp,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hidden rounded-full bg-[var(--forest)] px-5 py-3 text-[12.5px] tracking-wide text-[var(--ivory)] shadow-soft transition-all hover:-translate-y-0.5 hover:bg-[var(--ink)] md:inline-flex",
              children: "Agendar"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setOpen((value) => !value),
              className: "focus-ring grid h-10 w-10 place-items-center rounded-full border border-border bg-[var(--ivory)]/70 text-foreground md:hidden",
              "aria-label": "Abrir menu",
              "aria-expanded": open,
              children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
            }
          )
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-[var(--ivory)] shadow-float md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial flex flex-col gap-1 py-5", children: [
          nav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: item.to,
              onClick: () => setOpen(false),
              className: "border-b border-border/60 py-4 text-[15px] text-foreground/85 transition-colors hover:text-[var(--forest)]",
              children: item.label
            },
            item.to
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: camila.whatsapp,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "focus-ring mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3.5 text-sm text-[var(--ivory)]",
              children: "Agendar conversa"
            }
          )
        ] }) })
      ]
    }
  );
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "surface-forest relative overflow-hidden border-t border-[var(--ivory)]/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grain absolute inset-0", "aria-hidden": true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial relative py-18 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-14 md:grid-cols-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-serif text-[40px] leading-none text-[var(--ivory)] md:text-[54px]", children: "Camila Freitas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-sm text-[14.5px] leading-relaxed text-[var(--ivory)]/68", children: "Psicóloga clínica formada pela PUC-SP. Atendimento online e presencial em São Paulo, com escuta cuidadosa e responsabilidade profissional." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-8 text-[11px] uppercase tracking-[0.24em] text-[var(--ivory)]/54", children: [
            camila.crp,
            " · Vila Nova Conceição"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[11px] uppercase tracking-[0.24em] text-[var(--brass)]", children: "Navegação" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-6 space-y-3 text-[14px] text-[var(--ivory)]/78", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/sobre", className: "link-underline", children: "Sobre" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/psicoterapia-online", className: "link-underline", children: "Psicoterapia online" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ansiedade", className: "link-underline", children: "Ansiedade" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/relacionamentos", className: "link-underline", children: "Relacionamentos" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/autoconhecimento", className: "link-underline", children: "Autoconhecimento" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[11px] uppercase tracking-[0.24em] text-[var(--brass)]", children: "Contato" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-6 space-y-4 text-[14px] text-[var(--ivory)]/84", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "mt-0.5 h-4 w-4 text-[var(--brass)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: camila.location })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "mt-0.5 h-4 w-4 text-[var(--brass)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: camila.whatsapp, className: "link-underline", children: camila.phone })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "mt-0.5 h-4 w-4 text-[var(--brass)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: `mailto:${camila.email}`,
                  className: "break-all link-underline",
                  children: camila.email
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "mt-0.5 h-4 w-4 text-[var(--brass)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: camila.instagram,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "link-underline",
                  children: camila.instagramHandle
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 h-px bg-[var(--ivory)]/14" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col gap-4 text-[12px] text-[var(--ivory)]/52 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Camila Freitas."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Conteúdo informativo. Atendimento psicológico conforme ética profissional." })
      ] })
    ] })
  ] });
}
const WHATSAPP_URL = camila.whatsapp;
function WhatsAppFloat() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: WHATSAPP_URL,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "Conversar pelo WhatsApp",
      className: "group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-[var(--forest)]/15 bg-[var(--ivory)]/95 px-4 py-3 text-[13px] text-[var(--forest)] shadow-elev backdrop-blur transition-all hover:bg-[var(--forest)] hover:text-[var(--ivory)] md:px-5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            viewBox: "0 0 24 24",
            className: "h-4 w-4",
            fill: "currentColor",
            "aria-hidden": "true",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.15-.174.2-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884z" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "WhatsApp" })
      ]
    }
  );
}
function Layout({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppFloat, {})
  ] });
}
function Eyebrow({
  children,
  n
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-baseline gap-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground", children: [
    n && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif italic text-[var(--clay)]", children: n }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-8 translate-y-[-3px] bg-[var(--clay)]/60" }),
    children
  ] });
}
function PrimaryCTA({
  children = "Conversar pelo WhatsApp"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: camila.whatsapp,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "focus-ring group relative inline-flex min-h-[56px] items-center justify-center gap-3 overflow-hidden rounded-full bg-[var(--forest)] px-7 py-4 text-center text-[13px] tracking-wide text-[var(--ivory)] shadow-soft transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-[var(--ivory)]/16 before:to-transparent before:transition-transform before:duration-700 hover:-translate-y-0.5 hover:bg-[var(--ink)] hover:shadow-press hover:before:translate-x-full md:min-h-[48px]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative", children }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            "aria-hidden": true,
            className: "relative inline-block h-px w-5 bg-[var(--brass)] transition-all group-hover:w-8"
          }
        )
      ]
    }
  );
}
function SecondaryCTA({
  to,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to,
      className: "focus-ring group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full border border-[var(--ink)]/18 bg-[var(--ivory)]/45 px-7 py-4 text-center text-[13px] tracking-wide text-[var(--ink)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[var(--forest)] hover:bg-[var(--ivory)] hover:text-[var(--forest)] md:min-h-[48px]",
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" })
      ]
    }
  );
}
function PageHero({
  eyebrow,
  title,
  intro,
  image
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-mist relative overflow-hidden border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial grid gap-12 py-16 md:grid-cols-12 md:py-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: eyebrow }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-7 max-w-4xl text-balance font-serif text-[38px] leading-[1.04] text-[var(--ink)] sm:text-[46px] md:text-[68px]", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 max-w-2xl text-pretty text-[17px] leading-[1.75] text-foreground/75", children: intro }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-stack mt-10 flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryCTA, { children: "Conversar sobre atendimento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SecondaryCTA, { to: "/como-funciona", children: "Entender o processo" })
      ] })
    ] }),
    image && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("figure", { className: "editorial-frame photo-shell overflow-hidden rounded-[2px] shadow-elev", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: image,
        alt: "",
        className: "image-wash aspect-[4/5] w-full object-cover"
      }
    ) }) })
  ] }) });
}
function FinalContact() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-porcelain section-pad relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial relative grid gap-12 md:grid-cols-12 md:items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5 md:pr-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { n: "09", children: "Próximo passo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-7 font-serif text-[34px] leading-[1.05] sm:text-[42px] md:text-[54px]", children: "Sinta-se à vontade para enviar uma mensagem." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-[15px] leading-relaxed text-muted-foreground", children: "O primeiro contato serve para compreender sua busca e avaliar a possibilidade de início. Você pode escrever de forma breve e sem pressão de agendamento." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-7", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quiet-card overflow-hidden bg-[var(--ivory)] shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: [
        [Phone, "WhatsApp", camila.phone, camila.whatsapp],
        [Mail, "E-mail", camila.email, `mailto:${camila.email}`],
        [MapPin, "Consultório", camila.location, "/contato"],
        [
          Instagram,
          "Instagram",
          camila.instagramHandle,
          camila.instagram
        ]
      ].map(([Icon2, label, value, href]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href,
          target: href.startsWith("http") ? "_blank" : void 0,
          rel: "noopener noreferrer",
          className: "group grid gap-4 p-5 transition-colors hover:bg-[var(--bone)] sm:p-7 md:grid-cols-[24px_120px_1fr]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "h-5 w-5 text-[var(--clay)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-words font-serif text-[20px] leading-tight text-[var(--ink)] group-hover:text-[var(--forest)] sm:text-[22px]", children: value })
          ]
        },
        label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-[var(--bone)]/40 p-5 sm:p-7", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryCTA, { children: "Agendar uma primeira conversa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-[12px] text-muted-foreground sm:text-right", children: [
          "As mensagens são estritamente ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "hidden sm:block" }),
          " confidenciais e lidas apenas por mim."
        ] })
      ] }) })
    ] }) })
  ] }) });
}
export {
  ArrowUpRight as A,
  Eyebrow as E,
  FinalContact as F,
  Instagram as I,
  Layout as L,
  MapPin as M,
  PageHero as P,
  SecondaryCTA as S,
  camila as a,
  PrimaryCTA as b,
  createLucideIcon as c,
  Phone as d,
  Mail as e,
  faqs as f,
  articles as g,
  instagramTiles as h,
  images as i,
  serviceAreas as s
};
