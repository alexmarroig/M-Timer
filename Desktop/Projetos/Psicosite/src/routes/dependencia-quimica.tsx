import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { PrimaryCTA } from "@/components/site/Primitives";
import { images } from "@/components/site/content";

export const Route = createFileRoute("/dependencia-quimica")({
  head: () => ({
    meta: [
      { title: "Terapia para Dependência Química em São Paulo e Online | Camila Freitas" },
      {
        name: "description",
        content: "Apoio clínico especializado para o tratamento da dependência química. Um espaço de escuta sem julgamentos para compreender o uso de substâncias e buscar novos caminhos.",
      },
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Dependência Química"
      title={<>Onde o uso de substâncias encontra uma escuta ética.</>}
      intro="A dependência não é um desvio de caráter, mas um fenômeno complexo que exige um olhar clínico atento ao que a substância veio tentar resolver ou silenciar."
      image={images.lifeBurnout}
      pains={{
        title: "Quando o uso deixa de ser uma escolha e passa a ditar o ritmo da vida.",
        items: [
          "Sinto que perdi o controle sobre o quanto e quando consumo.",
          "O uso de substâncias está prejudicando meu trabalho, minhas relações e minha saúde.",
          "Sinto uma culpa profunda após o uso, mas não consigo parar sozinho(a).",
          "Mentir ou esconder o consumo tornou-se um hábito para evitar conflitos.",
          "Sinto que só consigo relaxar ou lidar com os problemas se estiver sob efeito.",
          "As pessoas próximas estão preocupadas, mas sinto que elas não entendem o que sinto."
        ]
      }}
      lead="Na clínica, olhamos para além da substância. Investigamos o sofrimento que a sustenta e as possibilidades de construir uma vida com mais sentido."
      points={[
        "Compreender a função do uso na economia psíquica do sujeito.",
        "Trabalhar a ambivalência entre o desejo de parar e o medo de ficar sem a substância.",
        "Fortalecer a autonomia e a capacidade de lidar com frustrações sem o recurso do uso.",
        "Analisar o impacto do uso nos vínculos familiares e sociais.",
        "Construir estratégias de cuidado e prevenção de recaídas baseadas na singularidade."
      ]}
      faqItems={[
        {
          q: "Você realiza internação?",
          a: "Não. O meu trabalho é estritamente ambulatorial (consultório). Caso seja avaliado que a pessoa precisa de um nível de cuidado maior, como internação ou hospital-dia, realizo o encaminhamento para instituições parceiras e psiquiatras especializados."
        },
        {
          q: "A família pode participar?",
          a: "O foco do atendimento é individual. No entanto, em momentos pontuais e com a concordância do paciente, podem ser realizados encontros de orientação familiar para auxiliar no processo de cuidado."
        }
      ]}
      cta={
        <div className="mt-12">
          <PrimaryCTA message="dependencia-quimica">Agendar uma conversa inicial</PrimaryCTA>
        </div>
      }
    />
  ),
});
