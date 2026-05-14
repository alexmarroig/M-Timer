import brandLogoHorizontal from "@/assets/brand/camila-freitas-logo-horizontal.png";
import brandLogoVertical from "@/assets/brand/logo-vertical.webp";
import portrait from "@/assets/brand/portrait.webp";
import consultorio from "@/assets/consultorio.webp";
import life1 from "@/assets/lifestyle-1.jpg";
import life2 from "@/assets/lifestyle-2.webp";
import life3 from "@/assets/lifestyle-3.jpg";
import life4 from "@/assets/lifestyle-4.jpg";
import lifeReading from "@/assets/lifestyle-reading.jpg";
import lifeOnline from "@/assets/lifestyle-online.jpg";
import lifeTime from "@/assets/lifestyle-time.jpg";
import lifePlanning from "@/assets/lifestyle-planning.jpg";
import lifeBurnout from "@/assets/lifestyle-burnout.jpg";
import camilaSittingFull from "@/assets/brand/camila-sitting-full.webp";
import camilaSittingCutout from "@/assets/brand/camila-sitting-cutout.webp";


// Keystatic Data Imports
import globalData from "../../content/global.json";
import homepageData from "../../content/homepage.json";
import instagramCuratedData from "../../content/instagramCurated.json";

// Collections
const faqFiles = import.meta.glob("../../content/faq/*.json", { eager: true });
const serviceFiles = import.meta.glob("../../content/services/*.json", { eager: true });
const blogFiles = import.meta.glob("../../content/blog/*/index.json", { eager: true });
const blogContentFiles = import.meta.glob("../../content/blog/*/content.mdoc", { eager: true, query: '?raw', import: 'default' });

export const camila = globalData;
export const homepage = homepageData;

export const images = {
  consultorio,
  portrait,
  logoHorizontal: brandLogoHorizontal,
  logoVertical: brandLogoVertical,
  life1,
  life2,
  life3,
  life4,
  lifeReading,
  lifeOnline,
  lifeTime,
  lifePlanning,
  lifeBurnout,
  camilaSittingFull,
  camilaSittingCutout,
};

export const serviceAreas = Object.values(serviceFiles).map((f: any) => f.default);
export const faqs = Object.values(faqFiles).map((f: any) => f.default);

export const articles = (() => {
  const contentMap: Record<string, string> = {};
  
  // Fill content map using slugs as keys
  Object.entries(blogContentFiles).forEach(([path, content]) => {
    const slug = path.split("/").slice(-2, -1)[0];
    if (slug) contentMap[slug] = content as string;
  });

  return Object.entries(blogFiles).map(([path, file]: [string, any]) => {
    const slug = path.split("/").slice(-2, -1)[0];
    const rawContent = contentMap[slug] || '';
    
    return {
      ...file.default,
      slug,
      rawContent,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
})();

// Instagram curated section
export const instagramTiles = instagramCuratedData.posts.map(post => ({
  title: post.title,
  tag: post.tag || post.title.split(' ').pop()?.replace('.', '') || 'Psicologia',
  caption: post.caption,
  label: post.label,
  image: post.image,
  url: post.url
}));

export const instagramSection = {
  title: instagramCuratedData.title,
  description: instagramCuratedData.description,
};

// WhatsApp Strategy
export const whatsappMessages = {
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
  "dependencia-quimica": "Olá Psicóloga Camila Freitas, vi seu trabalho com dependência química e gostaria de agendar uma primeira sessão.",
  "dependencia-tecnologica": "Olá Psicóloga Camila Freitas, vi seu trabalho sobre dependência tecnológica e telas. Gostaria de agendar uma conversa inicial.",
  luto: "Olá Psicóloga Camila Freitas, busco apoio psicológico para lidar com um processo de luto. Gostaria de agendar uma sessão.",
  blog: (title: string) => `Olá Psicóloga Camila Freitas, li seu artigo sobre "${title}" e senti que é o momento de buscar ajuda profissional. Gostaria de agendar uma sessão.`,
};

export const getWhatsAppLink = (messageKey: keyof typeof whatsappMessages | string) => {
  const phone = camila.phone.replace(/\D/g, "");
  let text = "";
  
  if (typeof messageKey === "string" && whatsappMessages[messageKey as keyof typeof whatsappMessages]) {
    const val = whatsappMessages[messageKey as keyof typeof whatsappMessages];
    text = typeof val === "function" ? val("") : val;
  } else {
    text = messageKey;
  }

  return `https://wa.me/55${phone}?text=${encodeURIComponent(text)}`;
};
