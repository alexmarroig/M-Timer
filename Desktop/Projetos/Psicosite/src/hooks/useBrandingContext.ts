import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";

export type BrandingContext = {
  id: string;
  topic: string;
  ctaTitle: string;
  ctaSubtitle: string;
  whatsappKey: string;
  origin?: "instagram" | "google" | "direct";
};

export const DEFAULT_CONTEXT: BrandingContext = {
  id: "default",
  topic: "psicoterapia",
  ctaTitle: "Sinta-se à vontade para enviar uma mensagem.",
  ctaSubtitle: "O primeiro contato serve para compreender sua busca e avaliar a possibilidade de início. Você pode escrever de forma breve e com discrição.",
  whatsappKey: "default",
};

const CONTEXT_MAP: Record<string, Partial<BrandingContext>> = {
  ansiedade: {
    id: "ansiedade",
    topic: "ansiedade",
    ctaTitle: "Dar o primeiro passo pode acalmar o pensamento.",
    ctaSubtitle: "Se você sente que a ansiedade tem ocupado espaço demais, este pode ser o momento de buscar um lugar de escuta e acolhimento.",
    whatsappKey: "ansiedade",
  },
  relacionamentos: {
    id: "relacionamentos",
    topic: "relacionamentos",
    ctaTitle: "Cuidar dos seus vínculos é cuidar de si.",
    ctaSubtitle: "As relações carregam nossa história. Se você busca compreender padrões ou atravessar conflitos, estou à disposição para escutar.",
    whatsappKey: "relacionamentos",
  },
  autoconhecimento: {
    id: "autoconhecimento",
    topic: "autoconhecimento",
    ctaTitle: "Um percurso para olhar para dentro.",
    ctaSubtitle: "O autoconhecimento clínico é um processo de elaboração. Se você sente que é o momento de se escutar, vamos conversar.",
    whatsappKey: "autoconhecimento",
  },
  "psicoterapia-online": {
    id: "online",
    topic: "terapia online",
    ctaTitle: "Atendimento online com presença e sigilo.",
    ctaSubtitle: "A distância não impede o cuidado. O atendimento por vídeo preserva a ética e a qualidade clínica de onde você estiver.",
    whatsappKey: "online",
  },
  contato: {
    id: "contato",
    topic: "contato",
    ctaTitle: "Um canal direto e ético para sua busca.",
    ctaSubtitle: "Respondo pessoalmente a cada mensagem com cuidado e sigilo. Sinta-se à vontade para tirar suas dúvidas sobre o processo.",
    whatsappKey: "default",
  },
};

export function useBrandingContext() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  
  return useMemo(() => {
    const pathname = location.pathname;
    const utmSource = search.get("utm_source")?.toLowerCase();
    const utmCampaign = search.get("utm_campaign")?.toLowerCase();
    
    // Determine context based on route
    let contextKey = "default";
    if (pathname.includes("ansiedade")) contextKey = "ansiedade";
    else if (pathname.includes("relacionamentos")) contextKey = "relacionamentos";
    else if (pathname.includes("autoconhecimento")) contextKey = "autoconhecimento";
    else if (pathname.includes("psicoterapia-online")) contextKey = "psicoterapia-online";
    else if (pathname.includes("contato")) contextKey = "contato";
    else if (pathname.includes("blog")) contextKey = "blog";

    const baseContext = { ...DEFAULT_CONTEXT, ...(CONTEXT_MAP[contextKey] || {}) };

    // Bonus: Origin detection
    let origin: BrandingContext["origin"] = "direct";
    const ref = typeof document !== "undefined" ? document.referrer : "";
    
    if (utmSource === "instagram" || ref.includes("instagram.com") || ref.includes("l.instagram.com")) {
      origin = "instagram";
    } else if (utmSource === "google" || ref.includes("google.com")) {
      origin = "google";
    }

    // Contextual adjustments based on origin (very subtle)
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
