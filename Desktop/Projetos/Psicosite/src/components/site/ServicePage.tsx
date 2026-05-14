import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Layout } from "./Layout";
import { FinalContact, PageHero, PrimaryCTA } from "./Primitives";
import { articles, serviceAreas } from "./content";

import { Plus } from "lucide-react";

export function ServicePage({
  eyebrow,
  title,
  intro,
  image,
  alt,
  lead,
  points,
  faqItems,
  cta,
  pains,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  image: string;
  alt?: string;
  lead: string;
  points: string[];
  faqItems?: Array<{ q: string; a: string }>;
  cta?: React.ReactNode;
  pains?: {
    title: string;
    items: string[];
  };
}) {
  return (
    <Layout>
      <PageHero eyebrow={eyebrow} title={title} intro={intro} image={image} alt={alt} />
      
      {pains && (
        <section className="section-pad bg-[var(--porcelain)]/40">
          <div className="container-editorial">
            <div className="mb-12">
              <span className="num-eyebrow">Reconhecendo o sofrimento</span>
              <h2 className="mt-4 font-serif text-[34px] leading-tight sm:text-[42px] md:text-[52px]">
                {pains.title}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {pains.items.map((pain) => (
                <div key={pain} className="quiet-card group flex items-start gap-5 p-7 transition-all hover:bg-[var(--ivory)]">
                   <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--clay)]/10 text-[var(--clay)]">
                      <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
                   </div>
                   <p className="text-[17.5px] font-serif italic leading-[1.6] text-[var(--ink)]/85">
                     "{pain}"
                   </p>
                </div>
              ))}
            </div>
            <div className="mt-14">
              <PrimaryCTA>Gostaria de falar sobre esses sentimentos</PrimaryCTA>
            </div>
          </div>
        </section>
      )}

      <section className="section-pad">
        <div className="container-editorial grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[52px]">
              Um trabalho clínico que prioriza a escuta.
            </h2>
            <p className="safe-measure mt-6 text-[16px] leading-[1.85] text-muted-foreground">
              {lead}
            </p>
          </div>
          <div className="md:col-span-7">
            <ul className="quiet-card grid gap-px overflow-hidden">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex gap-4 bg-[var(--ivory)] p-5 sm:p-6"
                >
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--forest)]" />
                  <span className="text-[15.5px] leading-relaxed text-foreground/78">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            {cta}
          </div>
        </div>
      </section>
      <section className="surface-mist section-pad">
        <div className="container-editorial">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <h2 className="max-w-2xl font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[52px]">
              Outras perspectivas e temas clínicos.
            </h2>
            <Link
              to="/blog"
              className="premium-link text-[13px] tracking-wide text-[var(--forest)]"
            >
              Ver todos os textos
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {serviceAreas.slice(0, 3).map((area) => (
              <Link key={area.to} to={area.to} className="quiet-card group p-6">
                <span className="num-eyebrow">{area.label}</span>
                <h3 className="mt-3 font-serif text-[24px]">{area.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
                <ArrowUpRight className="mt-5 h-4 w-4 text-[var(--forest)] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-editorial">
          <h2 className="font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[52px]">
            Reflexões da clínica
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="border-t border-border pt-6"
              >
                <span className="num-eyebrow">{article.category}</span>
                <h3 className="mt-3 font-serif text-[24px] leading-tight">
                  {article.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {faqItems && faqItems.length > 0 && (
        <section className="section-pad border-t border-border/40">
          <div className="container-editorial max-w-4xl">
            <div className="mb-12">
              <span className="num-eyebrow">Dúvidas comuns</span>
              <h2 className="mt-4 font-serif text-[34px] leading-tight sm:text-[42px] md:text-[52px]">
                Perguntas sobre {eyebrow}
              </h2>
            </div>
            <div className="quiet-card divide-y divide-border p-4 sm:p-8">
              {faqItems.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                    <span className="font-serif text-[21px] leading-tight text-[var(--ink)] sm:text-[23px]">
                      {item.q}
                    </span>
                    <Plus className="mt-1 h-5 w-5 shrink-0 text-[var(--forest)] transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalContact />
    </Layout>
  );
}
