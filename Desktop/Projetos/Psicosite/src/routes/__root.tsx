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
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
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
        { name: "keywords", content: "psicóloga sao paulo, psicoterapia online, psicóloga vila nova conceição, terapia ansiedade sp, camila freitas psicóloga, psicólogo junguiano sp, atendimento psicoterapêutico especializado" },
        { property: "og:title", content: "Camila Freitas | Psicóloga Clínica em São Paulo e Online" },
        {
          property: "og:image",
          content: "https://psicosite.vercel.app/images/camila-og.png",
        },
        {
          property: "og:description",
          content: "Atendimento psicológico ético e humano na Vila Nova Conceição e Online. Especialista em ansiedade e relacionamentos.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@psi.cavfreitas" },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        {
          rel: "canonical",
          href: `https://psicamilafreitas.com.br${ctx?.location?.pathname === "/" ? "" : ctx?.location?.pathname || ""}`,
        },
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@300;400;500;600&display=swap",
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
                  "@id": "https://psicamilafreitas.com.br/#person",
                  "name": "Camila Freitas",
                  "jobTitle": "Psicóloga Clínica",
                  "description": "Psicóloga clínica formada pela PUC-SP com foco em atendimento online e presencial na Vila Nova Conceição, São Paulo.",
                  "url": "https://psicamilafreitas.com.br",
                  "telephone": "+5511943937007",
                  "email": "psi.camilafreitas@gmail.com",
                  "sameAs": [
                    "https://instagram.com/psi.cavfreitas"
                  ],
                  "image": "https://psicosite.vercel.app/images/camila-portrait.jpg"
                },
                {
                  "@type": "MedicalBusiness",
                  "@id": "https://psicamilafreitas.com.br/#organization",
                  "name": "Consultório de Psicologia Camila Freitas",
                  "url": "https://psicamilafreitas.com.br",
                  "logo": "https://psicosite.vercel.app/images/camila-logo.png",
                  "image": "https://psicosite.vercel.app/images/consultorio.jpg",
                  "description": "Atendimento psicológico especializado em ansiedade, relacionamentos e autoconhecimento na Vila Nova Conceição, São Paulo.",
                  "telephone": "+5511943937007",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Vila Nova Conceição",
                    "addressLocality": "São Paulo",
                    "addressRegion": "SP",
                    "postalCode": "04508-030",
                    "addressCountry": "BR"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": -23.5888,
                    "longitude": -46.6667
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      "opens": "08:00",
                      "closes": "21:00"
                    }
                  ],
                  "priceRange": "$$$"
                }
              ]
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
