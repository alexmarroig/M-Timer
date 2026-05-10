import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { PrimaryCTA } from "@/components/site/Primitives";
import { images } from "@/components/site/content";

export const Route = createFileRoute("/ansiedade")({
  head: () => ({
    meta: [
      { title: "Terapia para Ansiedade em São Paulo (Vila Nova Conceição) | Camila Freitas" },
      {
        name: "description",
        content: "Tratamento especializado para ansiedade, pânico e estresse crônico. Atendimento psicológico com Camila Freitas (PUC-SP) na Vila Nova Conceição e Online.",
      },
      { property: "og:title", content: "Terapia para Ansiedade com Psicóloga Camila Freitas" },
      { property: "og:description", content: "Acolhimento clínico ético para sintomas ansiosos, crises de pânico e sobrecarga emocional." },
    ],
    scripts: [
      {
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
      }
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Ansiedade"
      title={
        <>Quando o pensamento corre mais do que a vida consegue acompanhar.</>
      }
      intro="A ansiedade pode aparecer no corpo, no sono, na respiração, na produtividade, nas relações e na sensação de estar sempre em dívida consigo."
      image={images.life1}
      lead="Na terapia, a ansiedade não é tratada como um defeito a ser eliminado, mas como um sinal a ser escutado com responsabilidade clínica."
      points={[
        "Compreender gatilhos, exigências internas e formas de antecipação do sofrimento.",
        "Dar palavra ao que aparece como aperto, aceleração, irritação ou controle excessivo.",
        "Observar como a ansiedade se relaciona com vínculos, trabalho, escolhas e história pessoal.",
        "Identificar padrões de pensamentos catastróficos e autocrítica severa.",
        "Construir recursos possíveis para lidar com momentos de maior sobrecarga emocional.",
      ]}
      faqItems={[
        {
          q: "Como saber se minha ansiedade precisa de terapia?",
          a: "Sinais como insônia frequente, dificuldade de concentração, preocupação constante com o futuro e sintomas físicos (como aperto no peito ou falta de ar) sem causa médica são indicativos de que a psicoterapia pode ajudar."
        },
        {
          q: "A terapia cura a ansiedade?",
          a: "O foco não é a 'cura' mecânica, mas a compreensão das raízes da ansiedade e o desenvolvimento de formas mais saudáveis de lidar com ela, devolvendo a qualidade de vida e autonomia."
        }
      ]}
      cta={
        <div className="mt-12 space-y-6">
          <PrimaryCTA message="ansiedade">Conversar sobre ansiedade</PrimaryCTA>
          <p className="text-[14px] text-muted-foreground">
            Leia mais: <a href="/blog/ansiedade-quando-buscar-ajuda" className="underline hover:text-[var(--forest)] transition-colors">Ansiedade: quando é o momento de buscar ajuda profissional?</a>
          </p>
        </div>
      }
    />
  ),
});
