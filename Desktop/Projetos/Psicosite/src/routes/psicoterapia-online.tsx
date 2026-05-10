import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { PrimaryCTA } from "@/components/site/Primitives";
import { images } from "@/components/site/content";

export const Route = createFileRoute("/psicoterapia-online")({
  head: () => ({
    meta: [
      { title: "Psicoterapia Online: Atendimento Clínico por Vídeo | Camila Freitas" },
      {
        name: "description",
        content: "A psicoterapia online funciona? Entenda a eficácia e o sigilo do atendimento por videochamada com a Psicóloga Camila Freitas. Atendimento para brasileiros em todo o mundo.",
      },
      {
        property: "og:title",
        content: "Psicoterapia Online: Eficácia e Sigilo com Psicóloga Camila Freitas",
      },
      { property: "og:description", content: "Cuidado clínico ético e humano através do atendimento online por vídeo com a mesma qualidade do presencial." },
    ],
    scripts: [
      {
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
      }
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Psicoterapia online"
      title={<>Terapia online com presença, sigilo e continuidade.</>}
      intro="A psicoterapia online permite iniciar ou sustentar um processo clínico de onde você estiver, desde que exista privacidade e regularidade para os encontros."
      image={images.life4}
      lead="O atendimento online preserva os mesmos princípios éticos do atendimento presencial: sigilo, responsabilidade técnica e construção de vínculo clínico."
      points={[
        "Sessões individuais para adultos, realizadas por videochamada segura.",
        "Frequência geralmente semanal, com 50 minutos de duração por encontro.",
        "Acesso à psicoterapia para brasileiros residentes no exterior ou com rotinas intensas de viagem.",
        "Garantia de sigilo profissional conforme as diretrizes do Conselho Federal de Psicologia (CFP).",
        "O processo é construído a partir da sua demanda singular, sem métodos padronizados ou promessas de resultados imediatos.",
      ]}
      faqItems={[
        {
          q: "A terapia online funciona mesmo?",
          a: "Sim. Diversos estudos e a prática clínica cotidiana confirmam que o vínculo terapêutico e a eficácia do tratamento online são equivalentes ao presencial, desde que haja um ambiente privado e uma conexão estável."
        },
        {
          q: "Qual plataforma é utilizada?",
          a: "Utilizo plataformas seguras que garantem a criptografia e o sigilo dos dados, geralmente o Google Meet ou Zoom, facilitando o acesso pelo computador ou celular."
        }
      ]}
      cta={
        <div className="mt-12 space-y-6">
          <PrimaryCTA message="online">Falar sobre atendimento online</PrimaryCTA>
          <p className="text-[14px] text-muted-foreground">
            Leia mais: <a href="/blog/terapia-online-funciona" className="underline hover:text-[var(--forest)] transition-colors">A psicoterapia online é eficaz? Entenda como funciona a modalidade por vídeo.</a>
          </p>
        </div>
      }
    />
  ),
});
