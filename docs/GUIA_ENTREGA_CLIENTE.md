# Guia Prático de Entrega ao Cliente — NeuroScreen TDAH

Este manual orienta como empacotar, publicar, personalizar e entregar o **NeuroScreen TDAH** para clínicas, profissionais de saúde mental, escolas ou clientes corporativos.

---

## 🚀 1. Formatos de Entrega Disponíveis

Você pode entregar a solução ao cliente em **4 modalidades diferentes**, dependendo das necessidades e da infraestrutura dele:

```
                  ┌────────────────────────────────────────┐
                  │          NEUROSCREEN TDAH              │
                  └──────────────────┬─────────────────────┘
         ┌───────────────────┬───────┴───────────┬──────────────────┐
         ▼                   ▼                   ▼                  ▼
  [Link Web / Nuvem]   [Instalação PWA]    [Arquivo ZIP]      [APK / Mobile]
  Vercel / Netlify     Ícone no Celular    cPanel / Próprio   Google Play Store
  Domínio da Clínica   Funciona Offline    Servidor Local     App Store
```

---

## 🌐 Opção A: Publicação em Nuvem com Link Próprio (Mais Recomendada)

A aplicação é **estática e moderna** (HTML5 + ES Modules + CSS), o que significa que ela não precisa de servidores caros ou banco de dados inicial para rodar. Você pode publicá-la gratuitamente com velocidade ultra-rápida e certificado SSL (HTTPS) automático.

### Passo a Passo no Vercel (2 minutos):
1. Crie uma conta gratuita em [vercel.com](https://vercel.com).
2. Instale a ferramenta de linha de comando ou suba a pasta:
   ```bash
   npx vercel
   ```
3. O Vercel gerará um link público imediato (ex.: `https://neuroscreen-tdah.vercel.app`).
4. **Adicionar Domínio do Cliente**:
   - Vá no painel do Vercel ➔ **Settings** ➔ **Domains**.
   - Digite o domínio ou subdomínio do seu cliente (ex.: `triagem.clinicaexemplo.com.br`).
   - O cliente só precisará criar uma entrada DNS do tipo `CNAME` apontando para `cname.vercel-dns.com`.

*(O mesmo procedimento pode ser feito no **Netlify** ou **Cloudflare Pages**).*

---

## 📱 Opção B: Entrega como Aplicativo no Celular/Tablet (PWA)

O NeuroScreen já vem configurado com **Service Worker** (`sw.js`) e **Manifesto** (`manifest.json`). Isso permite que ele seja instalado diretamente no smartphone ou tablet do cliente ou de seus pacientes sem burocracia de loja de aplicativos:

### No Android (Google Chrome):
1. Acesse o link web no Chrome.
2. O navegador exibirá uma barra inferior: **"Adicionar NeuroScreen à tela inicial"** ou clique nos três pontinhos no canto superior e selecione **"Instalar aplicativo"**.
3. Um ícone nativo é criado na tela inicial do aparelho.
4. **Funciona 100% Offline**: o paciente pode realizar o teste mesmo sem internet ou no Modo Avião.

### No iPhone / iPad (Safari):
1. Abra o link no Safari.
2. Toque no botão **Compartilhar** (ícone do quadrado com a seta para cima).
3. Role para baixo e selecione **"Adicionar à Tela de Início"**.
4. Toque em **Adicionar**. O jogo abrirá em tela cheia, como um aplicativo nativo.

---

## 📦 Opção C: Entrega em Pacote ZIP "Chave na Mão"

Se o cliente já tiver um servidor próprio (cPanel, Hostinger, Locaweb, Apache ou Nginx):

1. Selecione todos os arquivos da pasta `tdah-screening-game`:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - Pastas `css/`, `js/` e `docs/`
2. Compacte em um arquivo `neuroscreen_v1.0.zip`.
3. Entregue o arquivo ao cliente (via e-mail, Google Drive ou WeTransfer).
4. **Instrução para a equipe de TI do cliente**:
   > *"Basta extrair o conteúdo do arquivo ZIP na pasta raiz pública (`public_html` ou `www`) do servidor web sob HTTPS."*

---

## 🎨 2. Como Personalizar com a Marca do Cliente (White-Label)

Para colocar a identidade visual e o logotipo do seu cliente antes da entrega:

1. **Nome e Marca**:
   - No arquivo [index.html](file:///C:/Users/spfil/.gemini/antigravity/scratch/tdah-screening-game/index.html):
     - Linha 21: Altere `<div class="brand-badge">...</div>` para incluir o nome da clínica ou consultório do cliente.
     - Linha 8: Altere a tag `<title>` para o nome comercial desejado.
2. **Tema Padrão**:
   - Para definir o tema padrão que abre automaticamente:
     - No [index.html](file:///C:/Users/spfil/.gemini/antigravity/scratch/tdah-screening-game/index.html), altere `<html lang="pt-BR" data-theme="clinical">` para abrir direto no tema clínico claro, se o cliente for um consultório médico.
3. **Cores Principais**:
   - No arquivo [css/style.css](file:///C:/Users/spfil/.gemini/antigravity/scratch/tdah-screening-game/css/style.css), ajuste as variáveis `--accent-info` ou `--bg-surface` para as cores da paleta da marca do cliente.

---

## 📋 3. Modelo de Termo de Entrega Técnica (Para Contrato / Nota Fiscal)

Ao entregar o projeto ao cliente, você pode emitir este termo formal:

```markdown
TERMO DE ENTREGA E HOMOLOGAÇÃO DE SOFTWARE

Cliente: [Nome do Cliente / Razão Social]
Projeto: Sistema Interativo de Triagem Neurocognitiva (6 Fases)
Versão: 1.0 (PWA Web & Mobile)
Data de Entrega: [Data Atual]

1. Objeto Entregue:
- Aplicação PWA com 6 tarefas cognitivas:
  (1) Go/No-Go, (2) CPT Contínuo, (3) Atenção Seletiva Flanker,
  (4) Memória de Trabalho Espacial, (5) Flexibilidade Cognitiva,
  (6) Percepção e Reprodução Temporal.
- Painel pós-sessão com gráfico de radar em Canvas de 6 eixos.
- Exportação de dados brutos e sumarizados em formatos JSON e CSV.
- Suporte offline-first e responsividade total em dispositivos móveis e desktops.
- 3 temas visuais selecionáveis (Cósmico, Infantil Lúdico e Clínico).

2. Finalidade:
O sistema destina-se a fins de autoavaliação inicial, triagem neurocognitiva e pesquisa,
possuindo caráter informativo e não dispensando avaliação médica ou neuropsicológica clínica.

Declaramos que a solução foi homologada, testada e entregue em pleno funcionamento.

_____________________________               _____________________________
    [Seu Nome / Desenvolvedor]                  [Representante do Cliente]
```
