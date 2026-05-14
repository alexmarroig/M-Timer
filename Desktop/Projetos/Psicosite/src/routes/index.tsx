import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import {
  Eyebrow,
  FinalContact,
  PrimaryCTA,
  SecondaryCTA,
  InstagramIcon,
} from "@/components/site/Primitives";
import {
  articles,
  camila,
  faqs,
  images,
  instagramTiles,
  serviceAreas,
  homepage,
  instagramSection,
} from "@/components/site/content";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
  TextReveal,
  ParallaxMedia,
} from "@/components/site/Animations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Psicóloga Camila Freitas | Psicoterapia em São Paulo (Vila Nova Conceição) e Online",
      },
      {
        name: "description",
        content: "Encontre acolhimento com a Psicóloga Camila Freitas (PUC-SP). Psicoterapia online e presencial na Vila Nova Conceição. Especialista em ansiedade, relacionamentos e autoconhecimento.",
      },
      {
        property: "og:title",
        content: "Camila Freitas | Psicóloga Clínica em São Paulo e Online",
      },
      {
        property: "og:description",
        content: "Atendimento psicológico ético e humano na Vila Nova Conceição e online.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Layout>
      <Hero />
      <SignatureStrip />
      <EmotionalMap />
      <ClinicalHelp />
      <Areas />
      <About />
      <Process />
      <FAQPreview />
      <BlogPreview />
      <SocialSection />
      <FinalContact />
    </Layout>
  );
}

function Hero() {
  return (
    <section className="surface-porcelain relative overflow-hidden md:min-h-[calc(100vh-92px)]">
      <div
        aria-hidden
        className="absolute left-0 top-0 h-full w-[16vw] border-r border-[var(--ink)]/5 bg-[var(--bone)]/42"
      />
      <div className="container-editorial relative grid gap-11 pb-16 pt-8 sm:pt-10 md:min-h-[calc(100vh-92px)] md:grid-cols-12 md:items-center md:pb-20 md:pt-12">
        <div className="premium-opening-content md:col-span-7 md:pr-6">
          <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 md:mb-10">
            <span className="section-kicker">
              Psicóloga Camila Freitas em São Paulo e Online
            </span>
            <span className="h-px w-8 bg-[var(--clay)]/55 sm:w-12" />
            <span className="section-kicker">CRP 06/201444</span>
          </div>

          <p className="font-serif text-[28px] leading-none text-[var(--clay)] sm:text-[34px] md:text-[44px]">
            Psicóloga Camila Freitas
          </p>
          <h1 className="mt-4 max-w-[780px] mobile-balance font-serif text-[38px] leading-tight text-[var(--ink)] sm:text-[54px] md:mt-5 md:text-[78px] lg:text-[90px]">
            <TextReveal delay={0.4}>
              {homepage.heroHeadline}
            </TextReveal>
          </h1>
          <p className="hero-subheadline safe-measure mt-7 text-pretty text-[16px] leading-[1.8] text-foreground/74 md:mt-8 md:text-[18px]">
            Psicoterapia para adultos que buscam um espaço de escuta real, ética e especializada. Atendimento exclusivamente particular na Vila Nova Conceição ou online, focado na singularidade de cada história.
          </p>

          <div className="mobile-stack mt-12 flex flex-wrap items-center gap-4 sm:gap-5 md:mt-10">
            <PrimaryCTA message="default">Agendar primeiro contato</PrimaryCTA>
            <SecondaryCTA to="/como-funciona">
              Investimento e Processo
            </SecondaryCTA>
          </div>
          <p className="mt-6 max-w-md text-[13px] leading-relaxed text-muted-foreground/80 md:mt-5">
            O retorno é feito pessoalmente pela Camila, com informações sobre horários disponíveis e investimento.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border/40 pt-8 sm:gap-6">
            <img
              src={images.portrait}
              alt="Retrato da Psicóloga Camila Freitas (PUC-SP)"
              className="h-14 w-14 rounded-full border border-border bg-[var(--sand)] object-cover grayscale-[0.3] shadow-soft"
              loading="lazy"
              width={56}
              height={56}
            />
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--clay)]">
                Formação e Registro
              </span>
              <p className="mt-1 font-serif text-[18px] leading-tight text-[var(--ink)] sm:text-[20px]">
                {camila.education} · {camila.crp}
              </p>
            </div>
          </div>
        </div>

        <div className="premium-opening-image md:col-span-5">
          <div className="relative md:pl-8">
            <div className="absolute -left-8 top-10 hidden h-[72%] w-px bg-gradient-to-b from-transparent via-[var(--clay)]/40 to-transparent md:block" />
            <ParallaxMedia
              offset={30}
              className="editorial-frame photo-shell group relative rounded-[2.5rem] shadow-float transition-transform duration-500 hover:scale-[1.01]"
            >
              <img
                src={images.camilaSittingFull}
                alt="Psicóloga Camila Freitas em seu consultório na Vila Nova Conceição, São Paulo"
                className="image-wash h-[430px] w-full object-cover transition-all duration-700 group-hover:scale-105 sm:h-[520px] md:h-[680px]"
                width={1024}
                height={1280}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <div className="grain pointer-events-none absolute inset-0 opacity-[0.15]" />
              <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--ink)]/80 via-[var(--ink)]/30 to-transparent px-6 pb-6 pt-24 text-[var(--ivory)]">
                <span className="block font-serif text-[30px] italic">
                  escuta ética
                </span>
                <span className="mt-2 block max-w-xs text-[12px] leading-relaxed text-[var(--ivory)]/80">
                  Presença clínica e acolhimento na Vila Nova Conceição e online.
                </span>
              </figcaption>
            </ParallaxMedia>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignatureStrip() {
  return (
    <div className="border-y border-border bg-[var(--ink)] text-[var(--ivory)]">
      <div className="container-editorial grid gap-4 py-5 text-[10.5px] uppercase tracking-[0.24em] text-[var(--ivory)]/62 md:grid-cols-4">
        {[
          "Psicoterapia adulta",
          "Atendimento ético",
          "Online e presencial",
          "Vila Nova Conceição · SP",
        ].map((item) => (
          <span key={item} className="flex items-center gap-3">
            <span className="h-1 w-1 rounded-full bg-[var(--brass)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function EmotionalMap() {
  const items = [
    "Quando a ansiedade surge no corpo antes mesmo de virar pensamento.",
    "Quando o desânimo se instala e a vida parece perder o colorido ou movimento.",
    "Quando as relações começam a repetir dores conhecidas e difíceis de nomear.",
    "Quando existe o desejo de se escutar sem a pressão por desempenho ou performance.",
  ];

  return (
    <section className="section-pad relative">
      <div className="container-editorial grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Eyebrow n="01">O momento de buscar ajuda</Eyebrow>
          <h2 className="mt-7 max-w-md mobile-balance font-serif text-[34px] leading-[1.05] sm:text-[42px] md:text-[58px]">
            O sofrimento nem sempre grita. Às vezes, ele apenas pede escuta.
          </h2>
        </div>
        <FadeIn delay={0.1} className="md:col-span-7">
          <StaggerChildren className="grid gap-px bg-border">
            {items.map((item, index) => (
              <StaggerItem
                key={item}
                className="group grid gap-3 bg-[var(--ivory)] px-5 py-6 text-[16.5px] leading-relaxed text-foreground/82 transition-colors hover:bg-[var(--porcelain)] sm:text-[18px] md:grid-cols-[96px_1fr] md:gap-6 md:px-7 md:py-7"
              >
                <span className="num-eyebrow transition-transform group-hover:translate-x-1">
                  0{index + 1}
                </span>
                <span>{item}</span>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </FadeIn>
      </div>
    </section>
  );
}

function ClinicalHelp() {
  return (
    <section className="surface-mist section-pad relative overflow-hidden">
      <div className="container-editorial grid gap-16 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <figure className="editorial-frame photo-shell group overflow-hidden rounded-[2rem] shadow-float transition-all duration-500 hover:shadow-elev">
            <img
              src={images.life2}
              alt="Ambiente clínico acolhedor para psicoterapia com Camila Freitas"
              className="image-wash aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="grain pointer-events-none absolute inset-0 opacity-[0.1]" />
          </figure>
        </div>
        <div className="md:col-span-7 md:pl-10">
          <FadeIn>
            <Eyebrow n="02">O trabalho clínico</Eyebrow>
            <h2 className="mt-7 max-w-3xl mobile-balance font-serif text-[34px] leading-[1.05] sm:text-[42px] md:text-[62px]">
              Terapia não é conserto. É um modo de dar lugar ao que insiste.
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-6 text-[16px] leading-[1.85] text-foreground/76 md:grid-cols-2">
            <p>
              Na clínica, o que parece confuso pode ganhar contorno. A escuta ajuda a sustentar perguntas, reconhecer repetições e nomear afetos que antes não tinham palavra.
            </p>
            <p>
              O processo respeita o tempo de cada pessoa. Sem promessas de fórmulas mágicas, sem atalhos e sem as respostas prontas que o mundo lá fora costuma oferecer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Areas() {
  return (
    <section className="section-pad">
      <div className="container-editorial">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow n="03">Temas de atendimento</Eyebrow>
            <h2 className="mt-7 max-w-3xl mobile-balance font-serif text-[34px] leading-[1.05] sm:text-[42px] md:text-[62px]">
              <TextReveal delay={0.05}>
                Portas de entrada para um processo sempre singular.
              </TextReveal>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              As áreas ajudam a nomear uma busca, mas o trabalho clínico não
              reduz ninguém a um tema.
            </p>
            <Link to="/sobre" className="premium-link mt-6 text-[13px]">
              Conhecer a abordagem
            </Link>
          </div>
        </div>

        <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-16 md:gap-5">
          {serviceAreas.map((area, index) => (
            <StaggerItem key={area.to}>
              <Link
                to={area.to}
                className="quiet-card group flex h-full min-h-[360px] flex-col overflow-hidden rounded-[2rem] md:min-h-[400px]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={area.image}
                    alt={`Atendimento especializado em ${area.label} com a Psicóloga Camila Freitas`}
                    className="image-wash aspect-[5/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.045] md:aspect-[4/5]"
                    width={400}
                    height={500}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute left-5 top-5 font-serif text-[28px] italic text-[var(--ivory)] mix-blend-difference">
                    0{index + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-[26px] leading-tight text-[var(--ink)]">
                    {area.label}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                    {area.description}
                  </p>
                  <ArrowUpRight className="mt-auto h-5 w-5 text-[var(--forest)] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="surface-forest section-pad relative overflow-hidden">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="container-editorial relative grid gap-16 md:grid-cols-12 md:items-center">
        <div className="md:col-span-6">
          <div className="relative">
            <ParallaxMedia
              offset={20}
              className="photo-shell overflow-hidden rounded-[2.5rem] bg-[var(--sand)] shadow-float"
            >
              <img
                src={images.portrait}
                alt="Psicóloga Camila Freitas - Atendimento Clínico na Vila Nova Conceição"
                className="mx-auto aspect-[5/6] w-full max-w-[520px] object-cover object-center"
                loading="lazy"
                width={520}
                height={624}
              />
            </ParallaxMedia>
            <FadeIn
              delay={0.2}
              className="relative z-10 -mt-12 ml-auto mr-4 max-w-[330px] bg-[var(--ivory)] p-6 shadow-float sm:absolute sm:-bottom-8 sm:right-6 sm:mr-0 sm:p-7 rounded-[2rem]"
            >
              <span className="num-eyebrow">Camila Freitas</span>
              <p className="mt-3 font-serif text-[24px] leading-tight text-[var(--ink)]">
                Psicóloga clínica formada pela PUC-SP.
              </p>
            </FadeIn>
          </div>
        </div>
        <FadeIn delay={0.1} className="md:col-span-6 md:pl-8">
          <Eyebrow n="04">
            <span className="text-[var(--ivory)]/72">
              Sobre a Psicóloga Camila Freitas
            </span>
          </Eyebrow>
          <h2 className="mt-7 mobile-balance font-serif text-[36px] leading-[1.03] text-[var(--ivory)] sm:text-[44px] md:text-[66px]">
            <TextReveal delay={0.1}>
              Autoridade que não pesa. Presença que sustenta.
            </TextReveal>
          </h2>
          <div className="mt-8 space-y-5 text-[16px] leading-[1.85] text-[var(--ivory)]/76">
            <p>
              Olá, muito prazer. Sou Camila Freitas, psicóloga clínica formada
              pela PUC-SP, com atendimento para adultos em psicoterapia online e
              presencial.
            </p>
            <p>
              Em 2024 fundei meu consultório em São Paulo, na Vila Nova
              Conceição. Minha prática se orienta pela Psicologia Analítica
              (Junguiana), pelo sigilo profissional e pelo respeito à
              singularidade de cada história.
            </p>
            <p>
              Ao longo da minha trajetória, trabalhei com temas como ansiedade,
              depressão, vínculos, dependência química e tecnológica, violência
              doméstica, saúde mental, psicodiagnóstico e cuidado clínico.
            </p>
          </div>
          <blockquote className="mt-8 border-l border-[var(--brass)]/60 pl-5 font-serif text-[22px] leading-snug text-[var(--ivory)]/90">
            Quem olha para fora, sonha. Quem olha para dentro, desperta.
            <cite className="mt-3 block text-[12px] not-italic uppercase tracking-[0.22em] text-[var(--ivory)]/48">
              Carl G. Jung
            </cite>
          </blockquote>
          <dl className="mt-10 grid gap-px bg-[var(--ivory)]/12 text-[13px] sm:grid-cols-2">
            {[
              ["Registro", camila.crp],
              ["Formação", camila.education],
              ["Abordagem", camila.approach],
              ["Local", "Vila Nova Conceição"],
            ].map(([k, v]) => (
              <div key={k} className="bg-[var(--forest)]/72 p-5">
                <dt className="text-[var(--ivory)]/54">{k}</dt>
                <dd className="mt-1 font-serif text-[19px] text-[var(--ivory)]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    [
      "Primeiro contato",
      "Você envia uma breve mensagem. A Camila responde pessoalmente para tirar dúvidas e avaliar disponibilidade.",
    ],
    [
      "Sessão inicial",
      "Um encontro para compreender sua busca e avaliar a possibilidade de acompanhamento.",
    ],
    [
      "Continuidade",
      "Sessões de 50 minutos, em geral semanais, online ou presenciais em São Paulo.",
    ],
    [
      "Percurso clínico",
      "Um processo construído no tempo possível, com cuidado, sigilo e responsabilidade.",
    ],
  ];

  return (
    <section className="section-pad">
      <div className="container-editorial">
        <FadeIn>
          <Eyebrow n="05">Como funciona</Eyebrow>
          <div className="mt-7 grid gap-8 md:grid-cols-12">
            <h2 className="mobile-balance font-serif text-[34px] leading-[1.05] sm:text-[42px] md:col-span-6 md:text-[58px]">
              Clareza para começar. Tempo para elaborar.
            </h2>
            <p className="text-[16px] leading-[1.8] text-muted-foreground md:col-span-5 md:col-start-8">
              O início da terapia não precisa ser burocrático. O essencial é
              criar um primeiro contato cuidadoso, transparente e ético.
            </p>
          </div>
        </FadeIn>
        <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 md:grid-cols-4">
          {steps.map(([title, text], index) => (
            <StaggerItem
              key={title}
              className="quiet-card p-7 sm:p-8"
            >
              <span className="font-serif text-[34px] italic text-[var(--clay)]">
                0{index + 1}
              </span>
              <h3 className="mt-8 font-serif text-[25px]">{title}</h3>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
                {text}
              </p>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

function FAQPreview() {
  return (
    <section className="surface-mist section-pad">
      <div className="container-editorial grid gap-14 md:grid-cols-12">
        <FadeIn className="md:col-span-4">
          <Eyebrow n="06">FAQ</Eyebrow>
          <h2 className="mt-7 font-serif text-[34px] leading-[1.06] sm:text-[42px] md:text-[54px]">
            Dúvidas comuns, respondidas sem ruído.
          </h2>
        </FadeIn>
        <div className="md:col-span-8">
          <StaggerChildren className="quiet-card divide-y divide-border p-5 sm:p-6 md:p-8">
            {faqs.slice(0, 5).map((faq) => (
              <StaggerItem key={faq.q}>
                <details className="group py-5 md:py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                    <span className="font-serif text-[21px] leading-tight text-[var(--ink)] sm:text-[23px]">
                      {faq.q}
                    </span>
                    <Plus className="mt-1 h-5 w-5 shrink-0 text-[var(--forest)] transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              </StaggerItem>
            ))}
          </StaggerChildren>
          <Link to="/faq" className="premium-link mt-8 text-[13px]">
            Ver todas as perguntas
          </Link>
        </div>
      </div>
    </section>
  );
}

function BlogPreview() {
  return (
    <section className="section-pad">
      <div className="container-editorial">
        <FadeIn className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <Eyebrow n="07">Conteúdo</Eyebrow>
            <h2 className="mt-7 mobile-balance font-serif text-[34px] leading-[1.05] sm:text-[42px] md:text-[62px]">
              Um pequeno caderno clínico.
            </h2>
          </div>
          <Link to="/blog" className="premium-link text-[13px]">
            Ver blog
          </Link>
        </FadeIn>
        <StaggerChildren className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
          {articles.slice(0, 3).map((article, index) => (
            <StaggerItem
              key={article.slug}
              className={`${index === 0 ? "md:col-span-6" : "md:col-span-3"} group`}
            >
              <Link 
                to="/blog/$slug" 
                params={{ slug: article.slug }}
                className="block"
              >
                <div className="overflow-hidden rounded-[2rem]">
                  <img
                    src={article.coverImage}
                    alt={`Leitura sobre ${article.title} - Blog de Psicologia Camila Freitas`}
                    className={`${index === 0 ? "aspect-[5/4]" : "aspect-[4/5]"} image-wash w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]`}
                    width={index === 0 ? 800 : 400}
                    height={index === 0 ? 640 : 500}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="mt-6 block num-eyebrow">{article.category}</span>
                <h3 className="mt-3 font-serif text-[27px] leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--forest)]">
                  {article.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

function SocialSection() {
  return (
    <section id="social" className="surface-porcelain relative overflow-hidden py-24 md:py-32">
      {/* Mini Banner / Callout - Now more vibrant and premium */}
      <div className="container-editorial mb-24">
        <FadeIn className="group relative flex flex-col items-center overflow-hidden rounded-[2.5rem] bg-[var(--ink)] p-8 text-center md:flex-row md:p-14 md:text-left shadow-float">
          {/* Animated Background Gradient */}
          <div 
            className="absolute inset-0 opacity-10 transition-opacity duration-700 group-hover:opacity-20" 
            style={{ background: 'var(--insta-gradient)' }} 
          />
          
          <div className="relative z-10 md:flex-1">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--insta-gradient)] p-1.5 text-white shadow-lg">
                <InstagramIcon className="h-full w-full" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--brass)]">
                Espaço Editorial
              </span>
            </div>
            <h3 className="mt-6 font-serif text-[32px] leading-[1.1] text-[var(--ivory)] sm:text-[42px] md:text-[52px]">
              Um convite à reflexão, <br className="hidden md:block" /> além do consultório.
            </h3>
            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-[var(--ivory)]/75">
              Um espaço de conteúdo vivo para seguir a conversa além do site. Acompanhe reflexões sobre ansiedade, relações e o cotidiano emocional.
            </p>
          </div>
          
          <div className="relative z-10 mt-12 md:mt-0 md:ml-12">
            <a
              href={camila.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-[var(--ivory)] px-10 text-[13px] font-semibold tracking-widest text-[var(--ink)] transition-all hover:scale-105 active:scale-95 shadow-soft"
            >
              <span className="relative z-10 flex items-center gap-2">
                Acompanhar no Instagram
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>
        </FadeIn>
      </div>

      <div className="container-editorial">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Destaques Curados</Eyebrow>
            <h2 className="mt-6 mobile-balance font-serif text-[38px] leading-tight text-[var(--ink)] sm:text-[48px]">
              {instagramSection.title}
            </h2>
          </div>
          <a 
            href={camila.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-link text-[13px] font-medium text-[var(--clay)]"
          >
            Ver perfil completo
          </a>
        </div>

        <StaggerChildren className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {instagramTiles.map((tile) => (
            <StaggerItem key={tile.title}>
              <a
                href={tile.url || camila.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="quiet-card group flex flex-col overflow-hidden rounded-[2rem] border-none bg-white shadow-soft transition-all hover:shadow-elev"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    width={400}
                    height={400}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brass)]">
                      {tile.label || 'Ver post'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--clay)]/60">
                    {tile.tag}
                  </span>
                  <h3 className="mt-3 font-serif text-[22px] leading-snug text-[var(--ink)] transition-colors group-hover:text-[var(--forest)]">
                    {tile.title}
                  </h3>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
