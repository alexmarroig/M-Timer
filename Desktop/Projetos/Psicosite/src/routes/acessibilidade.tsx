import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { FadeIn, TextReveal } from "@/components/site/Animations";

export const Route = createFileRoute("/acessibilidade")({
  head: () => ({
    meta: [
      { title: "Declaração de Acessibilidade | Psicóloga Camila Freitas" },
      {
        name: "description",
        content: "Compromisso com a inclusão digital e acessibilidade em nossa plataforma clínica.",
      },
    ],
  }),
  component: Acessibilidade,
});

function Acessibilidade() {
  return (
    <Layout>
      <div className="pt-[120px] pb-24 md:pt-[160px] md:pb-32 bg-[var(--bone)]">
        <div className="container-editorial max-w-3xl">
          <FadeIn>
            <h1 className="font-serif text-[40px] leading-[1.05] text-[var(--ink)] sm:text-[52px] md:text-[64px]">
              <TextReveal>Declaração de Acessibilidade</TextReveal>
            </h1>
            <p className="mt-6 text-[16px] leading-[1.8] text-muted-foreground">
              Acreditamos que a saúde mental deve ser acessível a todos. Estamos empenhados em garantir a inclusão digital em nosso site.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-16 space-y-12">
            <section>
              <h2 className="font-serif text-[24px] text-[var(--ink)]">Nosso Compromisso</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Este site foi desenvolvido buscando seguir as diretrizes de acessibilidade para conteúdo web (WCAG), visando facilitar a navegação para pessoas com diferentes necessidades e capacidades.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-[24px] text-[var(--ink)]">Feedback e Contato</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Se você encontrar qualquer dificuldade de acessibilidade em nosso site ou tiver sugestões de melhoria, por favor, entre em contato através do e-mail: <a href="mailto:psi.camilafreitas@gmail.com" className="underline">psi.camilafreitas@gmail.com</a>.
              </p>
            </section>
          </FadeIn>
        </div>
      </div>
    </Layout>
  );
}
