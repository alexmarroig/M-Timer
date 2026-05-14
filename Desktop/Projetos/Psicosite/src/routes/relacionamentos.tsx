import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { PrimaryCTA } from "@/components/site/Primitives";
import { images } from "@/components/site/content";

export const Route = createFileRoute("/relacionamentos")({
  head: () => ({
    meta: [
      { title: "Terapia para Relacionamentos e Conflitos Afetivos | Camila Freitas" },
      {
        name: "description",
        content: "Psicoterapia focada em vínculos amorosos, familiares e profissionais na Vila Nova Conceição e Online. Compreenda padrões e melhore sua saúde emocional com Camila Freitas.",
      },
      { property: "og:title", content: "Terapia para Relacionamentos com Psicóloga Camila Freitas" },
      { property: "og:description", content: "Um espaço clínico para olhar vínculos, repetições e formas saudáveis de se relacionar." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Psicoterapia para Relacionamentos",
          "provider": {
            "@type": "Psychologist",
            "name": "Camila Freitas",
            "url": "https://psicavfreitas.com.br"
          },
          "areaServed": "São Paulo, Vila Nova Conceição e Online",
          "description": "Atendimento especializado em vínculos afetivos, familiares e profissionais, focado na compreensão de padrões e saúde emocional."
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
              "name": "A terapia de casal é a mesma coisa?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Este é um atendimento individual focado na sua experiência nas relações. O objetivo é compreender como você se sente, como reage e quais padrões você carrega em seus diversos vínculos."
              }
            },
            {
              "@type": "Question",
              "name": "Como a terapia ajuda em relacionamentos difíceis?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Através da escuta clínica, você poderá identificar o que é seu e o que é do outro, aprendendo a estabelecer limites mais saudáveis e a se comunicar de forma mais autêntica."
              }
            }
          ]
        })
      }
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Relacionamentos"
      title={<>Relações importantes também precisam de escuta.</>}
      intro="Vínculos afetivos, familiares e profissionais carregam expectativas, medos, repetições e tentativas de cuidado que nem sempre são fáceis de nomear."
      image={images.lifePlanning}
      pains={{
        title: "Vínculos que pedem cuidado, silêncios que pesam ou repetições que cansam.",
        items: [
          "Sinto que estou sempre cedendo para evitar conflitos, mas me sinto invisível.",
          "Não consigo estabelecer limites e acabo me sobrecarregando nas relações.",
          "Atraio sempre o mesmo tipo de parceiro e as mesmas situações de sofrimento.",
          "Tenho medo constante de ser abandonado(a) ou rejeitado(a) se mostrar quem sou.",
          "Sinto que perdi minha identidade dentro do relacionamento.",
          "Dificuldade de comunicação: parece que falamos línguas diferentes e nada se resolve."
        ]
      }}
      lead="As relações são o espelho de como nos posicionamos no mundo. Na clínica, olhamos para o que se repete e o que pode ser transformado."
      points={[
        "Refletir sobre padrões recorrentes em relações amorosas, familiares e profissionais.",
        "Elaborar rupturas, lutos afetivos, dependências emocionais e dificuldades de limite.",
        "Compreender expectativas irreais, silêncios prolongados e formas de comunicação defensiva.",
        "Analisar a herança familiar e como ela impacta seus vínculos atuais.",
        "Construir mais clareza sobre desejos, escolhas e responsabilidades afetivas.",
      ]}
      faqItems={[
        {
          q: "A terapia de casal é a mesma coisa?",
          a: "Este é um atendimento individual focado na sua experiência nas relações. O objetivo é compreender como você se sente, como reage e quais padrões você carrega em seus diversos vínculos."
        },
        {
          q: "Como a terapia ajuda em relacionamentos difíceis?",
          a: "Através da escuta clínica, você poderá identificar o que é seu e o que é do outro, aprendendo a estabelecer limites mais saudáveis e a se comunicar de forma mais autêntica."
        }
      ]}
      cta={
        <div className="mt-12 space-y-6">
          <PrimaryCTA message="relacionamentos">Conversar sobre relacionamentos</PrimaryCTA>
          <p className="text-[14px] text-muted-foreground">
            Leia mais: <a href="/blog/terapia-nos-relacionamentos" className="underline hover:text-[var(--forest)] transition-colors">O papel da psicoterapia na construção de relacionamentos saudáveis.</a>
          </p>
        </div>
      }
    />
  ),
});

