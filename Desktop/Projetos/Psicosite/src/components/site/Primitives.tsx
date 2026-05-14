import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Instagram as InstagramLucide,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { track } from "@vercel/analytics";

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
import { camila, getWhatsAppLink, whatsappMessages, images } from "./content";
import {
  FadeIn,
  MagneticButton,
  StaggerChildren,
  StaggerItem,
} from "./Animations";

export function Eyebrow({
  children,
  n,
}: {
  children: React.ReactNode;
  n?: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
      {n && <span className="font-serif italic text-[var(--clay)]">{n}</span>}
      <span className="h-px w-8 translate-y-[-3px] bg-[var(--clay)]/60" />
      {children}
    </span>
  );
}

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { X, AlertCircle, Info, Receipt, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ContactIcon = React.ComponentType<{ className?: string }>;

export function PrimaryCTA({
  children = "Agendar sessão de psicoterapia",
  message = "default",
  className = "",
}: {
  children?: React.ReactNode;
  message?: keyof typeof whatsappMessages | string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className={cn(
            "focus-ring group relative inline-flex min-h-[56px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-[var(--forest)] px-7 py-4 text-center text-[13px] tracking-wide text-[var(--ivory)] shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--ink)] hover:shadow-press md:min-h-[48px]",
            className,
          )}
        >
          <span className="relative">{children}</span>
          <span
            aria-hidden
            className="relative inline-block h-px w-5 bg-[var(--brass)] transition-all group-hover:w-8"
          />
        </button>
      </Dialog.Trigger>
      <LeadQualificationModal open={open} setOpen={setOpen} message={message} />
    </Dialog.Root>
  );
}

export function LeadQualificationModal({
  open,
  setOpen,
  message,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  message: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--ink)]/58 backdrop-blur-sm transition-all animate-in fade-in" />
      <Dialog.Content className="fixed inset-x-3 top-3 z-50 max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[1.35rem] bg-[var(--ivory)] shadow-elev focus:outline-none animate-in zoom-in-95 fade-in duration-300 sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-[92vw] sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[2rem]">
        <div className="relative hidden h-40 w-full overflow-hidden sm:block sm:h-48">
          <img
            src={images.lifeReading}
            alt="Ambiente calmo e acolhedor"
            className="image-wash h-full w-full object-cover brightness-90"
          />
          <div className="grain pointer-events-none absolute inset-0 opacity-[0.08]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ivory)] via-transparent to-transparent" />
        </div>

        <div className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 sm:max-h-none sm:px-10 sm:pb-8 sm:pt-6">
          <Dialog.Title className="pr-12 font-serif text-[28px] leading-[1.08] text-[var(--ink)] sm:pr-0 sm:text-[36px]">
            Antes de agendar, é importante saber:
          </Dialog.Title>

          <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-7">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--clay)]/10 text-[var(--clay)] sm:h-12 sm:w-12">
                <Info className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--clay)]">
                  Investimento
                </h4>
                <p className="mt-1.5 text-[15.5px] leading-relaxed text-foreground/90 sm:text-[18px]">
                  Sessões individuais de 50 min com investimento a partir de{" "}
                  <span className="font-bold text-[var(--ink)]">R$ 200,00</span>
                  .
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--forest)]/10 text-[var(--forest)] sm:h-12 sm:w-12">
                <Receipt className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--forest)]">
                  Reembolso
                </h4>
                <p className="mt-1.5 text-[15.5px] leading-relaxed text-foreground/90 sm:text-[18px]">
                  Atendimento{" "}
                  <span className="font-bold text-[var(--ink)]">
                    particular
                  </span>{" "}
                  com emissão de recibo para você solicitar{" "}
                  <span className="font-bold text-[var(--ink)]">reembolso</span>{" "}
                  ao seu convênio.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 sm:h-12 sm:w-12">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[12px] font-bold uppercase tracking-[0.15em] text-amber-700">
                  Aviso importante
                </h4>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-foreground/75 italic sm:text-[16px]">
                  Não realizamos pronto-atendimento de urgência. Em caso de
                  crise aguda, ligue para o{" "}
                  <span className="font-bold text-amber-800">CVV (188)</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 -mx-5 mt-7 flex flex-col gap-3 border-t border-border/70 bg-[var(--ivory)]/96 px-5 pb-1 pt-4 backdrop-blur sm:static sm:mx-0 sm:mt-10 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0">
            <div className="text-center">
              <a
                href={getWhatsAppLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track("click_whatsapp_qualified", { message });
                  setOpen(false);
                }}
                className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full bg-[#123c2b] px-6 text-[14px] font-bold tracking-wide text-white shadow-soft transition-all hover:bg-[var(--ink)] hover:shadow-elev active:scale-[0.98] sm:min-h-[64px] sm:px-8 sm:text-[15px]"
              >
                <MessageCircle className="h-5 w-5" />
                Ir para o WhatsApp
              </a>
            </div>

            <Dialog.Close asChild>
              <button className="min-h-11 text-[12px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground">
                Fechar e voltar ao site
              </button>
            </Dialog.Close>
          </div>
        </div>

        <Dialog.Close asChild>
          <button
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-[var(--ink)]/10 bg-[var(--ivory)]/92 text-[var(--ink)] shadow-soft backdrop-blur-md transition-colors hover:bg-white sm:right-6 sm:top-6"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function SecondaryCTA({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <MagneticButton strength={8}>
      <Link
        to={to}
        className="focus-ring group inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full border border-[var(--ink)]/18 bg-[var(--ivory)]/45 px-7 py-4 text-center text-[13px] tracking-wide text-[var(--ink)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[var(--forest)] hover:bg-[var(--ivory)] hover:text-[var(--forest)] md:min-h-[48px]"
      >
        {children}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </MagneticButton>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  alt,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  image?: string;
  alt?: string;
}) {
  return (
    <section className="surface-mist relative overflow-hidden border-b border-border">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-7 max-w-4xl text-balance font-serif text-[38px] leading-[1.04] text-[var(--ink)] sm:text-[46px] md:text-[68px]">
            {title}
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-[17px] leading-[1.75] text-foreground/75">
            {intro}
          </p>
          <div className="mobile-stack mt-10 flex flex-wrap gap-4">
            <PrimaryCTA>Agendar sessão de psicoterapia</PrimaryCTA>
            <SecondaryCTA to="/como-funciona">Entender o processo</SecondaryCTA>
          </div>
        </div>
        {image && (
          <div className="md:col-span-5">
            <figure className="editorial-frame photo-shell overflow-hidden rounded-[2.5rem] shadow-elev">
              <img
                src={image}
                alt={
                  alt ||
                  `Imagem de fundo para ${eyebrow} - Psicóloga Camila Freitas`
                }
                className="image-wash aspect-[4/5] w-full object-cover"
                width={800}
                height={1000}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </figure>
          </div>
        )}
      </div>
    </section>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

import { useBrandingContext } from "@/hooks/useBrandingContext";

export function QualifiedWhatsAppLink({
  children,
}: {
  children: (openModal: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children(() => setOpen(true))}</Dialog.Trigger>
      <LeadQualificationModal open={open} setOpen={setOpen} message="default" />
    </Dialog.Root>
  );
}

export function FinalContact() {
  const { ctaTitle, ctaSubtitle, whatsappKey } = useBrandingContext();

  return (
    <section className="surface-porcelain section-pad relative overflow-hidden">
      <div className="container-editorial relative grid gap-12 md:grid-cols-12 md:items-center">
        <FadeIn className="md:col-span-5 md:pr-10">
          <Eyebrow n="09">Próximo passo</Eyebrow>
          <h2 className="mt-7 font-serif text-[34px] leading-[1.05] sm:text-[42px] md:text-[54px]">
            {ctaTitle}
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
            {ctaSubtitle}
          </p>
        </FadeIn>
        <div className="md:col-span-7">
          <div className="quiet-card overflow-hidden bg-[var(--ivory)] shadow-soft">
            <StaggerChildren className="divide-y divide-border">
              {(
                [
                  [WhatsAppIcon, "WhatsApp", camila.phone, camila.whatsapp],
                  [Mail, "E-mail", camila.email, `mailto:${camila.email}`],
                  [MapPin, "Consultório", camila.location, "/contato"],
                  [
                    InstagramIcon,
                    "Instagram",
                    camila.instagramHandle,
                    camila.instagram,
                  ],
                ] satisfies Array<[ContactIcon, string, string, string]>
              ).map(([Icon, label, value, href]) => {
                const isWhatsApp = label === "WhatsApp";
                const content = (
                  <div className="group grid gap-3 p-5 transition-colors hover:bg-[var(--bone)] sm:p-7 md:grid-cols-[24px_120px_minmax(0,1fr)] md:gap-4">
                    <Icon className="h-5 w-5 shrink-0 text-[var(--clay)]" />
                    <span className="min-w-0 text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
                      {label}
                    </span>
                    <span className="min-w-0 break-words font-serif text-[18px] leading-tight text-[var(--ink)] [overflow-wrap:anywhere] group-hover:text-[var(--forest)] sm:text-[22px]">
                      {value}
                    </span>
                  </div>
                );

                return isWhatsApp ? (
                  <QualifiedWhatsAppLink key={label}>
                    {(open) => (
                      <button onClick={open} className="w-full text-left">
                        {content}
                      </button>
                    )}
                  </QualifiedWhatsAppLink>
                ) : (
                  <StaggerItem key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (label === "E-mail") track("click_email_contact");
                        if (label === "Instagram") track("click_instagram");
                      }}
                      className="block transition-colors hover:bg-[var(--bone)]"
                    >
                      {content}
                    </a>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>

            <div className="border-t border-border bg-[var(--bone)]/40 p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <PrimaryCTA
                  message={whatsappKey}
                  className="w-full px-5 sm:w-auto"
                >
                  Agendar sessão
                </PrimaryCTA>
                <p className="text-center text-[12px] leading-relaxed text-muted-foreground sm:text-right">
                  Mensagens tratadas com sigilo e cuidado profissional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
