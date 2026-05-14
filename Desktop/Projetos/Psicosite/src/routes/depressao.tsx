import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { images } from "@/components/site/content";

export const Route = createFileRoute("/depressao")({
  head: () => ({
    meta: [
      {
        title:
          "Terapia para depressão | Psicóloga Camila Freitas em São Paulo e online",
      },
      {
        name: "description",
        content:
          "Acompanhamento psicológico para depressão, sofrimento persistente, desânimo, isolamento e cansaço emocional com a Psicóloga Camila Freitas.",
      },
      { property: "og:title", content: "Terapia para depressão" },
      { property: "og:description", content: "Um espaço clínico para escutar sofrimento persistente, perda de sentido, isolamento e cansaço emocional." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Psicoterapia para Depressão",
          "provider": {
            "@type": "Psychologist",
            "name": "Camila Freitas",
            "url": "https://psicavfreitas.com.br"
          },
          "areaServed": "São Paulo, Vila Nova Conceição e Online",
          "description": "Acompanhamento psicológico especializado para depressão, desânimo persistente e sofrimento emocional com ética e cuidado clínico."
        })
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Como a terapia ajuda na depressão?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A psicoterapia oferece um espaço para falar sobre o que parece indizível. Ela ajuda a identificar padrões de pensamento, a processar perdas e a reconstruir um sentido que faça mais sentido para você."
              }
            },
            {
              "@type": "Question",
              "name": "Depressão tem cura?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Mais do que 'cura', buscamos a remissão dos sintomas e a compreensão dos fatores que levam ao estado depressivo, permitindo que a pessoa retome sua capacidade de agir e de sentir prazer na vida."
              }
            }
          ]
        })
      }
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Depressão"
      title={<>Quando a vida perde cor, ritmo e possibilidade de descanso.</>}
      intro="A depressão pode aparecer como desânimo persistente, isolamento, culpa, perda de interesse, irritação, alterações no sono ou uma sensação difícil de nomear."
      image={images.life2}
      lead="Na terapia, o sofrimento depressivo é escutado com cuidado clínico, sem julgamento e sem pressa. O processo busca compreender a história, os afetos e as condições que sustentam esse estado."
      points={[
        "Dar palavra ao cansaço emocional, à tristeza persistente e à sensação de esvaziamento.",
        "Observar como isolamento, culpa, exigência interna e perda de sentido aparecem no cotidiano.",
        "Compreender relações entre sofrimento atual, história pessoal, vínculos e modos de defesa.",
        "Analisar o impacto da depressão na produtividade, no corpo e no desejo.",
        "Construir recursos possíveis de cuidado, respeitando o tempo e a singularidade de cada pessoa.",
      ]}
      faqItems={[
        {
          q: "Como a terapia ajuda na depressão?",
          a: "A psicoterapia oferece um espaço para falar sobre o que parece indizível. Ela ajuda a identificar padrões de pensamento, a processar perdas e a reconstruir um sentido que faça mais sentido para você."
        },
        {
          q: "Depressão tem cura?",
          a: "Mais do que 'cura', buscamos a remissão dos sintomas e a compreensão dos fatores que levam ao estado depressivo, permitindo que a pessoa retome sua capacidade de agir e de sentir prazer na vida."
        }
      ]}
    />
  ),
});

