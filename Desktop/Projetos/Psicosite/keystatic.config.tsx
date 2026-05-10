import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    global: singleton({
      label: 'Configurações Globais',
      path: 'src/content/global',
      format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Nome da Profissional', defaultValue: 'Camila Freitas' }),
        brandedName: fields.text({ label: 'Nome da Marca', defaultValue: 'Psicóloga Camila Freitas' }),
        crp: fields.text({ label: 'CRP', defaultValue: 'CRP 06/201444' }),
        education: fields.text({ label: 'Formação', defaultValue: 'PUC-SP' }),
        approach: fields.text({ label: 'Abordagem', defaultValue: 'Psicologia Analítica (Junguiana)' }),
        phone: fields.text({ label: 'Telefone (Exibição)', defaultValue: '(11) 94393-7007' }),
        whatsapp: fields.text({ label: 'Link do WhatsApp', defaultValue: 'https://wa.me/5511943937007?text=Ol%C3%A1%2C%20Camila.%20Gostaria%20de%20agendar%20uma%20primeira%20conversa.' }),
        email: fields.text({ label: 'E-mail', defaultValue: 'psi.camilafreitas@gmail.com' }),
        instagram: fields.text({ label: 'Link do Instagram', defaultValue: 'https://instagram.com/psi.cavfreitas' }),
        instagramHandle: fields.text({ label: 'Arroba do Instagram', defaultValue: '@psi.cavfreitas' }),
        location: fields.text({ label: 'Localização', defaultValue: 'Vila Nova Conceição, São Paulo - SP' }),
      }
    }),
    homepage: singleton({
      label: 'Homepage (Textos e CTAs)',
      path: 'src/content/homepage',
      format: { data: 'json' },
      schema: {
        heroHeadline: fields.text({ label: 'Headline Principal', multiline: true, defaultValue: 'Um espaço seguro para escutar o que a rotina não tem tempo de acolher.' }),
        heroSubheadline: fields.text({ label: 'Subtítulo', multiline: true, defaultValue: 'A psicoterapia é um convite para olhar com mais profundidade para as suas angústias e construir novas formas de se relacionar consigo mesmo e com o mundo.' }),
      }
    }),
    instagramCurated: singleton({
      label: 'Instagram (Curadoria Estratégica)',
      path: 'src/content/instagramCurated',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Título da Seção', defaultValue: 'Reflexões sobre a clínica e o cotidiano.' }),
        description: fields.text({ label: 'Descrição da Seção', multiline: true }),
        posts: fields.array(
          fields.object({
            title: fields.text({ label: 'Título Principal do Post' }),
            tag: fields.text({ label: 'Tema / Tag (ex: Ansiedade, Luto)' }),
            caption: fields.text({ label: 'Mini Legenda / Contexto', multiline: true }),
            label: fields.text({ label: 'Rótulo Editorial (ex: Destaque, Mais Lido)' }),
            image: fields.image({
              label: 'Imagem do Post',
              directory: 'public/images/instagram',
              publicPath: '/images/instagram',
            }),
            url: fields.url({ label: 'Link para o Instagram' }),
          }),
          {
            label: 'Posts em Destaque',
            itemLabel: (props) => props.fields.title.value || 'Novo Post',
          }
        )
      }
    })
  },
  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*/',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Título do Artigo' }),
        date: fields.date({ label: 'Data da Publicação', validation: { isRequired: true } }),
        category: fields.text({ label: 'Categoria' }),
        excerpt: fields.text({ label: 'Resumo / Linha Fina', multiline: true }),
        coverImage: fields.image({
          label: 'Imagem de Capa',
          directory: 'public/images/blog',
          publicPath: '/images/blog',
        }),
        content: fields.document({
          label: 'Conteúdo do Artigo',
          formatting: true,
          links: true,
          dividers: true,
          images: {
            directory: 'public/images/blog',
            publicPath: '/images/blog',
          },
        }),
        seoTitle: fields.text({ label: 'SEO Title (Opcional)' }),
        seoDescription: fields.text({ label: 'SEO Description (Opcional)', multiline: true }),
      }
    }),
    services: collection({
      label: 'Áreas de Atendimento',
      slugField: 'label',
      path: 'src/content/services/*',
      format: { data: 'json' },
      schema: {
        label: fields.text({ label: 'Área' }),
        title: fields.text({ label: 'Título da Área' }),
        description: fields.text({ label: 'Descrição Breve', multiline: true }),
        image: fields.image({
          label: 'Imagem Representativa',
          directory: 'public/images/services',
          publicPath: '/images/services',
        }),
        to: fields.text({ label: 'Link/Rota da Página', defaultValue: '/' }),
      }
    }),
    faq: collection({
      label: 'Perguntas Frequentes (FAQ)',
      slugField: 'q',
      path: 'src/content/faq/*',
      format: { data: 'json' },
      schema: {
        q: fields.text({ label: 'Pergunta' }),
        a: fields.text({ label: 'Resposta', multiline: true }),
      }
    })
  }
});
