import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { PrimaryCTA } from "@/components/site/Primitives";
import { images } from "@/components/site/content";

export const Route = createFileRoute("/dependencia-tecnologica")({
  head: () => ({
    meta: [
      { title: "Terapia para Dependência Tecnológica e Telas | Camila Freitas" },
      {
        name: "description",
        content: "Tratamento para o uso excessivo de telas, redes sociais, jogos e internet. Recupere o equilíbrio e a presença na sua vida real com psicoterapia especializada.",
      },
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Dependência Tecnológica"
      title={<>Onde a conexão digital se torna uma prisão invisível.</>}
      intro="O excesso de telas, redes sociais e jogos pode fragmentar a atenção, aumentar a ansiedade e substituir a vida real por uma performance digital exaustiva."
      image={images.lifeOnline}
      pains={{
        title: "Quando o mundo virtual começa a empobrecer a sua experiência real.",
        items: [
          "Sinto uma ansiedade insuportável se fico longe do celular ou sem internet.",
          "Perco horas navegando sem propósito e sinto que meu tempo está escorrendo pelos dedos.",
          "Minha produtividade no trabalho e meus estudos estão seriamente prejudicados pelas telas.",
          "Prefiro interações virtuais a encontros presenciais, que agora me parecem cansativos.",
          "Sinto um vazio e uma tristeza profunda ao me comparar com a vida de outros nas redes.",
          "Tenho problemas de sono por não conseguir me desligar dos dispositivos à noite."
        ]
      }}
      lead="A tecnologia deve ser uma ferramenta, não um modo de evitar a vida. Na terapia, buscamos retomar a presença e o controle sobre o seu tempo."
      points={[
        "Identificar os gatilhos emocionais que levam ao uso compulsivo de dispositivos.",
        "Trabalhar a ansiedade gerada pela comparação social e pelo fluxo infinito de informação.",
        "Desenvolver estratégias de 'higiene digital' e limites saudáveis para o uso de telas.",
        "Resgatar atividades e prazeres no mundo offline que foram abandonados.",
        "Compreender a função da tecnologia como refúgio de sentimentos difíceis."
      ]}
      faqItems={[
        {
          q: "O objetivo é parar de usar a tecnologia?",
          a: "Não. Diferente de outras dependências, o objetivo não é a abstinência total, mas sim a construção de uma relação funcional, consciente e equilibrada com as ferramentas digitais."
        },
        {
          q: "Como saber se meu uso é patológico?",
          a: "O sinal de alerta é quando o uso interfere significativamente em áreas vitais: sono, saúde física, relações sociais, trabalho e capacidade de estar sozinho com seus próprios pensamentos."
        }
      ]}
      cta={
        <div className="mt-12">
          <PrimaryCTA message="dependencia-tecnologica">Agendar uma conversa inicial</PrimaryCTA>
        </div>
      }
    />
  ),
});
