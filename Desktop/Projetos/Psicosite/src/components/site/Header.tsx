import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { camila, images } from "./content";
import { PrimaryCTA } from "./Primitives";

const nav = [
  { to: "/sobre", label: "Sobre" },
  { to: "/psicoterapia-online", label: "Psicoterapia" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/blog", label: "Blog" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
        scrolled || open
          ? "border-b border-border/50 bg-[var(--ivory)]/80 shadow-[0_16px_40px_-32px_var(--ink)] backdrop-blur-xl"
          : "border-b border-transparent bg-[var(--ivory)]/30 backdrop-blur-md"
      }`}
    >
      <div
        className={`absolute inset-0 -z-10 transition-opacity duration-700 grain ${scrolled || open ? "opacity-30" : "opacity-0"}`}
        aria-hidden="true"
      />
      <div className="container-editorial flex h-[76px] items-center justify-between gap-4 md:h-[92px]">
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-3 sm:gap-4"
          aria-label="Psicóloga Camila Freitas"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--ink)]/10 bg-[var(--porcelain)]/80 p-1.5 shadow-soft transition-all duration-300 group-hover:border-[var(--clay)]/35 group-hover:shadow-press md:h-14 md:w-14">
            <img
              src={images.logoVertical}
              alt="Logotipo Psicóloga Camila Freitas - Clínica e Psicoterapia"
              className="h-full w-full scale-[2.15] object-cover object-top opacity-90 transition-transform duration-500 group-hover:scale-[2.25]"
                width={48}
                height={48}
                decoding="async"
              />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="max-w-[188px] truncate font-serif text-[17px] tracking-wide text-[var(--ink)] sm:max-w-none sm:text-[19px] md:text-[21px]">
              Psicóloga Camila Freitas
            </span>
            <span className="mt-1 hidden text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:block md:text-[10px]">
              Psicóloga Clínica · CRP 06/201444
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1.5 rounded-full border border-[var(--ink)]/8 bg-[var(--porcelain)]/62 p-1.5 shadow-soft backdrop-blur md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-4 py-2 text-[12.5px] tracking-wide text-foreground/72 transition-all hover:bg-[var(--sand)]/70 hover:text-[var(--forest)]"
              activeProps={{
                className: "bg-[var(--ivory)] text-[var(--forest)] shadow-soft",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <PrimaryCTA className="hidden md:inline-flex px-5 py-3 min-h-0">
          Agendar
        </PrimaryCTA>

        <button
          onClick={() => setOpen((value) => !value)}
          className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-[var(--ivory)]/76 text-foreground md:hidden"
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-[var(--ivory)] shadow-float md:hidden">
          <div className="container-editorial flex flex-col gap-0 py-6">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-border/40 py-5 text-[17px] font-serif tracking-tight text-[var(--ink)] transition-colors hover:text-[var(--forest)]"
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4 text-[var(--clay)] opacity-40" />
              </Link>
            ))}
            <div className="mt-8">
              <PrimaryCTA className="w-full">
                Agendar sessão de psicoterapia
              </PrimaryCTA>
              <p className="mt-4 text-center text-[12px] text-muted-foreground/70">
                Atendimento online e presencial
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
