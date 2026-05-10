import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { FinalContact, PageHero } from "@/components/site/Primitives";
import { images } from "@/components/site/content";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como Funciona a Terapia? Sessões e Primeiro Contato | Camila Freitas" },
      {
        name: "description",
        content: "Entenda o passo a passo para iniciar sua psicoterapia com Camila Freitas (PUC-SP). Saiba sobre o primeiro contato, frequência semanal e o que esperar da primeira sessão.",
      },
      { property: "og:title", content: "Como funciona a psicoterapia com Psicóloga Camila Freitas" },
      {
        property: "og:description",
        content: "Um processo claro, ético e sem pressão para iniciar sua jornada de cuidado emocional.",
      },
    ],
  }),
  component: ComoFuncionaPage,
});

function ComoFuncionaPage() {
  const steps = [
    [
      "1. Primeiro Contato",
      "Você envia uma mensagem informando sua busca. O retorno é feito pessoalmente pela Camila, com detalhes sobre horários, formato das sessões e investimento.",
    ],
    [
      "2. Investimento e Acordo",
      "O atendimento é exclusivamente particular. O valor da sessão individual é de R$ 250, com possibilidade de emissão de recibos para reembolso pelo convênio médico.",
    ],
    [
      "3. Sessões e Frequência",
      "Os encontros têm duração de 50 minutos e ocorrem semanalmente. Podem ser realizados online ou presencialmente na Vila Nova Conceição, em São Paulo.",
    ],
    [
      "4. Caminho Clínico",
      "A clínica é um espaço de construção mútua. O processo respeita o seu tempo e a profundidade necessária para cada elaboração, sem fórmulas prontas.",
    ],
  ];
  return (
    <Layout>
      <PageHero
        eyebrow="Como funciona"
        title={<>Clareza no processo. <br/> Respeito ao tempo.</>}
        intro="Entrar em análise exige um primeiro contato cuidadoso. Aqui você entende como funciona o acordo terapêutico, as modalidades e o investimento necessário para o seu acompanhamento."
        image={images.consultorio}
      />
      <section className="py-24 md:py-32">
        <div className="container-editorial grid gap-px bg-border md:grid-cols-2">
          {steps.map(([title, text]) => (
            <article key={title} className="bg-[var(--ivory)] p-8 md:p-10">
              <h2 className="font-serif text-[28px]">{title}</h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground">
                {text}
              </p>
            </article>
          ))}
        </div>
        <div className="container-editorial mt-16 max-w-3xl">
          <div className="quiet-card bg-[var(--mist)]/40 p-8 rounded-[1.5rem] border border-[var(--forest)]/10 text-center">
            <h3 className="font-serif text-[24px] text-[var(--ink)]">Sobre Reembolso</h3>
            <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
              Muitos planos de saúde operam com o sistema de <strong>livre escolha</strong>. Você paga a sessão particular e solicita o reembolso através dos recibos que emitimos. Verifique com sua operadora as condições específicas do seu plano.
            </p>
          </div>
        </div>
        <div className="container-editorial mt-16 text-center">
          <p className="text-[15px] text-muted-foreground">
            Tem dúvidas sobre o que esperar? Leia: <a href="/blog/expectativas-inicio-terapia" className="underline hover:text-[var(--forest)] transition-colors">O que esperar do início da psicoterapia?</a>
          </p>
        </div>
      </section>
      <FinalContact />
    </Layout>
  );
}
