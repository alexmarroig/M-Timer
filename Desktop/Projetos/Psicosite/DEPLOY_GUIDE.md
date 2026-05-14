# Guia de Deploy: Vercel

Este guia explica como publicar o site da Psicóloga Camila Freitas na Vercel com segurança.

## 🚀 Passo a Passo (Manual)

### 1. Preparação (Local)
Certifique-se de que todas as alterações do Keystatic (JSONs e imagens) foram salvas e commitadas no seu repositório Git.
```bash
git add .
git commit -m "feat: preparação final para deploy"
git push origin main
```

### 2. Configuração na Vercel
1.  Acesse o dashboard da [Vercel](https://vercel.com).
2.  Clique em **"Add New"** > **"Project"**.
3.  Importe o repositório `Psicosite`.
4.  **Configurações de Build**:
    -   **Framework Preset**: A Vercel deve detectar "Other" ou "Vite".
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `.output/public` (para os assets estáticos) ou deixe o padrão se o Nitro for detectado.
    -   **Root Directory**: `./`

### 3. Variáveis de Ambiente
Até o momento, o site não exige variáveis de ambiente críticas para funcionar (o Analytics é injetado automaticamente). Caso futuramente você configure o envio de e-mails via Resend, deverá adicionar:
- `RESEND_API_KEY`: sua chave do Resend.

### 4. Domínio Customizado
1.  Após o deploy inicial, vá em **Settings > Domains**.
2.  Adicione `psicavfreitas.com.br`.
3.  Siga as instruções de DNS (configuração de registros A e CNAME) no seu provedor de domínio (ex: Registro.br ou GoDaddy).

---

## 🔒 Cuidado com o Keystatic no Deploy
Como estamos usando o **Keystatic no modo Local**:
-   A interface administrativa (`/keystatic` ou `npm run cms`) é para ser usada **localmente** no seu computador.
-   Toda vez que você editar um texto ou postar no blog pelo admin local, você precisa fazer o **commit e push** para o GitHub.
-   A Vercel detectará o novo commit e fará o deploy automático com o conteúdo atualizado.

---

## ✅ Checklist de Pós-Deploy

Após o site estar no ar, realize estes testes manuais:

- [ ] **Home**: Verifique se o Hero e as seções carregam com as animações.
- [ ] **Blog**: Acesse `/blog` e abra um dos 5 artigos para validar a leitura.
- [ ] **WhatsApp**: Clique em qualquer botão "Agendar" e veja se abre o chat corretamente.
- [ ] **Instagram**: Clique nos cards da seção social e verifique o redirecionamento.
- [ ] **Formulário**: Envie uma mensagem de teste e verifique o estado de "Sucesso".
- [ ] **Privacidade**: Verifique se a página `/privacidade` está legível.
- [ ] **Mobile**: Abra o site no celular e teste o menu e a navegabilidade.
- [ ] **Social Preview**: Cole o link do site no WhatsApp/Telegram e veja se a imagem de pré-visualização (OG) aparece com o nome da Camila.
- [ ] **Indexação**: Acesse o Google Search Console e envie o link do sitemap.

