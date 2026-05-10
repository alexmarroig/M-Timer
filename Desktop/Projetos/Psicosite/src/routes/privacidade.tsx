import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { FadeIn, TextReveal } from "@/components/site/Animations";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Privacidade e Ética Clínica | Psicóloga Camila Freitas" },
      {
        name: "description",
        content: "Saiba como seus dados são tratados com ética e sigilo. Política de privacidade em conformidade com a LGPD e o Código de Ética do Psicólogo.",
      },
      { property: "og:title", content: "Privacidade e Ética | Camila Freitas" },
      {
        property: "og:description",
        content: "Compromisso com o sigilo e a proteção de dados na clínica.",
      },
    ],
  }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <Layout>
      <div className="pt-[120px] pb-24 md:pt-[160px] md:pb-32 bg-[var(--bone)]">
        <div className="container-editorial max-w-3xl">
          <FadeIn>
            <h1 className="font-serif text-[40px] leading-[1.05] text-[var(--ink)] sm:text-[52px] md:text-[64px]">
              <TextReveal>Política de Privacidade</TextReveal>
            </h1>
            <p className="mt-6 text-[16px] leading-[1.8] text-muted-foreground">
              A sua privacidade, segurança e o sigilo de informações são os pilares centrais da prática clínica e também se estendem a este ambiente digital.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-16 space-y-12">
            <section>
              <h2 className="font-serif text-[24px] text-[var(--ink)]">Coleta de Dados no Formulário</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Os dados fornecidos no formulário "Primeiro Contato" (como nome, e-mail e WhatsApp) são solicitados exclusivamente para viabilizar o retorno da sua mensagem e iniciar a comunicação para um possível agendamento. Nenhuma informação de saúde sensível é exigida ou armazenada através desta página. Todas as tratativas clínicas detalhadas ocorrerão de forma segura e sigilosa após o primeiro atendimento formal.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[24px] text-[var(--ink)]">Uso e Compartilhamento</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                As suas informações jamais serão vendidas, alugadas ou compartilhadas com terceiros para fins de marketing ou publicidade. O uso se restringe estritamente ao âmbito profissional e logístico do consultório de psicologia.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[24px] text-[var(--ink)]">Métricas e Navegação (Analytics)</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Para entender como o site está sendo utilizado e facilitar as vias de contato, utilizamos serviços de análise que medem cliques em botões (como "WhatsApp" e "E-mail") de maneira <strong>totalmente anônima</strong>. Não utilizamos rastreamento invasivo, gravação de tela, nem cookies de terceiros que possam identificar você através de outras plataformas. A sua navegação é respeitada.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[24px] text-[var(--ink)]">Legislação e Seus Direitos</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                O tratamento de dados no consultório obedece ao Código de Ética Profissional do Psicólogo e está em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD). A qualquer momento, você pode solicitar a exclusão do seu contato dos nossos registros enviando uma mensagem para os canais informados no site.
              </p>
            </section>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
}
