import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Layout, P as PageHero, a as PrimaryCTA, I as InstagramIcon } from "./Layout-D7gehF66.mjs";
import { i as images, c as camila, g as getWhatsAppLink } from "./router-k3VwZQIo.mjs";
import { t as track } from "../_libs/vercel__analytics.mjs";
import { b as Mail, M as MapPin, c as Send, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
function WhatsAppIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className, xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" }) });
}
function ContatoPage() {
  const [formState, setFormState] = reactExports.useState("idle");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState("loading");
    track("form_submission_attempt");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      console.log("Payload preparado para Resend:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      track("form_submission_success");
      setFormState("success");
    } catch (error) {
      console.error(error);
      setFormState("error");
    }
  };
  const links = [[WhatsAppIcon, "WhatsApp", camila.phone, getWhatsAppLink("default")], [Mail, "E-mail", camila.email, `mailto:${camila.email}`], [InstagramIcon, "Instagram", camila.instagramHandle, camila.instagram], [MapPin, "Consultório", camila.location, ""]];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: "Contato", title: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Um primeiro contato claro, discreto e cuidadoso." }), intro: "Você pode escrever de forma breve sobre sua busca por terapia. O retorno é pessoal, com informações sobre disponibilidade, valores e possibilidades de atendimento.", image: images.consultorio, alt: "Recepção acolhedora do consultório de psicologia da Camila Freitas na Vila Nova Conceição" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-porcelain section-pad relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-editorial grid gap-16 md:grid-cols-12 md:gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-6 lg:col-span-5 md:order-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-[28px] leading-[1.1] sm:text-[34px] md:text-[42px]", children: "Canais diretos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[15px] leading-relaxed text-muted-foreground", children: "Para maior agilidade ou dúvidas curtas, o WhatsApp é o canal mais rápido. As mensagens são lidas e respondidas diretamente pela Camila." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 mb-10 flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PrimaryCTA, { children: "Conversar no WhatsApp" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quiet-card divide-y divide-border", children: links.map(([Icon, label, value, href]) => {
          const content = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 p-5 sm:p-6 md:grid-cols-[24px_1fr]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-[var(--clay)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block break-words font-serif text-[20px] leading-tight text-[var(--ink)] sm:text-[22px]", children: value })
            ] })
          ] });
          return href ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href, target: href.startsWith("http") ? "_blank" : void 0, rel: "noopener noreferrer", onClick: () => {
            if (label === "WhatsApp") track("click_whatsapp");
            if (label === "E-mail") track("click_email_contact");
            if (label === "Instagram") track("click_instagram");
          }, className: "block transition-colors hover:bg-[var(--bone)] hover:text-[var(--forest)]", children: content }, label) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: content }, label);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-6 lg:col-span-7 md:order-1 lg:pr-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quiet-card bg-[var(--ivory)] p-6 sm:p-8 md:p-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-[28px] leading-[1.1] text-[var(--ink)] sm:text-[34px]", children: "Primeiro Contato" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[14.5px] leading-relaxed text-muted-foreground", children: "Por favor, não inclua dados clínicos sensíveis ou histórico detalhado aqui. Essas informações serão acolhidas e tratadas com o devido cuidado e sigilo no momento apropriado, durante a nossa primeira conversa." }),
        formState === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-sm border border-[var(--forest)]/20 bg-[var(--forest)]/5 p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--ivory)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-6 font-serif text-[24px] text-[var(--ink)]", children: "Mensagem enviada com sucesso." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[15px] text-muted-foreground", children: "Agradeço o seu contato. Retornarei o mais breve possível com as informações solicitadas." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFormState("idle"), className: "mt-8 text-[13px] uppercase tracking-widest text-[var(--clay)] transition-colors hover:text-[var(--forest)]", children: "Enviar nova mensagem" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "mt-10 grid gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "name", className: "text-[13px] font-medium text-[var(--ink)]", children: "Nome completo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, id: "name", name: "name", type: "text", className: "w-full rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "whatsapp", className: "text-[13px] font-medium text-[var(--ink)]", children: "WhatsApp" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, id: "whatsapp", name: "whatsapp", type: "tel", className: "w-full rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", className: "text-[13px] font-medium text-[var(--ink)]", children: "E-mail" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, id: "email", name: "email", type: "email", className: "w-full rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "modality", className: "text-[13px] font-medium text-[var(--ink)]", children: "Modalidade de interesse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, id: "modality", name: "modality", className: "w-full rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecione..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "online", children: "Online" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "presencial", children: "Presencial (Vila Nova Conceição)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "indefinido", children: "Ainda não sei / Quero entender melhor" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "period", className: "text-[13px] font-medium text-[var(--ink)]", children: "Melhor período para contato" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, id: "period", name: "period", className: "w-full rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecione..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "manha", children: "Manhã" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "tarde", children: "Tarde" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "noite", children: "Noite" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "message", className: "text-[13px] font-medium text-[var(--ink)] flex items-center justify-between", children: [
              "Mensagem breve ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground uppercase tracking-wider", children: "(Opcional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "message", name: "message", rows: 4, className: "w-full resize-none rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]" })
          ] }),
          formState === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-[var(--destructive)]", children: "Ocorreu um erro ao enviar a mensagem. Por favor, tente pelo WhatsApp." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: formState === "loading", className: "focus-ring group relative inline-flex min-h-[56px] w-full items-center justify-center gap-3 overflow-hidden rounded-[2px] bg-[var(--forest)] px-7 py-4 text-center text-[14px] tracking-wide text-[var(--ivory)] shadow-soft transition-all duration-300 hover:bg-[var(--ink)] hover:shadow-press disabled:opacity-70 disabled:pointer-events-none md:min-h-[52px]", children: formState === "loading" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Enviar solicitação de contato",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-center text-[11px] leading-relaxed text-muted-foreground/80 max-w-sm mx-auto", children: [
            "Ao enviar, você concorda com o uso dos seus dados para retorno de contato, conforme a ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacidade", className: "underline hover:text-[var(--forest)] transition-colors", children: "Política de Privacidade" }),
            "."
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
}
export {
  ContatoPage as component
};
