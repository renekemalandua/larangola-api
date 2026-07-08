# Configuração do Sistema de Emails (Resend)

Este documento guarda os passos necessários para configurar as chaves do Resend quando adquirires o domínio da LarAngola.

## Como testar AGORA (Sem Domínio)
O Resend permite testar o envio de emails sem ter um domínio próprio (Sandbox Mode), mas com **duas limitações**:
1. Só podes enviar emails **DE** `onboarding@resend.dev`.
2. Só podes enviar emails **PARA** o próprio endereço de email com o qual criaste a conta no Resend.

**Para testar em desenvolvimento:**
1. Cria a conta no [resend.com](https://resend.com) e gera a tua API Key.
2. Coloca a API Key no ficheiro `.env` da API: `RESEND_API_KEY="re_123456789"`.
3. Altera a variável `MAIL_FROM` no `.env` para `MAIL_FROM="onboarding@resend.dev"`.
4. Garante que, na tua base de dados local ou testes, estás a usar o **teu próprio email** (o que usaste para criar conta no Resend) como destino.

---

## Como configurar para PRODUÇÃO (Com Domínio)

Quando tiveres o domínio `larangola.ao` comprado e alojado:

### 1. Criar a conta e obter a API Key:
- Vai a [resend.com](https://resend.com) e faz o login.
- No menu esquerdo, clica em **API Keys**.
- Clica no botão negro **"Create API Key"**.
- Dá um nome à chave (ex: `Larangola Prod`), dá-lhe permissões de **Full Access** e clica em "Add".
- **Copia a chave** e cola-a no teu ficheiro `.env` em `RESEND_API_KEY="a_tua_chave_aqui"`.

### 2. Configurar o Domínio (Fundamental):
- No menu esquerdo do Resend, clica em **Domains**.
- Clica em **"Add Domain"**. Escreve o teu domínio (ex: `larangola.ao`) e a região.
- O Resend vai gerar uns **registos DNS (TXT e MX)**.
- Entra no painel onde compraste/geres o teu domínio (ex: Cloudflare, Namecheap) e adiciona exatamente esses registos na aba de gestão de DNS.
- Volta ao painel do Resend e clica em **"Verify DNS"**. O status mudará para "Verified" em poucos minutos (ou algumas horas dependendo do propagador).

### 3. Atualizar o Remetente no .env:
- Agora que o domínio é teu e está verificado, podes enviar emails reais.
- Altera a variável `MAIL_FROM` no teu `.env` para algo oficial, ex: `MAIL_FROM="info@larangola.ao"`.

A partir deste momento, a API da LarAngola conseguirá disparar emails para qualquer utilizador do mundo!
