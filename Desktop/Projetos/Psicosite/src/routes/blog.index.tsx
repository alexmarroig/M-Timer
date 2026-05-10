import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { FinalContact, PageHero } from "@/components/site/Primitives";
import { articles, images } from "@/components/site/content";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog de Psicologia: Reflexões e Saúde Mental | Camila Freitas" },
      {
        name: "description",
        content: "Explore artigos sobre ansiedade, relacionamentos, autoconhecimento e o cotidiano clínico. Reflexões da Psicóloga Camila Freitas (PUC-SP) para uma leitura consciente.",
      },
      { property: "og:title", content: "Blog de Psicologia | Reflexões de Camila Freitas" },
      {
        property: "og:description",
        content: "Conteúdo editorial ético sobre psicologia, saúde mental e o percurso terapêutico.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Blog"
        title={<>Reflexões clínicas para ler com calma.</>}
        intro="Uma base editorial preparada para crescer em torno de psicoterapia online, ansiedade, relacionamentos e autoconhecimento."
        image={images.life2}
      />
      <section className="section-pad">
        <div className="container-editorial grid gap-10 md:grid-cols-3">
          {articles.map((article) => (
            <Link 
              key={article.slug} 
              to="/blog/$slug" 
              params={{ slug: article.slug }}
              className="group block"
            >
              <article>
                <div className="photo-shell overflow-hidden rounded-[2rem]">
                  <img
                    src={article.coverImage}
                    alt={`Capa do artigo: ${article.title}`}
                    className="image-wash aspect-[5/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.035] md:aspect-[4/5]"
                    loading="lazy"
                    width={400}
                    height={500}
                  />
                </div>
                <span className="mt-6 block num-eyebrow">{article.category}</span>
                <h2 className="mt-3 font-serif text-[28px] leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--forest)]">
                  {article.title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[var(--clay)] transition-all group-hover:translate-x-1">
                  Ler artigo <span className="h-px w-4 bg-[var(--clay)]" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
      <FinalContact />
    </Layout>
  );
}
