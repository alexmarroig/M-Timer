import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link, d as useLocation } from "../_libs/tanstack__react-router.mjs";
import { t as track } from "../_libs/vercel__analytics.mjs";
import { c as camila, g as getWhatsAppLink, i as images } from "./router-k3VwZQIo.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { b as Mail, M as MapPin, X, f as Menu, A as ArrowUpRight, g as Phone } from "../_libs/lucide-react.mjs";
import { u as useReducedMotion, m as motion, a as useScroll, b as useTransform, c as useSpring } from "../_libs/framer-motion.mjs";
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
      className: `sticky top-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${scrolled || open ? "border-b border-border/50 bg-[var(--ivory)]/80 shadow-[0_16px_40px_-32px_var(--ink)] backdrop-blur-xl" : "border-b border-transparent bg-[var(--ivory)]/30 backdrop-blur-md"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `absolute inset-0 -z-10 transition-opacity duration-700 grain ${scrolled || open ? "opacity-30" : "opacity-0"}`,
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial flex h-[76px] items-center justify-between gap-4 md:h-[92px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/",
              className: "group flex min-w-0 items-center gap-3 sm:gap-4",
              "aria-label": "Psicóloga Camila Freitas",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--ink)]/10 bg-[var(--porcelain)]/80 p-1.5 shadow-soft transition-all duration-300 group-hover:border-[var(--clay)]/35 group-hover:shadow-press md:h-14 md:w-14", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: images.logoVertical,
                    alt: "Logotipo Psicóloga Camila Freitas - Clínica e Psicoterapia",
                    className: "h-full w-full scale-[2.15] object-cover object-top opacity-90 transition-transform duration-500 group-hover:scale-[2.25]",
                    width: 96,
                    height: 96
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex min-w-0 flex-col leading-tight", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[188px] truncate font-serif text-[17px] tracking-wide text-[var(--ink)] sm:max-w-none sm:text-[19px] md:text-[21px]", children: "Psicóloga Camila Freitas" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 hidden text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:block md:text-[10px]", children: "Psicóloga Clínica · CRP 06/201444" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden items-center gap-1.5 rounded-full border border-[var(--ink)]/8 bg-[var(--porcelain)]/62 p-1.5 shadow-soft backdrop-blur md:flex", children: nav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
              onClick: () => track("click_whatsapp"),
              className: "hidden rounded-full bg-[var(--forest)] px-5 py-3 text-[12.5px] tracking-wide text-[var(--ivory)] shadow-soft transition-all hover:-translate-y-0.5 hover:bg-[var(--ink)] md:inline-flex",
              children: "Agendar"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setOpen((value) => !value),
              className: "focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-[var(--ivory)]/76 text-foreground md:hidden",
              "aria-label": "Abrir menu",
              "aria-expanded": open,
              children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
            }
          )
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-[var(--ivory)] shadow-float md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial flex flex-col gap-0 py-6", children: [
          nav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.to,
              onClick: () => setOpen(false),
              className: "flex items-center justify-between border-b border-border/40 py-5 text-[17px] font-serif tracking-tight text-[var(--ink)] transition-colors hover:text-[var(--forest)]",
              children: [
                item.label,
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-[var(--clay)] opacity-40" })
              ]
            },
            item.to
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: camila.whatsapp,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "focus-ring flex min-h-[58px] items-center justify-center rounded-full bg-[var(--forest)] px-6 text-[15px] font-medium tracking-wide text-[var(--ivory)] shadow-soft",
                children: "Agendar sessão de psicoterapia"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-[12px] text-muted-foreground/70", children: "Atendimento online e presencial" })
          ] })
        ] }) })
      ]
    }
  );
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.8,
  yOffset = 24,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: shouldReduceMotion ? 0 : yOffset },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-10%" },
      transition: {
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      },
      className,
      ...props,
      children
    }
  );
}
function StaggerChildren({
  children,
  className,
  staggerDelay = 0.1,
  delayChildren = 0,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true, margin: "-10%" },
      variants: {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
            delayChildren
          }
        }
      },
      className,
      ...props,
      children
    }
  );
}
function StaggerItem({
  children,
  className,
  yOffset = 20,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      variants: {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
        }
      },
      className,
      ...props,
      children
    }
  );
}
function TextReveal({
  children,
  className,
  delay = 0
}) {
  const shouldReduceMotion = useReducedMotion();
  const words = children.split(" ");
  if (shouldReduceMotion) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className, children });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex flex-wrap", className), children: words.map((word, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.span,
    {
      initial: { y: "100%", opacity: 0 },
      whileInView: { y: "0%", opacity: 1 },
      viewport: { once: true, margin: "-10%" },
      transition: {
        duration: 0.8,
        delay: delay + i * 0.03,
        ease: [0.21, 0.47, 0.32, 0.98]
      },
      className: "inline-block",
      children: [
        word,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-[0.25em]", children: " " })
      ]
    }
  ) }, i)) });
}
function ParallaxMedia({
  children,
  className,
  offset = 50
}) {
  const ref = reactExports.useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const checkMedia = () => setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
    checkMedia();
    window.addEventListener("resize", checkMedia);
    return () => window.removeEventListener("resize", checkMedia);
  }, []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const smoothY = useSpring(y, {
    stiffness: 100,
    damping: 30,
    restDelta: 1e-3
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("overflow-hidden", className), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      style: {
        y: shouldReduceMotion || !isDesktop ? 0 : smoothY,
        height: "100%"
      },
      className: "will-change-transform",
      children
    }
  ) });
}
function MagneticButton({
  children,
  className,
  strength = 15
}) {
  const ref = reactExports.useRef(null);
  const [position, setPosition] = reactExports.useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();
  const [isHoverable, setIsHoverable] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const checkHover = () => setIsHoverable(window.matchMedia("(hover: hover)").matches);
    checkHover();
    window.addEventListener("resize", checkHover);
    return () => window.removeEventListener("resize", checkHover);
  }, []);
  const handleMouse = (e) => {
    if (!ref.current || shouldReduceMotion || !isHoverable) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) / width * strength;
    const y = (clientY - (top + height / 2)) / height * strength;
    setPosition({ x, y });
  };
  const resetMouse = () => setPosition({ x: 0, y: 0 });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      ref,
      onMouseMove: handleMouse,
      onMouseLeave: resetMouse,
      animate: { x: position.x, y: position.y },
      transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.5 },
      className,
      children
    }
  );
}
function PageFade({
  children,
  className
}) {
  const shouldReduceMotion = useReducedMotion();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: shouldReduceMotion ? 0 : -8 },
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
      className,
      children
    }
  );
}
const DEFAULT_CONTEXT = {
  id: "default",
  topic: "psicoterapia",
  ctaTitle: "Sinta-se à vontade para enviar uma mensagem.",
  ctaSubtitle: "O primeiro contato serve para compreender sua busca e avaliar a possibilidade de início. Você pode escrever de forma breve e com discrição.",
  whatsappKey: "default"
};
const CONTEXT_MAP = {
  ansiedade: {
    id: "ansiedade",
    topic: "ansiedade",
    ctaTitle: "Dar o primeiro passo pode acalmar o pensamento.",
    ctaSubtitle: "Se você sente que a ansiedade tem ocupado espaço demais, este pode ser o momento de buscar um lugar de escuta e acolhimento.",
    whatsappKey: "ansiedade"
  },
  relacionamentos: {
    id: "relacionamentos",
    topic: "relacionamentos",
    ctaTitle: "Cuidar dos seus vínculos é cuidar de si.",
    ctaSubtitle: "As relações carregam nossa história. Se você busca compreender padrões ou atravessar conflitos, estou à disposição para escutar.",
    whatsappKey: "relacionamentos"
  },
  autoconhecimento: {
    id: "autoconhecimento",
    topic: "autoconhecimento",
    ctaTitle: "Um percurso para olhar para dentro.",
    ctaSubtitle: "O autoconhecimento clínico é um processo de elaboração. Se você sente que é o momento de se escutar, vamos conversar.",
    whatsappKey: "autoconhecimento"
  },
  "psicoterapia-online": {
    id: "online",
    topic: "terapia online",
    ctaTitle: "Atendimento online com presença e sigilo.",
    ctaSubtitle: "A distância não impede o cuidado. O atendimento por vídeo preserva a ética e a qualidade clínica de onde você estiver.",
    whatsappKey: "online"
  },
  contato: {
    id: "contato",
    topic: "contato",
    ctaTitle: "Um canal direto e ético para sua busca.",
    ctaSubtitle: "Respondo pessoalmente a cada mensagem com cuidado e sigilo. Sinta-se à vontade para tirar suas dúvidas sobre o processo.",
    whatsappKey: "default"
  }
};
function useBrandingContext() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  return reactExports.useMemo(() => {
    const pathname = location.pathname;
    const utmSource = search.get("utm_source")?.toLowerCase();
    const utmCampaign = search.get("utm_campaign")?.toLowerCase();
    let contextKey = "default";
    if (pathname.includes("ansiedade")) contextKey = "ansiedade";
    else if (pathname.includes("relacionamentos")) contextKey = "relacionamentos";
    else if (pathname.includes("autoconhecimento")) contextKey = "autoconhecimento";
    else if (pathname.includes("psicoterapia-online")) contextKey = "psicoterapia-online";
    else if (pathname.includes("contato")) contextKey = "contato";
    else if (pathname.includes("blog")) contextKey = "blog";
    const baseContext = { ...DEFAULT_CONTEXT, ...CONTEXT_MAP[contextKey] || {} };
    let origin = "direct";
    const ref = typeof document !== "undefined" ? document.referrer : "";
    if (utmSource === "instagram" || ref.includes("instagram.com") || ref.includes("l.instagram.com")) {
      origin = "instagram";
    } else if (utmSource === "google" || ref.includes("google.com")) {
      origin = "google";
    }
    if (origin === "instagram" && contextKey === "default") {
      baseContext.ctaTitle = "Vindo do Instagram? Vamos conversar.";
      baseContext.whatsappKey = "instagram";
    }
    if (utmCampaign === "ansiedade_sp") {
      baseContext.whatsappKey = "ansiedade_sp";
    }
    return { ...baseContext, origin };
  }, [location.pathname, location.search]);
}
function InstagramIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      className,
      xmlns: "http://www.w3.org/2000/svg",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "2", width: "20", height: "20", rx: "5", ry: "5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "17.5", y1: "6.5", x2: "17.51", y2: "6.5" })
      ]
    }
  );
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
  children = "Agendar sessão de psicoterapia",
  message = "default"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MagneticButton, { strength: 12, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: getWhatsAppLink(message),
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: () => track("click_whatsapp", { message }),
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
  ) });
}
function SecondaryCTA({
  to,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MagneticButton, { strength: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to,
      className: "focus-ring group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full border border-[var(--ink)]/18 bg-[var(--ivory)]/45 px-7 py-4 text-center text-[13px] tracking-wide text-[var(--ink)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[var(--forest)] hover:bg-[var(--ivory)] hover:text-[var(--forest)] md:min-h-[48px]",
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" })
      ]
    }
  ) });
}
function PageHero({
  eyebrow,
  title,
  intro,
  image,
  alt
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-mist relative overflow-hidden border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial grid gap-12 py-16 md:grid-cols-12 md:py-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: eyebrow }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-7 max-w-4xl text-balance font-serif text-[38px] leading-[1.04] text-[var(--ink)] sm:text-[46px] md:text-[68px]", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 max-w-2xl text-pretty text-[17px] leading-[1.75] text-foreground/75", children: intro }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-stack mt-10 flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryCTA, { children: "Agendar sessão de psicoterapia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SecondaryCTA, { to: "/como-funciona", children: "Entender o processo" })
      ] })
    ] }),
    image && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("figure", { className: "editorial-frame photo-shell overflow-hidden rounded-[2.5rem] shadow-elev", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: image,
        alt: alt || `Imagem de fundo para ${eyebrow} - Psicóloga Camila Freitas`,
        className: "image-wash aspect-[4/5] w-full object-cover",
        width: 600,
        height: 750
      }
    ) }) })
  ] }) });
}
function WhatsAppIcon$1({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className,
      xmlns: "http://www.w3.org/2000/svg",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" })
    }
  );
}
function FinalContact() {
  const { ctaTitle, ctaSubtitle, whatsappKey } = useBrandingContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-porcelain section-pad relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial relative grid gap-12 md:grid-cols-12 md:items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(FadeIn, { className: "md:col-span-5 md:pr-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { n: "09", children: "Próximo passo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-7 font-serif text-[34px] leading-[1.05] sm:text-[42px] md:text-[54px]", children: ctaTitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-[15px] leading-relaxed text-muted-foreground", children: ctaSubtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-7", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quiet-card overflow-hidden bg-[var(--ivory)] shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StaggerChildren, { className: "divide-y divide-border", children: [
        [WhatsAppIcon$1, "WhatsApp", camila.phone, camila.whatsapp],
        [Mail, "E-mail", camila.email, `mailto:${camila.email}`],
        [MapPin, "Consultório", camila.location, "/contato"],
        [
          InstagramIcon,
          "Instagram",
          camila.instagramHandle,
          camila.instagram
        ]
      ].map(([Icon, label, value, href]) => /* @__PURE__ */ jsxRuntimeExports.jsx(StaggerItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href,
          target: href.startsWith("http") ? "_blank" : void 0,
          rel: "noopener noreferrer",
          onClick: () => {
            if (label === "WhatsApp") track("click_whatsapp");
            if (label === "E-mail") track("click_email_contact");
            if (label === "Instagram") track("click_instagram");
          },
          className: "group flex gap-4 p-5 transition-colors hover:bg-[var(--bone)] sm:p-7 md:grid-cols-[24px_120px_1fr]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 shrink-0 text-[var(--clay)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-24 shrink-0 text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:w-[120px]", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-words font-serif text-[20px] leading-tight text-[var(--ink)] group-hover:text-[var(--forest)] sm:text-[22px]", children: value })
          ]
        }
      ) }, label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-[var(--bone)]/40 p-5 sm:p-7", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryCTA, { message: whatsappKey, children: "Agendar sessão de psicoterapia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-[12px] text-muted-foreground sm:text-right", children: [
          "Mensagens tratadas com sigilo",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "hidden sm:block" }),
          " e cuidado profissional."
        ] })
      ] }) })
    ] }) })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "surface-forest relative overflow-hidden border-t border-[var(--ivory)]/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grain absolute inset-0", "aria-hidden": true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial relative py-16 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-14 md:grid-cols-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: images.logoHorizontal,
              alt: "Logotipo Psicóloga Camila Freitas - Vila Nova Conceição, SP",
              className: "h-auto w-full max-w-[360px] rounded-[2px] bg-[var(--ivory)]/96 p-4 shadow-soft",
              loading: "lazy",
              width: 360,
              height: 120
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-sm text-[14.5px] leading-relaxed text-[var(--ivory)]/70", children: "Psicóloga clínica formada pela PUC-SP. Atendimento online e presencial em São Paulo, com escuta cuidadosa e responsabilidade profissional." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-8 text-[11px] uppercase tracking-[0.24em] text-[var(--ivory)]/54", children: [
            camila.crp,
            " · Vila Nova Conceição"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[11px] uppercase tracking-[0.24em] text-[var(--brass)]", children: "Menu" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-6 space-y-3 text-[14px] text-[var(--ivory)]/78", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/sobre", className: "link-underline", children: "Sobre" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "link-underline", children: "Blog" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contato", className: "link-underline", children: "Contato" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/faq", className: "link-underline", children: "FAQ" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[11px] uppercase tracking-[0.24em] text-[var(--brass)]", children: "Serviços" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-6 space-y-3 text-[14px] text-[var(--ivory)]/78", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ansiedade", className: "link-underline", children: "Ansiedade" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/relacionamentos", className: "link-underline", children: "Relacionamentos" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/psicoterapia-online", className: "link-underline", children: "Terapia Online" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/autoconhecimento", className: "link-underline", children: "Autoconhecimento" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[11px] uppercase tracking-[0.24em] text-[var(--brass)]", children: "Agendamento e Contato" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13.5px] leading-relaxed text-[var(--ivory)]/74", children: "Atendimento presencial na Vila Nova Conceição e Psicoterapia Online para brasileiros em todo o mundo." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col gap-4 text-[13.5px] text-[var(--ivory)]/84", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: camila.whatsapp, className: "flex items-center gap-3 link-underline", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-[var(--brass)]" }),
                " ",
                camila.phone
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: camila.instagram, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-3 link-underline", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(InstagramIcon, { className: "h-4 w-4 text-[var(--brass)]" }),
                " ",
                camila.instagramHandle
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: camila.whatsapp,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[var(--ivory)] px-8 text-[12px] font-semibold tracking-widest text-[var(--forest)] shadow-soft transition-all hover:scale-105 active:scale-95",
                children: "Agendar Sessão"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 h-px bg-[var(--ivory)]/14" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col gap-4 text-[12px] text-[var(--ivory)]/52 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " ",
          camila.brandedName,
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacidade", className: "hover:text-[var(--ivory)] transition-colors", children: "Política de Privacidade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Conteúdo informativo. Atendimento psicológico conforme ética profissional." })
        ] })
      ] })
    ] })
  ] });
}
function WhatsAppIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className,
      xmlns: "http://www.w3.org/2000/svg",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" })
    }
  );
}
function WhatsAppFloat() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: getWhatsAppLink("default"),
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "Conversar pelo WhatsApp",
      onClick: () => track("click_whatsapp", { location: "float" }),
      className: "group fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full border border-[var(--forest)]/20 bg-[var(--ivory)]/80 p-4 text-[var(--forest)] shadow-float backdrop-blur-lg transition-all hover:scale-110 active:scale-95 sm:gap-2 sm:p-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-full mr-3 hidden origin-right scale-90 rounded-sm bg-[var(--ink)] px-3 py-1.5 text-[11px] uppercase tracking-widest text-[var(--ivory)] opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 sm:block", children: "Conversar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, { className: "h-6 w-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden pr-1 text-[13px] font-medium tracking-tight sm:inline", children: "WhatsApp" })
      ]
    }
  );
}
function Layout({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageFade, { children }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppFloat, {})
  ] });
}
export {
  Eyebrow as E,
  FinalContact as F,
  InstagramIcon as I,
  Layout as L,
  PageHero as P,
  SecondaryCTA as S,
  TextReveal as T,
  PrimaryCTA as a,
  FadeIn as b,
  ParallaxMedia as c,
  StaggerChildren as d,
  StaggerItem as e
};
