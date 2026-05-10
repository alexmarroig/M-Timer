import { createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Eyebrow, FinalContact, PageHero } from "@/components/site/Primitives";
import { camila, images } from "@/components/site/content";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      {
        title: "Sobre Camila Freitas | Psicóloga Clínica PUC-SP na Vila Nova Conceição",
      },
      {
        name: "description",
        content: "Conheça a trajetória de Camila Freitas (PUC-SP), Psicóloga com abordagem Junguiana. Atendimento clínico presencial na Vila Nova Conceição, SP e online.",
      },
      {
        property: "og:title",
        content: "Conheça a Psicóloga Camila Freitas | Formação e Ética Clínica",
      },
      {
        property: "og:description",
        content: "Saiba mais sobre o percurso clínico e a formação acadêmica de Camila Freitas na PUC-SP.",
      },
    ],
    scripts: [
      {
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
      }
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Sobre a Psicóloga Camila Freitas"
        title={<>Uma presença clínica feita de escuta, ética e precisão.</>}
        intro="Camila Freitas é psicóloga clínica formada pela PUC-SP. Atende adultos em psicoterapia online e presencial na Vila Nova Conceição, em São Paulo."
        image={images.portrait}
        alt="Retrato profissional da Psicóloga Camila Freitas (PUC-SP) em seu consultório"
      />
      <section className="section-pad">
        <div className="container-editorial grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow>Abordagem</Eyebrow>
            <h2 className="mt-7 font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[56px]">
              Um trabalho que não apressa o sujeito.
            </h2>
          </div>
          <div className="space-y-6 text-[16px] leading-[1.9] text-foreground/78 md:col-span-7">
            <p>
              Olá, muito prazer. Sou Camila Freitas, psicóloga formada pela
              PUC-SP. Minha escuta se orienta pela Psicologia Analítica
              (Junguiana), pelo sigilo profissional e pela singularidade de cada
              história.
            </p>
            <p>
              Em 2024 fundei meu consultório em São Paulo, localizado na Vila
              Nova Conceição, onde realizo atendimentos presenciais. Também
              atendo online, mantendo a mesma responsabilidade clínica e cuidado
              com o enquadre.
            </p>
            <p>
              A psicoterapia pode acolher questões como ansiedade, depressão,
              sofrimento emocional recorrente, relacionamentos, dependências,
              violência doméstica, saúde mental, psicodiagnóstico e
              autoconhecimento. O processo não promete cura ou respostas
              prontas: ele cria espaço para elaboração.
            </p>
          </div>
        </div>
      </section>
      <section className="surface-mist section-pad">
        <div className="container-editorial grid gap-5 md:grid-cols-4">
          {(
            [
              [GraduationCap, "Formação", camila.education],
              [ShieldCheck, "Registro profissional", camila.crp],
              [MapPin, "Atendimento", "Online e presencial em São Paulo"],
              [Sparkles, "Abordagem", camila.approach],
            ] satisfies Array<[LucideIcon, string, string]>
          ).map(([Icon, title, text]) => (
            <div key={title} className="quiet-card p-7">
              <Icon className="h-5 w-5 text-[var(--clay)]" />
              <h3 className="mt-6 font-serif text-[25px]">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="surface-forest section-pad text-[var(--ivory)]">
        <div className="container-editorial max-w-4xl">
          <Eyebrow>
            <span className="text-[var(--ivory)]/72">Referência</span>
          </Eyebrow>
          <blockquote className="mt-8 font-serif text-[34px] leading-tight sm:text-[44px] md:text-[58px]">
            Quem olha para fora, sonha. Quem olha para dentro, desperta.
            <cite className="mt-6 block text-[12px] not-italic uppercase tracking-[0.24em] text-[var(--ivory)]/52">
              Carl G. Jung
            </cite>
          </blockquote>
        </div>
      </section>
      <FinalContact />
    </Layout>
  );
}
