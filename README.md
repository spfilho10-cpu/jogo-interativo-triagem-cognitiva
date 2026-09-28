# 🧠 Jogo Interativo de Triagem Cognitiva (6 Fases)

> **Jogo sério e interativo de triagem neurocognitiva para TDAH e funções executivas (Web/PWA & Mobile)**, desenvolvido com base em literatura neuropsicológica contemporânea (Conners CPT, Go/No-Go, Eriksen Flanker, Blocos de Corsi, Task Switching e Estimação Temporal).

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](#)
[![PWA Ready](https://img.shields.io/badge/PWA-100%25_Offline--First-5A0FC8?logo=pwa&logoColor=white)](#)
[![Accessibility](https://img.shields.io/badge/WCAG_2.1-AA%2FAAA-10B981)](#)
[![License](https://img.shields.io/badge/License-MIT-blue)](#)
[![Tests](https://img.shields.io/badge/Tests-33%2F33_Passing-success)](#)

---

## 📑 Tabela de Conteúdos

- [Visão Geral](#-visão-geral)
- [As 6 Tarefas Neuropsicológicas](#-as-6-tarefas-neuropsicológicas)
- [Sistema de Temas e Gamificação por Idade](#-sistema-de-temas-e-gamificação-por-idade)
- [Navegação Acessível e Botão de Início](#-navegação-acessível-e-botão-de-início)
- [Como Executar Localmente](#-como-executar-localmente)
- [Bateria de Testes Automatizados](#-bateria-de-testes-automatizados)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Hub de Documentação Técnica](#-hub-de-documentação-técnica)
- [Entrega Comercial para Clientes](#-entrega-comercial-para-clientes)
- [Aviso Ético e Legal](#-aviso-ético-e-legal)

---

## 🎯 Visão Geral

O **NeuroScreen TDAH** é uma aplicação progressiva (PWA) de triagem e autoavaliação inicial de indicadores atencionais e executivos. Construída sem frameworks pesados, utiliza **JavaScript puro (ES6)** e APIs nativas do navegador para garantir cronometria milissegúndica com `performance.now()`, áudio sintetizado procedural via Web Audio API e funcionamento 100% offline.

---

## 🎮 As 6 Tarefas Neuropsicológicas

| # | Tarefa | Paradigma Clínico | Mecânica e Estímulos | Domínio Avaliado |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Go/No-Go** | Frenagem motora e inibição pré-potente | 75% Sinal Go (⚡/🦁) vs 25% Sinal No-Go (✋/🐝) | **Controle Inibitório & Impulsividade** |
| **2** | **CPT Contínuo** | Conners Continuous Performance | Alvos dinâmicos no tempo (⭐/🥚) contra distratores espaciais | **Atenção Sustentada & Declínio de Vigilância** |
| **3** | **Atenção Seletiva** | Paradigma Eriksen Flanker | Foco na seta central (◄/►) com distratores periféricos | **Filtragem Perceptual & Custo de Interferência** |
| **4** | **Memória Espacial** | Paradigma Blocos de Corsi | Grade 3x3 com sequências iluminadas adaptativas (3 a 5 passos) | **Memória de Trabalho Visuoespacial (Span)** |
| **5** | **Flexibilidade** | Paradigma Task Switching | Alternância imprevista entre classificar por Cor vs Forma | **Flexibilidade Cognitiva & Switch Cost** |
| **6** | **Percepção Temporal** | Reprodução de Intervalos | Reprodução motora manual de durações de 2s e 3.5s | **Cegueira Temporal & Viés de Estimativa** |

---

## 🎨 Sistema de Temas e Gamificação por Idade

A aplicação conta com uma regra estrita de exibição conforme a faixa etária selecionada no onboarding:

### 👧👦 Para Crianças (6 a 12 anos): Acesso aos Temas Lúdicos
- 🦁 **Safári dos Animais**: Estímulos com Leãozinho amigo 🦁 (Go) vs Abelha picadora 🐝 (No-Go), estrelas ⭐ e pegadas 🐾.
- 🦖 **Mundo dos Dinossauros**: Brontossauro 🦕 (Go) vs T-Rex 🦖 (No-Go), ovos dourados 🥚 e fósseis 🦴.
- 🛸 **Astronautas & Galáxia**: Foguete aliado 🚀 (Go) vs Meteoro ☄️ (No-Go), super estrelas 🌟 e baterias 🔋.
- 🚀 **Espaço Cósmico**: Versão espacial neutra.

### 🧑👨 Para Adolescentes e Adultos (13+ anos): Temas Estritamente Sóbrios
- 🚀 **Espaço Cósmico (Padrão Dark)**: Fundo escuro azul-ardósia com alto contraste, relaxante para a visão.
- 🩺 **Clínico / Consultório (Clean Light)**: Fundo claro profissional, ideal para clínicas médicas e de psicologia.
*(Os temas infantis são rigorosamente ocultados para adultos).*

---

## 🏠 Navegação Acessível e Botão de Início

- **Botão `🏠` no Cabeçalho**: Permite ao profissional, pai ou usuário retornar à tela inicial a qualquer momento para alterar a **idade**, o **modo** ou o **tema**.
- **Modal de Confirmação Seguro**: Evita que cliques acidentais durante uma tarefa interrompam a sessão em andamento.
- **Parada Limpa**: Ao confirmar, todos os timers, sintetizadores de áudio e ouvintes de eventos são limpos imediatamente.

---

## 🚀 Como Executar Localmente

Como a aplicação é modularizada em JavaScript nativo (sem etapa de build obrigatória), execute com qualquer servidor estático:

### Opção 1: Via Python (Nativo no Windows, Linux e macOS)
```bash
python -m http.server 8080
```
Acesse no navegador: **[http://localhost:8080](http://localhost:8080)**

### Opção 2: Via Node.js / NPX
```bash
npm start
# ou
npx serve -p 8080 .
```

---

## 🧪 Bateria de Testes Automatizados

O repositório inclui suite de testes automatizados para validação do motor estatístico e das regras de temas:

```bash
npm test
# ou
node tests/test_metrics.js
```
*Saída esperada: 27/27 testes aprovados (cálculos de RT, RTV, $d'$, Hautus, declínio de vigilância, switch cost e isolamento de temas por idade).*

---

## 📁 Estrutura do Repositório

```
tdah-screening-game/
├── index.html                   # PWA Shell responsivo com suporte a leitor de tela
├── manifest.json                # Manifesto de instalação PWA (Standalone)
├── sw.js                        # Service Worker (Estratégia Network-First v5)
├── package.json                 # Metadados e scripts de execução/teste
├── .gitignore                   # Exclusão de arquivos temporários e logs
├── LICENSE                      # Licença MIT com cláusula de isenção médica
├── README.md                    # [Este documento] Visão geral e guia rápido
├── css/
│   └── style.css                # Design tokens, paletas dos 5 temas e media queries de impressão
├── js/
│   ├── app.js                   # Orquestrador de fluxo e máquina de estados da aplicação
│   ├── audio.js                 # Sintetizador procedural com Web Audio API
│   ├── timer.js                 # Cronometria precisa (performance.now e hardware timestamps)
│   ├── metrics.js               # Fórmulas estatísticas e Teoria de Detecção de Sinal (SDT)
│   ├── state.js                 # Modelo de dados da sessão e exportador CSV/JSON
│   ├── themes.js                # Catálogo de temas, ícones e regras de restrição por idade
│   ├── games/                   # Os 6 mini-jogos neurocognitivos
│   │   ├── gonogo.js            # 1. Controle Inibitório
│   │   ├── cpt.js               # 2. Atenção Sustentada (CPT)
│   │   ├── selective.js         # 3. Atenção Seletiva (Flanker)
│   │   ├── memory.js            # 4. Memória de Trabalho Espacial (Corsi)
│   │   ├── switching.js         # 5. Flexibilidade Cognitiva (Task Switching)
│   │   └── timeest.js           # 6. Percepção Temporal (Time Estimation)
│   └── ui/                      # Camadas de interface
│       ├── onboarding.js        # Configuração de idade, modo e termo ético
│       ├── tutorial.js          # Tutoriais guiados com feedback imediato
│       └── report.js            # Dashboard analítico com radar 6 eixos e exportações
├── docs/                        # Centro de Documentação do Projeto
│   ├── INDEX.md                 # Índice mestre com navegação detalhada
│   ├── ARQUITETURA.md           # Engenharia de software, fluxo de dados e precisão temporal
│   ├── MANUAL_DO_USUARIO.md     # Guia prático para clínicos, pais e pacientes
│   ├── METRICS.md               # Especificação matemática e referências científicas
│   ├── GUIA_ENTREGA_CLIENTE.md  # Manual comercial de deploy, PWA e White-Label
│   └── EDITAL_VAGA.md           # Modelo de Termo de Referência / Vaga (1 Página)
└── tests/                       # Testes de unidade e consistência
    └── test_metrics.js          # Suite de testes automatizados das métricas
```

---

## 📚 Hub de Documentação Técnica

Consulte os guias específicos na pasta [`docs/`](docs/):

- 📖 [**docs/INDEX.md**](docs/INDEX.md): Mapa mestre da documentação.
- 🏛️ [**docs/ARQUITETURA.md**](docs/ARQUITETURA.md): Engenharia de software, temporização e ciclo de vida.
- 🩺 [**docs/MANUAL_DO_USUARIO.md**](docs/MANUAL_DO_USUARIO.md): Guia de aplicação clínica, interpretação do radar e boas práticas.
- 🔬 [**docs/METRICS.md**](docs/METRICS.md): Equações matemáticas completas e referências de neuropsicologia.
- 💼 [**docs/GUIA_ENTREGA_CLIENTE.md**](docs/GUIA_ENTREGA_CLIENTE.md): Passo a passo para publicação na nuvem, PWA e personalização de marca.
- 📋 [**docs/EDITAL_VAGA.md**](docs/EDITAL_VAGA.md): Modelo pronto de termo de referência de 1 página.

---

## 💼 Entrega Comercial para Clientes

Consulte o documento completo em [`docs/GUIA_ENTREGA_CLIENTE.md`](docs/GUIA_ENTREGA_CLIENTE.md). As principais modalidades incluem:
1. **Nuvem com Domínio Próprio da Clínica**: Deploy gratuito no Vercel ou Netlify em 2 minutos (ex.: `triagem.clinicax.com.br`).
2. **Aplicativo Instalável (PWA)**: Usuários instalam o app direto no celular (Android/iOS) com ícone próprio e suporte offline.
3. **Pacote ZIP Chave na Mão**: Para hospedar em servidores tradicionais (cPanel, Apache, Nginx).
4. **White-Label**: Instruções para customização de logo, nome e cores da marca do cliente.

---

## ⚠️ Aviso Ético e Legal

O **NeuroScreen TDAH** é um instrumento voltado estritamente para **autoavaliação inicial, triagem neurocognitiva e pesquisa**. 

**NÃO CONSTITUI NEM SUBSTITUI AVALIAÇÃO MÉDICA OU NEUROPSICOLÓGICA CLÍNICA**. Qualquer hipótese diagnóstica de Transtorno de Déficit de Atenção e Hiperatividade deve ser investigada e validada por profissionais de saúde mental habilitados (psiquiatras, neurologistas ou neuropsicólogos).
