# 🏛️ Arquitetura de Software e Engenharia — NeuroScreen TDAH

Este documento apresenta a especificação técnica aprofundada da arquitetura do **NeuroScreen TDAH**, explicando os padrões de projeto, fluxo de dados, temporização de alta fidelidade e persistência de dados.

---

## 1. Visão Geral da Arquitetura

O projeto adota uma arquitetura **Single Page Application (SPA)** modularizada em **JavaScript ES6+ nativo**, sem empacotadores obrigatórios ou dependências de terceiros. Isso garante máxima velocidade de carregamento, latência nula de processamento e execução instantânea em qualquer navegador moderno.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        index.html (PWA Shell)                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │      js/app.js        │
                        │  (AppCoordinator FSM) │
                        └───────────┬───────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌──────────────┐            ┌──────────────┐                ┌──────────────┐
│ js/themes.js │            │ js/timer.js  │                │ js/audio.js  │
│ (Skin Engine)│            │(PreciseTimer)│                │(AudioEngine) │
└──────┬───────┘            └──────┬───────┘                └──────┬───────┘
       │                           │                               │
       └───────────────────────────┼───────────────────────────────┘
                                   │
                                   ▼
        ┌─────────────────────────────────────────────────────┐
        │                 js/games/ (6 Fases)                 │
        │  [gonogo] [cpt] [selective] [memory] [switch] [time]│
        └──────────────────────────┬──────────────────────────┘
                                   │ Raw Trial Data
                                   ▼
        ┌─────────────────────────────────────────────────────┐
        │                   js/metrics.js                     │
        │  (CognitiveMetrics: SDT, RTV, Switch Cost, Decr.)   │
        └──────────────────────────┬──────────────────────────┘
                                   │ Aggregated Scores
                                   ▼
        ┌─────────────────────────────────────────────────────┐
        │             js/state.js & js/ui/report.js           │
        │      (LocalStorage, Canvas 6-Axis Radar, CSV/JSON)  │
        └─────────────────────────────────────────────────────┘
```

---

## 2. Motor de Cronometria de Ultra-Alta Precisão (`js/timer.js`)

Na neuropsicologia computacional, atrasos de 10 a 30 milissegundos causados por filas de eventos (*event loop*) ou renderização de frames podem corromper as análises de Tempo de Reação e Variabilidade ($SD_{RT}$).

O `PreciseTimer` resolve esse problema combinando três mecanismos:

1. **Sincronização com a Taxa de Atualização (`requestAnimationFrame`)**:
   O carimbo de tempo inicial ($t_0$) é capturado no exato instante em que o monitor vai renderizar o novo frame, utilizando `frameTime || performance.now()`.
2. **Carimbos de Hardware Nativos (`event.timeStamp`)**:
   Em vez de capturar `performance.now()` no momento em que a função de callback do evento de clique/toque é executada, o sistema lê `event.timeStamp`. Este valor é gerado no nível das interrupções de hardware do sistema operacional/navegador, eliminando latências de enfileiramento de JavaScript.
3. **Intervalo Inter-Estímulo com Jitter Randômico (ISI)**:
   Distribuição uniforme sorteada entre 800ms e 1500ms a cada tentativa. Isso impede que o participante entre em ritmo mecânico preditivo (evita automação motora).
4. **Filtro de Respostas Antecipatórias**:
   Qualquer resposta abaixo de $130\text{ ms}$ é marcada como antecipatória (`anticipatory = true`) e segregada do cálculo de tempo de reação válido, pois precede o tempo mínimo de condução sensorial córtico-espinhal humana.

---

## 3. Máquina de Estados da Aplicação (`js/app.js`)

O `AppCoordinator` atua como um autômato finito que gerencia transições limpas e cancelamentos seguros:

```
[Onboarding]
     │
     ▼ (Start)
[Tutorial Fase 1] ──► [Jogo Fase 1: Go/No-Go] ──► [Intermissão 1]
     │
     ▼
[Tutorial Fase 2] ──► [Jogo Fase 2: CPT]       ──► [Intermissão 2]
     │
     ▼
[Tutorial Fase 3] ──► [Jogo Fase 3: Flanker]   ──► [Intermissão 3]
     │
     ▼
[Tutorial Fase 4] ──► [Jogo Fase 4: Memória]   ──► [Intermissão 4]
     │
     ▼
[Tutorial Fase 5] ──► [Jogo Fase 5: Switch]    ──► [Intermissão 5]
     │
     ▼
[Tutorial Fase 6] ──► [Jogo Fase 6: Tempo]     ──► [Relatório Final]
```

### Parada Limpa e Interrupção Segura:
- A propriedade `this.activeGameInstance` mantém uma referência viva ao jogo em execução.
- Ao clicar no botão **🏠 Início**, se o usuário confirmar o cancelamento, o método `activeGameInstance.stop()` é invocado, cancelando imediatamente agendamentos `setTimeout`, parando osciladores de áudio e desvinculando ouvintes de eventos do DOM.

---

## 4. Sintetizador Procedural de Áudio (`js/audio.js`)

Para manter o aplicativo 100% autônomo, offline e leve (menos de 200 KB totais):
- Utiliza a **Web Audio API** nativa (`AudioContext` / `webkitAudioContext`).
- Gera bips senoidais suaves para acertos (sino harmônico D5 ➔ A5 com decaimento exponencial).
- Gera frequências graves em onda triangular (260Hz ➔ 180Hz) para comissões e erros, garantindo feedback **não-punitivo e amigável** para crianças e pessoas neurodivergentes.
- Persiste a preferência de áudio mudo no `localStorage`.

---

## 5. Sistema de Temas e Gamificação Dinâmica (`js/themes.js`)

Os temas visuais não apenas mudam cores no CSS, mas **redefinem os estímulos cognitivos** dentro do motor dos jogos:
- **`animals`**: Go = 🦁, No-Go = 🐝, Alvo CPT = ⭐ contra 🐵🐘🦒, Memória = 🐾.
- **`dinosaurs`**: Go = 🦕, No-Go = 🦖, Alvo CPT = 🥚 contra 🦴🌋🌿, Memória = 🦴.
- **`space_kids`**: Go = 🚀, No-Go = ☄️, Alvo CPT = 🌟 contra 🪐🛸🛰️, Memória = ✨.
- **`cosmic` & `clinical`**: Estímulos sóbrios e geométricos para adolescentes e adultos.

### Regra de Proteção por Idade:
O seletor de temas consulta `getThemesForAgeGroup(ageGroup)`. Caso a faixa etária seja Adulto ou Adolescente, os temas infantis são rigorosamente suprimidos do DOM.

---

## 6. Estratégia de Cache e PWA (`sw.js`)

- **Estratégia**: *Network-First* com fallback transparente para Cache.
- **Auto-Bust**: O arquivo HTML e scripts utilizam query strings de versão (`?v=5`). Ao carregar uma nova versão, o Service Worker descarta automaticamente caches legados através do evento `activate`.
- **Manifesto**: `manifest.json` com suporte a execução `standalone` (sem barras de navegação).

---

## 7. Esquema de Armazenamento e Exportação de Dados

### Modelo de Sessão (`sessionState.session`):
```json
{
  "id": "sess_1773080000000_abc12",
  "timestamp": "2026-09-27T22:30:00.000Z",
  "mode": "full",
  "theme": "animals",
  "participant": {
    "ageGroup": "child",
    "device": {
      "type": "mobile/touch",
      "screen": "412x915",
      "pixelRatio": 2.6,
      "userAgent": "Mozilla/5.0..."
    }
  },
  "results": {
    "gonogo": { "meanRT": 320, "sdRT": 42, "commissionRate": 12.5, "inhibitionScore": 88 },
    "cpt": { "omissionRate": 4.2, "vigilanceDecrement": 5.0, "sustainedScore": 92 },
    "selective": { "interferenceCost": 60, "selectiveScore": 95 },
    "memory": { "maxSpan": 5, "accuracyRate": 83.3, "memoryScore": 88 },
    "switching": { "switchCost": 85, "flexibilityScore": 90 },
    "timeest": { "meanErrorPct": 8.4, "temporalBias": "Calibrado", "timingScore": 88 }
  },
  "rawTrials": { ... },
  "durationSeconds": 540
}
```
As exportações geradas em **CSV** contêm a granularidade milissegúndica de cada tentativa, permitindo análises estatísticas em R, Python, SPSS ou Excel.
