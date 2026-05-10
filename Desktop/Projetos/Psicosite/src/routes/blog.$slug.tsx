import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { FinalContact } from "@/components/site/Primitives";
import { articles, camila, getWhatsAppLink } from "@/components/site/content";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { FadeIn } from "@/components/site/Animations";
import { DocumentRenderer } from '@keystatic/core/renderer';

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw new Error("Artigo não encontrado");
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.article.seoTitle || loaderData?.article.title} | Camila Freitas` },
      { name: "description", content: loaderData?.article.seoDescription || loaderData?.article.excerpt },
      { property: "og:title", content: loaderData?.article.title },
      { property: "og:image", content: loaderData?.article.coverImage },
      { property: "og:type", content: "article" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": loaderData?.article.title,
          "image": loaderData?.article.coverImage,
          "datePublished": loaderData?.article.date,
          "author": {
            "@type": "Person",
            "name": "Camila Freitas",
            "url": "https://psicamilafreitas.com.br/sobre"
          },
          "description": loaderData?.article.excerpt
        })
      }
    ]
  }),
  component: PostPage,
});

function PostPage() {
  const { article } = Route.useLoaderData();

  return (
    <Layout>
      <article className="pb-24 pt-32">
        <div className="container-editorial">
          <FadeIn>
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-[13px] uppercase tracking-widest text-[var(--clay)] transition-colors hover:text-[var(--forest)]"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar ao blog
            </Link>

            <header className="mt-12 max-w-4xl">
              <div className="flex flex-wrap items-center gap-4 text-[12px] uppercase tracking-[0.15em] text-[var(--clay)]/70">
                <span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> {article.category}</span>
                <span className="h-1 w-1 rounded-full bg-[var(--clay)]/30" />
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(article.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <h1 className="mt-6 font-serif text-[42px] leading-[1.1] text-[var(--ink)] sm:text-[54px] md:text-[64px]">
                {article.title}
              </h1>
              <p className="mt-8 text-[18px] leading-relaxed text-[var(--ink)]/80 sm:text-[20px]">
                {article.excerpt}
              </p>
            </header>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-16">
            <div className="aspect-[21/9] w-full overflow-hidden rounded-[2rem]">
              <img 
                src={article.coverImage} 
                alt={`Imagem de capa: ${article.title}`} 
                className="h-full w-full object-cover"
                width={1200}
                height={600}
                fetchPriority="high"
              />
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-16 md:grid-cols-12">
            <div className="prose prose-stone prose-lg md:col-span-8 lg:col-span-7">
              {/* No TanStack Start, o conteúdo Markdoc do Keystatic precisa ser renderizado. 
                  Como o 'article.content' aqui é um objeto JSON (AST), usamos o DocumentRenderer. */}
              <div className="rich-text-content font-serif text-[18px] leading-relaxed text-[var(--ink)]/90 sm:text-[20px]">
                {article.content ? (
                   <DocumentRenderer document={article.content} />
                ) : (
                  <p>Conteúdo em breve...</p>
                )}
              </div>
              
              <div className="mt-20 border-t border-border pt-12">
                <h3 className="font-serif text-[24px]">Interessou-se por este tema?</h3>
                <p className="mt-4 text-muted-foreground">
                  Se você se identificou com este texto e sente que este é o momento de buscar 
                  um espaço de escuta profissional, estou à disposição.
                </p>
                <a 
                  href={getWhatsAppLink(`Olá Psicóloga Camila Freitas, li seu artigo sobre "${article.title}" e gostaria de agendar uma sessão de psicoterapia.`)}
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[var(--forest)] px-8 text-[13px] tracking-wide text-white transition-all hover:bg-[var(--ink)]"
                >
                  Agendar sessão de psicoterapia
                </a>
              </div>
            </div>

            <aside className="md:col-span-4 lg:col-offset-1 lg:col-span-4">
              <div className="sticky top-32 rounded-xl bg-[var(--bone)]/40 p-8">
                <div className="aspect-square w-24 overflow-hidden rounded-full grayscale">
                  <img 
                    src={camila.portrait || "/images/camila-portrait.jpg"} 
                    alt={`Retrato de ${camila.name}`} 
                    className="h-full w-full object-cover" 
                    width={96}
                    height={96}
                    loading="lazy"
                  />
                </div>
                <h4 className="mt-6 font-serif text-[20px]">{camila.name}</h4>
                <p className="mt-2 text-[14px] text-muted-foreground">{camila.approach}</p>
                <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                  Psicóloga formada pela PUC-SP, acompanho adultos em processos de 
                  autoconhecimento e cuidado emocional.
                </p>
                <Link to="/sobre" className="mt-6 block text-[13px] font-medium uppercase tracking-widest text-[var(--clay)] underline decoration-[var(--clay)]/30 underline-offset-4">
                  Saiba mais sobre mim
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>
      <FinalContact />
    </Layout>
  );
}
