import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { FinalContact, PageHero } from "@/components/site/Primitives";
import { images } from "@/components/site/content";
import { FadeIn } from "@/components/site/Animations";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como Funciona a Psicoterapia | Camila Freitas" },
      {
        name: "description",
        content: "Entenda o processo terapêutico, investimento, sessões e como funciona o sistema de reembolso por livre escolha.",
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
      "O atendimento é exclusivamente particular. O investimento por sessão individual é a partir de R$ 200, com possibilidade de emissão de recibos para reembolso pelo convênio médico.",
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
      <section className="section-pad surface-porcelain">
        <div className="container-editorial">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {steps.map(([title, text], index) => (
              <FadeIn key={title} delay={index * 0.1}>
                <article className="group relative h-full rounded-[2.5rem] bg-[var(--ivory)] p-8 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elev md:p-12">
                  <div className="flex flex-col h-full">
                    <div className="mb-8 flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--mist)] font-serif text-[18px] text-[var(--forest)] transition-colors group-hover:bg-[var(--forest)] group-hover:text-[var(--ivory)]">
                        {index + 1}
                      </span>
                      <div className="h-px flex-1 bg-border/60" />
                    </div>
                    <h2 className="font-serif text-[26px] leading-tight text-[var(--ink)] sm:text-[32px]">
                      {title.split('. ')[1]}
                    </h2>
                    <p className="mt-6 flex-1 text-[15.5px] leading-[1.7] text-muted-foreground/90">
                      {text}
                    </p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          <div className="mt-24 lg:mt-32">
            <div className="relative overflow-hidden rounded-[3rem] bg-[var(--forest)] p-8 text-[var(--ivory)] sm:p-12 md:p-16">
              <div className="relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <h3 className="font-serif text-[32px] leading-[1.1] sm:text-[42px]">
                    Sobre Reembolso e <br /> Sistema de Livre Escolha
                  </h3>
                  <p className="mt-6 text-[16px] leading-relaxed text-[var(--ivory)]/80 md:text-[18px]">
                    Muitos planos de saúde operam com o sistema de livre escolha. Você realiza o pagamento da sessão particular e solicita o reembolso através dos recibos que emitimos. Este formato garante a você o direito de escolher o profissional de sua confiança, mantendo a autonomia do tratamento.
                  </p>
                </div>
                <div className="lg:col-span-5">
                  <div className="rounded-2xl border border-[var(--ivory)]/20 bg-[var(--ivory)]/10 p-8 backdrop-blur-sm">
                    <p className="text-[14px] leading-relaxed italic">
                      "A escolha do terapeuta é o primeiro ato terapêutico. Verifique com sua operadora as condições e prazos para o reembolso de sessões de psicologia."
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--ivory)]/5 blur-[80px]" />
            </div>
          </div>
        </div>
      </section>
      
      <div className="container-editorial mt-16 text-center">
        <p className="text-[15px] text-muted-foreground">
          Tem dúvidas sobre o que esperar? Leia: <a href="/blog/expectativas-inicio-terapia" className="underline hover:text-[var(--forest)] transition-colors">O que esperar do início da psicoterapia?</a>
        </p>
      </div>

      <FinalContact />
    </Layout>
  );
}
