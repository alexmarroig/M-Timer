import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { FinalContact, PageHero } from "@/components/site/Primitives";
import { faqs, images } from "@/components/site/content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Dúvidas sobre Terapia: Preço, Frequência e Sigilo | Camila Freitas" },
      {
        name: "description",
        content: "Encontre respostas para as principais dúvidas sobre psicoterapia: valores, frequência, sigilo, reembolso e atendimento online com Camila Freitas (PUC-SP).",
      },
      { property: "og:title", content: "Perguntas Frequentes sobre Terapia | Psicóloga Camila Freitas" },
      { property: "og:description", content: "Respostas claras e éticas sobre o funcionamento da clínica psicológica." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a
            }
          }))
        })
      }
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="FAQ"
        title={<>Perguntas frequentes, respondidas com clareza.</>}
        intro="Algumas dúvidas aparecem antes do primeiro contato. Reuni respostas objetivas para ajudar você a decidir com tranquilidade."
        image={images.life1}
      />
      <section className="section-pad">
        <div className="container-editorial max-w-4xl">
          <div className="quiet-card divide-y divide-border p-4 sm:p-8">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <span className="font-serif text-[21px] leading-tight text-[var(--ink)] sm:text-[23px]">
                    {faq.q}
                  </span>
                  <Plus className="mt-1 h-5 w-5 shrink-0 text-[var(--forest)] transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <FinalContact />
    </Layout>
  );
}
