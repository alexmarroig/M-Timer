import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { FinalContact } from "@/components/site/Primitives";
import { articles, camila, getWhatsAppLink, images } from "@/components/site/content";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { FadeIn } from "@/components/site/Animations";
import { useMemo } from 'react';

/** Convert simple Markdoc/Markdown (.mdoc) raw text into safe HTML */
function mdocToHtml(raw: string): string {
  if (!raw) return '';
  let html = raw
    // Escape HTML entities to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Images: ![alt](src) — must be before links
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure><img src="$2" alt="$1" loading="lazy" /><figcaption>$1</figcaption></figure>')
    // Bold: **text**
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Headings: ## h2, ### h3
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Links: [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Unordered list items: - item or * item
    .replace(/^[\-\*] (.+)$/gm, '<li>$1</li>')
    // Ordered list items: 1. item
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Horizontal rule: ---
    .replace(/^---$/gm, '<hr />');

  // Wrap consecutive <li> elements in <ul> 
  html = html.replace(/(<li>.+?<\/li>\n?)+/gs, (match) => `<ul>${match}</ul>`);

  // Convert double newlines to paragraphs, but skip elements already wrapped in block tags
  const blocks = html.split(/\n\n+/);
  html = blocks
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-6]|ul|ol|li|figure|hr|blockquote)/.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');

  return html;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    // Mapeamento de slugs antigos ou incorretos para os atuais (Corrige erros 500 de links antigos)
    const slugMap: Record<string, string> = {
      'superando-o-luto-com-a-terapia-online': 'superando-luto-terapia-online',
      'expectativas-para-o-inicio-da-terapia': 'expectativas-inicio-terapia',
      'ansiedade-quando-buscar-ajuda-profissional': 'ansiedade-quando-buscar-ajuda',
    };

    const targetSlug = slugMap[params.slug] || params.slug;
    const article = articles.find((a) => a.slug === targetSlug);
    
    if (!article) {
      console.error(`Artigo não encontrado para o slug: ${params.slug}`);
      throw new Error("Artigo não encontrado");
    }
    
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
            "url": "https://psicavfreitas.com.br/sobre"
          },
          "description": loaderData?.article.excerpt
        })
      }
    ]
  }),
  component: PostPage,
});

function RenderedContent({ rawContent }: { rawContent: string }) {
  const html = useMemo(() => mdocToHtml(rawContent), [rawContent]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

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
            <div className="aspect-[16/9] w-full overflow-hidden rounded-[2rem]">
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
              {/* O conteúdo .mdoc é carregado como texto raw e convertido para HTML */}
              <div className="rich-text-content font-serif text-[18px] leading-relaxed text-[var(--ink)]/90 sm:text-[20px]">
                {article.rawContent ? (
                   <RenderedContent rawContent={article.rawContent} />
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
                    src={images.portrait} 
                    alt={`Retrato de ${camila.name}`} 
                    className="h-full w-full object-cover" 
                    width={96}
                    height={96}
                    loading="lazy"
                  />
                </div>
                <h4 className="mt-6 font-serif text-[20px]">{camila.brandedName || `Psicóloga ${camila.name}`}</h4>
                <p className="mt-2 text-[14px] text-muted-foreground">{camila.approach}</p>
                <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                  Psicóloga formada pela PUC-SP, acompanho adultos em processos de 
                  autoconhecimento e cuidado emocional.
                </p>
                <Link to="/sobre" className="mt-6 block text-[13px] font-medium uppercase tracking-widest text-[var(--clay)] underline decoration-[var(--clay)]/30 underline-offset-4">
                  Saiba mais sobre mim
                </Link>
            </aside>
          </div>
          <section className="mt-24 border-t border-border pt-16 md:col-span-8 lg:col-span-7">
            <h3 className="font-serif text-[28px] text-[var(--ink)]">Comentários e Reflexões</h3>
            <p className="mt-2 text-muted-foreground">O espaço de comentários é moderado para garantir a ética e o acolhimento profissional.</p>
            
            <div className="mt-10 space-y-10">
              <div className="rounded-2xl bg-[var(--bone)]/30 p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--clay)]/10 text-[18px]">
                  💭
                </div>
                <h4 className="mt-6 font-serif text-[20px]">Ainda não há comentários públicos.</h4>
                <p className="mt-3 text-[15px] text-muted-foreground">
                  Seja a primeira pessoa a compartilhar uma reflexão sobre este tema ou envie sua dúvida diretamente para a Psicóloga Camila.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <a 
                    href={getWhatsAppLink(`Olá Camila, li seu artigo sobre "${article.title}" e gostaria de compartilhar uma reflexão ou tirar uma dúvida.`)}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--forest)] px-8 text-[13px] font-medium text-white transition-all hover:bg-[var(--ink)]"
                  >
                    Enviar comentário via WhatsApp
                  </a>
                  <a 
                    href={`mailto:${camila.email}?subject=Comentário sobre o artigo: ${article.title}`}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--clay)] px-8 text-[13px] font-medium text-[var(--clay)] transition-all hover:bg-[var(--clay)] hover:text-white"
                  >
                    Enviar por E-mail
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </article>
      <FinalContact />
    </Layout>
  );
}

