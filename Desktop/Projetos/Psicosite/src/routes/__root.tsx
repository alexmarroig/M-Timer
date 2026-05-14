import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import fontsCss from "../fonts.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo saiu do esperado. Você pode tentar atualizar ou voltar para a
          página inicial.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: (ctx) => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Encontre acolhimento com a Psicóloga Camila Freitas (PUC-SP). Atendimento especializado em ansiedade, relacionamentos e autoconhecimento. Terapia Online e Presencial na Vila Nova Conceição, SP. Agende sua sessão.",
        },
        { name: "author", content: "Camila Freitas" },
        {
          name: "keywords",
          content:
            "psicóloga sao paulo, psicoterapia online, psicóloga vila nova conceição, terapia ansiedade sp, camila freitas psicóloga, psicólogo junguiano sp, atendimento psicoterapêutico especializado",
        },
        {
          property: "og:title",
          content: "Camila Freitas | Psicóloga Clínica em São Paulo e Online",
        },
        {
          property: "og:image",
          content: "https://psicavfreitas.com.br/images/camila-og.png",
        },
        {
          property: "og:description",
          content:
            "Atendimento psicológico ético e humano na Vila Nova Conceição e Online. Especialista em ansiedade e relacionamentos.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@psi.cavfreitas" },
        {
          name: "robots",
          content:
            "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        },
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        {
          rel: "canonical",
          href: `https://psicavfreitas.com.br${ctx?.location?.pathname === "/" ? "" : ctx?.location?.pathname || ""}`,
        },
        { rel: "stylesheet", href: fontsCss },
        { rel: "stylesheet", href: appCss },
        {
          rel: "preload",
          href: "/fonts/manrope-latin.woff2",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
        },
        {
          rel: "preload",
          href: "/fonts/cormorant-latin.woff2",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
        },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://psicavfreitas.com.br/#person",
                  name: "Camila Freitas",
                  jobTitle: "Psicóloga Clínica",
                  description:
                    "Psicóloga clínica formada pela PUC-SP com foco em atendimento online e presencial na Vila Nova Conceição, São Paulo.",
                  url: "https://psicavfreitas.com.br",
                  telephone: "+5511943937007",
                  email: "psi.camilafreitas@gmail.com",
                  sameAs: ["https://instagram.com/psi.cavfreitas"],
                  image:
                    "https://psicavfreitas.com.br/images/camila-portrait.jpg",
                },
                {
                  "@type": "MedicalBusiness",
                  "@id": "https://psicavfreitas.com.br/#organization",
                  name: "Consultório de Psicologia Camila Freitas",
                  url: "https://psicavfreitas.com.br",
                  logo: "https://psicavfreitas.com.br/images/camila-logo.png",
                  image: "https://psicavfreitas.com.br/images/consultorio.jpg",
                  description:
                    "Atendimento psicológico especializado em ansiedade, relacionamentos e autoconhecimento na Vila Nova Conceição, São Paulo.",
                  telephone: "+5511943937007",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Vila Nova Conceição",
                    addressLocality: "São Paulo",
                    addressRegion: "SP",
                    postalCode: "04508-030",
                    addressCountry: "BR",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: -23.5888,
                    longitude: -46.6667,
                  },
                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ],
                      opens: "08:00",
                      closes: "21:00",
                    },
                  ],
                  priceRange: "$$$",
                },
                {
                  "@type": "PsychologicalService",
                  "@id": "https://psicavfreitas.com.br/#service",
                  name: "Psicoterapia Individual e Online",
                  provider: { "@id": "https://psicavfreitas.com.br/#person" },
                  areaServed: {
                    "@type": "City",
                    name: "São Paulo",
                  },
                  description:
                    "Atendimento psicoterapêutico especializado para adultos, focado em ansiedade, depressão e relacionamentos.",
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
