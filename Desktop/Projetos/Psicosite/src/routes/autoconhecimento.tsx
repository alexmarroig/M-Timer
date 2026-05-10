import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { PrimaryCTA } from "@/components/site/Primitives";
import { images } from "@/components/site/content";

export const Route = createFileRoute("/autoconhecimento")({
  head: () => ({
    meta: [
      { title: "Psicoterapia para Autoconhecimento e Saúde Mental | Camila Freitas" },
      {
        name: "description",
        content: "Inicie um percurso clínico de autoconhecimento e elaboração emocional na Vila Nova Conceição ou Online. Atendimento com a Psicóloga Camila Freitas (PUC-SP).",
      },
      { property: "og:title", content: "Autoconhecimento e Psicoterapia com Psicóloga Camila Freitas" },
      { property: "og:description", content: "Um percurso clínico para compreender a própria história com honestidade, ética e responsabilidade." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Psicoterapia para Autoconhecimento",
          "provider": {
            "@type": "Psychologist",
            "name": "Camila Freitas",
            "url": "https://psicamilafreitas.com.br"
          },
          "areaServed": "São Paulo, Vila Nova Conceição e Online",
          "description": "Percurso clínico de autoconhecimento focado na elaboração de escolhas, desejos e padrões emocionais."
        })
      }
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Autoconhecimento"
      title={<>Conhecer-se não como performance, mas como elaboração.</>}
      intro="O autoconhecimento clínico não busca uma versão ideal de si. Ele cria condições para olhar escolhas, desejos, defesas e repetições com mais honestidade."
      image={images.life2}
      lead="Na terapia, compreender a si mesma ou a si mesmo envolve dar lugar ao que foi vivido, ao que se repete e ao que ainda pede elaboração."
      points={[
        "Investigar sentidos por trás de escolhas, impasses e formas de se proteger do sofrimento.",
        "Reconhecer padrões que atravessam a vida afetiva, o trabalho e a imagem de si mesmo.",
        "Ampliar a capacidade de sustentar perguntas fundamentais sem respostas apressadas ou fórmulas prontas.",
        "Construir uma relação mais consciente e responsável com a própria história e desejos.",
        "Elaborar sentimentos de inadequação, baixa autoestima e busca por aprovação externa.",
      ]}
      faqItems={[
        {
          q: "Quanto tempo dura um processo de autoconhecimento?",
          a: "A psicoterapia clínica não tem um prazo fixo. O tempo é ditado pela profundidade das questões trazidas e pelo ritmo de cada pessoa em elaborar suas vivências e transformações."
        },
        {
          q: "Qual a diferença entre autoconhecimento e autoajuda?",
          a: "Diferente da autoajuda, que costuma oferecer conselhos genéricos, a psicoterapia clínica oferece uma escuta técnica, ética e individualizada, focada na singularidade da sua história."
        }
      ]}
      cta={
        <div className="mt-12 space-y-6">
          <PrimaryCTA message="autoconhecimento">Agendar sessão de psicoterapia</PrimaryCTA>
          <p className="text-[14px] text-muted-foreground">
            Leia mais: <a href="/blog/hora-de-procurar-psicoterapia" className="underline hover:text-[var(--forest)] transition-colors">Como saber se é o momento de procurar ajuda psicológica?</a>
          </p>
        </div>
      }
    />
  ),
});
