import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "./Primitives";
import { camila, images } from "./content";

export function Footer() {
  return (
    <footer className="surface-forest relative overflow-hidden border-t border-[var(--ivory)]/10">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="container-editorial relative py-16 md:py-24">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <img
              src={images.logoHorizontal}
              alt="Logotipo Psicóloga Camila Freitas - Vila Nova Conceição, SP"
              className="h-auto w-full max-w-[360px] rounded-[2px] bg-[var(--ivory)]/96 p-4 shadow-soft"
              loading="lazy"
              width={360}
              height={120}
            />
            <p className="mt-6 max-w-sm text-[14.5px] leading-relaxed text-[var(--ivory)]/70">
              Psicóloga clínica formada pela PUC-SP. Atendimento online e
              presencial em São Paulo, com escuta cuidadosa e responsabilidade
              profissional.
            </p>
            <p className="mt-8 text-[11px] uppercase tracking-[0.24em] text-[var(--ivory)]/54">
              {camila.crp} · Vila Nova Conceição
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] uppercase tracking-[0.24em] text-[var(--brass)]">
              Menu
            </h4>
            <ul className="mt-6 space-y-3 text-[14px] text-[var(--ivory)]/78">
              <li><Link to="/sobre" className="link-underline">Sobre</Link></li>
              <li><Link to="/blog" className="link-underline">Blog</Link></li>
              <li><Link to="/contato" className="link-underline">Contato</Link></li>
              <li><Link to="/faq" className="link-underline">FAQ</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] uppercase tracking-[0.24em] text-[var(--brass)]">
              Serviços
            </h4>
            <ul className="mt-6 space-y-3 text-[14px] text-[var(--ivory)]/78">
              <li><Link to="/ansiedade" className="link-underline">Ansiedade</Link></li>
              <li><Link to="/relacionamentos" className="link-underline">Relacionamentos</Link></li>
              <li><Link to="/psicoterapia-online" className="link-underline">Terapia Online</Link></li>
              <li><Link to="/autoconhecimento" className="link-underline">Autoconhecimento</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-[11px] uppercase tracking-[0.24em] text-[var(--brass)]">
              Agendamento e Contato
            </h4>
            <div className="mt-6">
              <p className="text-[13.5px] leading-relaxed text-[var(--ivory)]/74">
                Atendimento presencial na Vila Nova Conceição e Psicoterapia Online para brasileiros em todo o mundo.
              </p>
              
              <div className="mt-8 flex flex-col gap-4 text-[13.5px] text-[var(--ivory)]/84">
                <a href={camila.whatsapp} className="flex items-center gap-3 link-underline">
                  <Phone className="h-4 w-4 text-[var(--brass)]" /> {camila.phone}
                </a>
                <a href={camila.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 link-underline">
                  <InstagramIcon className="h-4 w-4 text-[var(--brass)]" /> {camila.instagramHandle}
                </a>
              </div>

              <a 
                href={camila.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[var(--ivory)] px-8 text-[12px] font-semibold tracking-widest text-[var(--forest)] shadow-soft transition-all hover:scale-105 active:scale-95"
              >
                Agendar Sessão
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 h-px bg-[var(--ivory)]/14" />
        <div className="mt-8 flex flex-col gap-4 text-[12px] text-[var(--ivory)]/52 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {camila.brandedName}.
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <Link to="/privacidade" className="hover:text-[var(--ivory)] transition-colors">
              Política de Privacidade
            </Link>
            <p>
              Conteúdo informativo. Atendimento psicológico conforme ética profissional.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
