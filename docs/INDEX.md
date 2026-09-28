# 📚 Índice Geral da Documentação — NeuroScreen TDAH

Bem-vindo ao centro de documentação técnica, clínica e operacional do **NeuroScreen TDAH**. Abaixo você encontra o mapa completo de todos os manuais, referências científicas e guias de entrega comercial.

---

## 🗺️ Mapa de Documentos

```
docs/
├── INDEX.md                 <-- [Você está aqui] Índice Mestre e Mapa de Leitura
├── ARQUITETURA.md           <-- Especificação Técnica, Diagramas, Módulos e APIs
├── MANUAL_DO_USUARIO.md     <-- Guia Prático para Clínicos, Pais, Educadores e Usuários
├── METRICS.md               <-- Fundamentos Psicométricos, Fórmulas Matemáticas e Referências
├── GUIA_ENTREGA_CLIENTE.md  <-- Manual Comercial de Publicação, Deploy, PWA e White-Label
└── EDITAL_VAGA.md           <-- Termo de Referência / Modelo de Contratação Técnica (1 Página)
```

---

## 📖 Resumo dos Documentos e Guias de Leitura

### 1. [Manual do Usuário](MANUAL_DO_USUARIO.md)
*Público: Clínicos, psicólogos, educadores, pais e pacientes.*
- Como iniciar uma sessão e configurar a **faixa etária** (Criança, Adolescente ou Adulto).
- Escolha entre **Modo Rápido (~3 a 4 min)** e **Sessão Completa (~8 a 10 min)**.
- Seleção e personalização de **Temas Visuais** (exclusividade infantil vs adulto).
- Instruções detalhadas para as **6 fases cognitivas**.
- Como interpretar o **Gráfico de Radar de 6 eixos** e os indicadores clínicos.
- Exportação de dados para prontuários em **CSV**, **JSON** e **PDF**.
- Boas práticas ambientais e controle de ruído durante a testagem.

### 2. [Arquitetura de Software e Engenharia](ARQUITETURA.md)
*Público: Desenvolvedores, arquitetos de software e pesquisadores computacionais.*
- Visão geral da arquitetura modular sem dependências externas pesadas (Pure ES6).
- Motor de **Cronometria de Ultra-Alta Precisão** (`performance.now()`, `event.timeStamp` de hardware e ISI com *jitter*).
- Máquina de estados finita da aplicação (`AppCoordinator`).
- Sintetizador procedural com **Web Audio API** (áudio offline sem assets externos).
- Ciclo de vida do **Service Worker (Network-First v5)** e manifesto PWA.
- Estrutura de dados da sessão e modelos de persistência local.

### 3. [Métricas Psicométricas e Fórmulas](METRICS.md)
*Público: Neuropsicólogos, estatísticos, pesquisadores e médicos.*
- Fórmulas matemáticas rigorosas para todas as 6 tarefas.
- Tempo de Reação Médio ($\overline{RT}$), Variabilidade ($SD_{RT}$ / RTV) e Coeficiente de Variação ($CV$).
- Teoria de Detecção de Sinal (SDT): Sensibilidade $d'$ e Critério $c$ com correção de Hautus.
- Declínio de Vigilância no tempo ($Q_1$ vs $Q_4$ no CPT).
- Custo de Interferência (*Flanker*) e Custo de Alternância (*Switch Cost*).
- Memória de Trabalho Espacial (*Span*) e Viés de Estimação Temporal.
- Referências bibliográficas completas (Barkley, Conners, Castellanos, Eriksen, Monsell, Rubia).

### 4. [Guia de Entrega ao Cliente e White-Label](GUIA_ENTREGA_CLIENTE.md)
*Público: Empreendedores, consultores de software e gestores de projetos.*
- As 4 formas de entrega: Nuvem com 1 clique (Vercel/Netlify), Instalação PWA no celular, Pacote ZIP chave na mão e Aplicativo nativo.
- Como apontar para o **domínio próprio da clínica** (ex.: `triagem.clinicax.com.br`).
- Instruções passo a passo para **White-Label** (como trocar logotipos, nomes e cores).
- Modelo formal de **Termo de Homologação e Entrega Técnica** para assinatura e nota fiscal.

### 5. [Modelo de Edital / Descrição de Vaga Técnica](EDITAL_VAGA.md)
*Público: Departamentos de compras, editais de fomento e recrutadores.*
- Termo de referência sintético de 1 página.
- Requisitos técnicos essenciais e diferenciais para contratação de equipes de desenvolvimento.
- Cronograma sugerido de 5 semanas e critérios ponderados de avaliação de propostas.

---

## 🛠️ Navegação Rápida do Código-Fonte

- **Ponto de Entrada da Interface**: [`index.html`](../index.html)
- **Design Tokens e Temas**: [`css/style.css`](../css/style.css)
- **Orquestrador da Aplicação**: [`js/app.js`](../js/app.js)
- **Motor Estatístico**: [`js/metrics.js`](../js/metrics.js)
- **Gerenciador de Temas Lúdicos**: [`js/themes.js`](../js/themes.js)
- **Tarefas Cognitivas**: [`js/games/`](../js/games/)
- **Bateria de Testes Automatizados**: [`tests/test_metrics.js`](../tests/test_metrics.js)
