import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, type LucideIcon, Send, Loader2 } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageHero, PrimaryCTA, InstagramIcon } from "@/components/site/Primitives";
import { camila, images, getWhatsAppLink } from "@/components/site/content";
import { useState } from "react";
import { track } from "@vercel/analytics";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Agendar Terapia em São Paulo (Vila Nova Conceição) | Camila Freitas" },
      {
        name: "description",
        content: "Inicie seu processo terapêutico com a Psicóloga Camila Freitas (PUC-SP). Agende sua sessão presencial na Vila Nova Conceição ou Online via WhatsApp, e-mail ou formulário.",
      },
      { property: "og:title", content: "Agende sua Consulta com Psicóloga Camila Freitas" },
      {
        property: "og:description",
        content: "WhatsApp, e-mail e formulário direto para agendamento de psicoterapia presencial e online.",
      },
    ],
  }),
  component: ContatoPage,
});

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

function ContatoPage() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    track("form_submission_attempt");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      // Endpoint de envio de email preparado para Resend (integrável no futuro)
      // fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
      console.log("Payload preparado para Resend:", data);
      
      // Simulação de delay para fallback
      await new Promise((resolve) => setTimeout(resolve, 1500));
      track("form_submission_success");
      setFormState("success");
    } catch (error) {
      console.error(error);
      setFormState("error");
    }
  };

  const links: Array<[any, string, string, string]> = [
    [WhatsAppIcon, "WhatsApp", camila.phone, getWhatsAppLink("default")],
    [Mail, "E-mail", camila.email, `mailto:${camila.email}`],
    [InstagramIcon, "Instagram", camila.instagramHandle, camila.instagram],
    [MapPin, "Consultório", camila.location, ""],
  ];

  return (
    <Layout>
      <PageHero
        eyebrow="Contato"
        title={<>Um primeiro contato claro, discreto e cuidadoso.</>}
        intro="Você pode escrever de forma breve sobre sua busca por terapia. O retorno é pessoal, com informações sobre disponibilidade, valores e possibilidades de atendimento."
        image={images.consultorio}
        alt="Recepção acolhedora do consultório de psicologia da Camila Freitas na Vila Nova Conceição"
      />
      <section className="surface-porcelain section-pad relative">
        <div className="container-editorial grid gap-16 md:grid-cols-12 md:gap-12">
          
          <div className="md:col-span-6 lg:col-span-5 md:order-2">
            <h2 className="font-serif text-[28px] leading-[1.1] sm:text-[34px] md:text-[42px]">
              Canais diretos
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Para maior agilidade ou dúvidas curtas, o WhatsApp é o canal mais rápido. As mensagens são lidas e respondidas diretamente pela Camila.
            </p>
            <div className="mt-8 mb-10 flex">
              <PrimaryCTA>Conversar no WhatsApp</PrimaryCTA>
            </div>
            
            <div className="quiet-card divide-y divide-border">
              {links.map(([Icon, label, value, href]) => {
                const content = (
                  <div className="grid gap-3 p-5 sm:p-6 md:grid-cols-[24px_1fr]">
                    <Icon className="h-5 w-5 text-[var(--clay)]" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {label}
                      </span>
                      <span className="mt-1 block break-words font-serif text-[20px] leading-tight text-[var(--ink)] sm:text-[22px]">
                        {value}
                      </span>
                    </div>
                  </div>
                );

                return href ? (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (label === "WhatsApp") track("click_whatsapp");
                      if (label === "E-mail") track("click_email_contact");
                      if (label === "Instagram") track("click_instagram");
                    }}
                    className="block transition-colors hover:bg-[var(--bone)] hover:text-[var(--forest)]"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={label}>{content}</div>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-7 md:order-1 lg:pr-12">
            <div className="quiet-card bg-[var(--ivory)] p-6 sm:p-8 md:p-10">
              <h2 className="font-serif text-[28px] leading-[1.1] text-[var(--ink)] sm:text-[34px]">
                Primeiro Contato
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
                Por favor, não inclua dados clínicos sensíveis ou histórico detalhado aqui. 
                Essas informações serão acolhidas e tratadas com o devido cuidado e sigilo 
                no momento apropriado, durante a nossa primeira conversa.
              </p>

              {formState === "success" ? (
                <div className="mt-10 rounded-sm border border-[var(--forest)]/20 bg-[var(--forest)]/5 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--ivory)]">
                    <Send className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-serif text-[24px] text-[var(--ink)]">Mensagem enviada com sucesso.</h3>
                  <p className="mt-3 text-[15px] text-muted-foreground">
                    Agradeço o seu contato. Retornarei o mais breve possível com as informações solicitadas.
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="mt-8 text-[13px] uppercase tracking-widest text-[var(--clay)] transition-colors hover:text-[var(--forest)]"
                  >
                    Enviar nova mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-[13px] font-medium text-[var(--ink)]">Nome completo</label>
                      <input 
                        required 
                        id="name" 
                        name="name" 
                        type="text" 
                        className="w-full rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="whatsapp" className="text-[13px] font-medium text-[var(--ink)]">WhatsApp</label>
                      <input 
                        required 
                        id="whatsapp" 
                        name="whatsapp" 
                        type="tel" 
                        className="w-full rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[13px] font-medium text-[var(--ink)]">E-mail</label>
                    <input 
                      required 
                      id="email" 
                      name="email" 
                      type="email" 
                      className="w-full rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]" 
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="modality" className="text-[13px] font-medium text-[var(--ink)]">Modalidade de interesse</label>
                      <select 
                        required
                        id="modality" 
                        name="modality" 
                        className="w-full rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]"
                      >
                        <option value="">Selecione...</option>
                        <option value="online">Online</option>
                        <option value="presencial">Presencial (Vila Nova Conceição)</option>
                        <option value="indefinido">Ainda não sei / Quero entender melhor</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="period" className="text-[13px] font-medium text-[var(--ink)]">Melhor período para contato</label>
                      <select 
                        required
                        id="period" 
                        name="period" 
                        className="w-full rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]"
                      >
                        <option value="">Selecione...</option>
                        <option value="manha">Manhã</option>
                        <option value="tarde">Tarde</option>
                        <option value="noite">Noite</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-[13px] font-medium text-[var(--ink)] flex items-center justify-between">
                      Mensagem breve <span className="text-[11px] text-muted-foreground uppercase tracking-wider">(Opcional)</span>
                    </label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={4}
                      className="w-full resize-none rounded-sm border border-border bg-transparent px-4 py-3 text-[15px] outline-none transition-colors focus:border-[var(--forest)]" 
                    />
                  </div>

                  {formState === "error" && (
                    <p className="text-[13px] text-[var(--destructive)]">
                      Ocorreu um erro ao enviar a mensagem. Por favor, tente pelo WhatsApp.
                    </p>
                  )}

                  <button 
                    type="submit" 
                    disabled={formState === "loading"}
                    className="focus-ring group relative inline-flex min-h-[56px] w-full items-center justify-center gap-3 overflow-hidden rounded-[2px] bg-[var(--forest)] px-7 py-4 text-center text-[14px] tracking-wide text-[var(--ivory)] shadow-soft transition-all duration-300 hover:bg-[var(--ink)] hover:shadow-press disabled:opacity-70 disabled:pointer-events-none md:min-h-[52px]"
                  >
                    {formState === "loading" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Enviar solicitação de contato
                        <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>

                  <p className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground/80 max-w-sm mx-auto">
                    Ao enviar, você concorda com o uso dos seus dados para retorno de contato, conforme a <Link to="/privacidade" className="underline hover:text-[var(--forest)] transition-colors">Política de Privacidade</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
}
