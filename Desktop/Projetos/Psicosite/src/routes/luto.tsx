import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { PrimaryCTA } from "@/components/site/Primitives";
import { images } from "@/components/site/content";

export const Route = createFileRoute("/luto")({
  head: () => ({
    meta: [
      { title: "Terapia para o Luto e Perdas | Camila Freitas" },
      {
        name: "description",
        content: "Apoio clínico para atravessar o processo de luto e perdas significativas. Um espaço seguro para honrar sua dor e reconstruir o sentido da vida no seu tempo.",
      },
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Luto"
      title={<>O tempo da dor pede uma escuta que não apressa.</>}
      intro="Lidar com a perda não é sobre 'superar' ou esquecer, mas sobre encontrar um lugar para a ausência e permitir que a vida ganhe novos contornos."
      image={images.lifeTime}
      pains={{
        title: "Quando a falta parece ocupar todo o espaço e o mundo perde a cor.",
        items: [
          "Sinto um vazio insuportável e parece que a alegria nunca mais vai voltar.",
          "As pessoas esperam que eu esteja bem, mas sinto que estou apenas fingindo.",
          "Tenho dificuldade em realizar tarefas simples do dia a dia desde a perda.",
          "Sinto culpa por coisas que disse ou deixei de dizer a quem se foi.",
          "Sinto que ninguém entende a profundidade da minha dor ou o tempo do meu luto.",
          "Tenho medo de esquecer a pessoa ou de 'seguir em frente' e isso parecer traição."
        ]
      }}
      lead="O luto é um processo singular, sem fases lineares. Na terapia, honramos a dor e construímos, pouco a pouco, um novo modo de caminhar."
      points={[
        "Oferecer um espaço seguro para expressar sentimentos que muitas vezes são silenciados.",
        "Trabalhar a culpa, a raiva e a tristeza profunda associadas à perda.",
        "Auxiliar na reconstrução da identidade e do sentido da vida após a ausência.",
        "Compreender o luto não apenas por morte, mas por separações, demissões e mudanças.",
        "Respeitar o tempo e o ritmo de cada pessoa, sem pressões sociais por 'melhora'."
      ]}
      faqItems={[
        {
          q: "Quanto tempo dura o luto?",
          a: "Não existe um tempo certo ou 'normal'. Cada pessoa tem seu próprio ritmo. A terapia ajuda a garantir que esse processo não se torne paralisante, permitindo que a dor se transforme em saudade."
        },
        {
          q: "Só se faz terapia de luto por morte?",
          a: "Não. O luto é a resposta a qualquer perda significativa: o fim de um relacionamento, a perda de um emprego, uma mudança de país ou a perda de uma fase da vida."
        }
      ]}
      cta={
        <div className="mt-12">
          <PrimaryCTA message="luto">Agendar uma conversa inicial</PrimaryCTA>
        </div>
      }
    />
  ),
});
