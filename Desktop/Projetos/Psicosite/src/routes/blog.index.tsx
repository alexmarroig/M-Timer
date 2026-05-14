import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { FinalContact, PageHero } from "@/components/site/Primitives";
import { articles, images } from "@/components/site/content";
import { z } from "zod";

const blogSearchSchema = z.object({
  category: z.string().optional(),
});

export const Route = createFileRoute("/blog/")({
  validateSearch: (search) => blogSearchSchema.parse(search),
  head: () => ({
    meta: [
      {
        title: "Blog de Psicologia: Reflexões e Saúde Mental | Camila Freitas",
      },
      {
        name: "description",
        content:
          "Explore artigos sobre ansiedade, relacionamentos, autoconhecimento e o cotidiano clínico. Reflexões da Psicóloga Camila Freitas (PUC-SP) para uma leitura consciente.",
      },
      {
        property: "og:title",
        content: "Blog de Psicologia | Reflexões de Camila Freitas",
      },
      {
        property: "og:description",
        content:
          "Conteúdo editorial ético sobre psicologia, saúde mental e o percurso terapêutico.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { category } = Route.useSearch();
  
  const filteredArticles = category 
    ? articles.filter(a => a.category?.toLowerCase() === category.toLowerCase())
    : articles;

  // Ordenar por data (mais recentes primeiro)
  const sortedArticles = [...filteredArticles].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Layout>
      <PageHero
        eyebrow={category ? `Categoria: ${category}` : "Blog"}
        title={category ? <>Reflexões sobre {category}</> : <>Reflexões clínicas para ler com calma.</>}
        intro={category 
          ? `Confira nossos artigos focados em ${category.toLowerCase()} e bem-estar emocional.`
          : "Uma base editorial preparada para crescer em torno de psicoterapia online, ansiedade, relacionamentos e autoconhecimento."
        }
        image={images.life2}
      />
      <section className="section-pad">
        <div className="container-editorial">
          {category && (
             <Link to="/blog" className="mb-12 inline-block text-[13px] uppercase tracking-widest text-[var(--clay)] underline underline-offset-4">
                ← Ver todos os artigos
             </Link>
          )}
          
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {sortedArticles.map((article) => (
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
                      className="image-wash aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                      loading="lazy"
                      width={400}
                      height={500}
                    />
                  </div>
                  <span className="mt-6 block num-eyebrow">
                    {article.category}
                  </span>
                  <h2 className="mt-3 font-serif text-[28px] leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--forest)]">
                    {article.title}
                  </h2>
                  <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[var(--clay)] transition-all group-hover:translate-x-1">
                    Ler artigo <span className="h-px w-4 bg-[var(--clay)]" />
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {sortedArticles.length === 0 && (
            <div className="py-20 text-center">
               <p className="text-muted-foreground">Nenhum artigo encontrado nesta categoria.</p>
               <Link to="/blog" className="mt-6 inline-block text-[var(--forest)] underline">Ver todos</Link>
            </div>
          )}
        </div>
      </section>
      <FinalContact />
    </Layout>
  );
}
