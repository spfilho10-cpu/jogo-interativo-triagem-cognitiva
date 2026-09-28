/**
 * Componente de Tutorial Interativo Pré-Jogo (Adaptativo por Tema e Gamificação)
 * Apresenta instruções e estímulos alinhados com o tema visual ativo (Animais, Dinos, Espaço).
 */

import { sound } from '../audio.js';
import { sessionState } from '../state.js';
import { getThemeConfig } from '../themes.js';

export class TutorialUI {
  constructor(containerEl, onTutorialFinished) {
    this.container = containerEl;
    this.onFinished = onTutorialFinished;
  }

  // 1. Tutorial Go/No-Go
  showGoNoGoTutorial() {
    const themeCfg = getThemeConfig(sessionState.getTheme());
    this.container.innerHTML = `
      <div class="card" style="max-width: 620px; text-align: center;">
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-info); text-transform: uppercase;">Tutorial 1 de 6</span>
        <h2 style="margin: 0.5rem 0 0.5rem 0;">Controle de Impulso (Go/No-Go)</h2>
        <p style="margin-bottom: 1.25rem;">Nesta missão, estímulos aparecerão rapidamente no centro da tela.</p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
          <div style="background: rgba(16, 185, 129, 0.12); border: 2px solid var(--accent-go); border-radius: 14px; padding: 1.25rem;">
            <div style="font-size: 3.2rem; margin-bottom: 0.5rem;">${themeCfg.gonogo.goIcon}</div>
            <strong style="color: var(--accent-go); font-size: 1.1rem; display: block;">${themeCfg.gonogo.goLabel}</strong>
            <p style="font-size: 0.9rem; margin-bottom: 0; margin-top: 0.4rem;">
              <strong>${themeCfg.gonogo.goTip}</strong><br>(Espaço ou Toque)
            </p>
          </div>

          <div style="background: rgba(239, 68, 68, 0.12); border: 2px solid var(--accent-nogo); border-radius: 14px; padding: 1.25rem;">
            <div style="font-size: 3.2rem; margin-bottom: 0.5rem;">${themeCfg.gonogo.noGoIcon}</div>
            <strong style="color: var(--accent-nogo); font-size: 1.1rem; display: block;">${themeCfg.gonogo.noGoLabel}</strong>
            <p style="font-size: 0.9rem; margin-bottom: 0; margin-top: 0.4rem;">
              <strong>${themeCfg.gonogo.noGoTip}</strong><br>Segure seu impulso!
            </p>
          </div>
        </div>

        <button id="btnStartRealGame" class="btn btn-success btn-block" style="font-size: 1.1rem; height: 52px;">
          Entendi, Começar Desafio 1 ▶
        </button>
      </div>
    `;

    document.getElementById('btnStartRealGame')?.addEventListener('click', () => {
      sound.playBeep(520, 0.1);
      if (this.onFinished) this.onFinished('gonogo');
    });
  }

  // 2. Tutorial CPT
  showCPTTutorial() {
    const themeCfg = getThemeConfig(sessionState.getTheme());
    const distractorsSample = themeCfg.cpt.distractors.slice(0, 3).join(' ');
    this.container.innerHTML = `
      <div class="card" style="max-width: 620px; text-align: center;">
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-info); text-transform: uppercase;">Tutorial 2 de 6</span>
        <h2 style="margin: 0.5rem 0 0.5rem 0;">Vigilância Contínua (CPT)</h2>
        <p style="margin-bottom: 1.25rem;">Símbolos aparecerão em diferentes lugares da tela.</p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
          <div style="background: rgba(245, 158, 11, 0.12); border: 2px solid var(--accent-warning); border-radius: 14px; padding: 1.25rem;">
            <div style="font-size: 3.2rem; margin-bottom: 0.5rem;">${themeCfg.cpt.targetIcon}</div>
            <strong style="color: var(--accent-warning); font-size: 1.1rem; display: block;">${themeCfg.cpt.targetLabel}</strong>
            <p style="font-size: 0.9rem; margin-bottom: 0; margin-top: 0.4rem;">
              <strong>APERTE SEMPRE!</strong><br>(Espaço ou Toque)
            </p>
          </div>

          <div style="background: rgba(99, 102, 241, 0.12); border: 2px solid var(--border-color); border-radius: 14px; padding: 1.25rem;">
            <div style="font-size: 3.2rem; margin-bottom: 0.5rem;">${distractorsSample}</div>
            <strong style="font-size: 1.1rem; display: block;">Outros Elementos</strong>
            <p style="font-size: 0.9rem; margin-bottom: 0; margin-top: 0.4rem;">
              <strong>IGNORE!</strong><br>Não aperte nada!
            </p>
          </div>
        </div>

        <button id="btnStartRealGame" class="btn btn-success btn-block" style="font-size: 1.1rem; height: 52px;">
          Entendi, Começar Desafio 2 ▶
        </button>
      </div>
    `;

    document.getElementById('btnStartRealGame')?.addEventListener('click', () => {
      sound.playBeep(520, 0.1);
      if (this.onFinished) this.onFinished('cpt');
    });
  }

  // 3. Tutorial Flanker
  showSelectiveTutorial() {
    this.container.innerHTML = `
      <div class="card" style="max-width: 620px; text-align: center;">
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-info); text-transform: uppercase;">Tutorial 3 de 6</span>
        <h2 style="margin: 0.5rem 0 0.5rem 0;">Atenção Seletiva & Distratores (Flanker)</h2>
        <p style="margin-bottom: 1.25rem;">Foque <strong>somente na seta do meio</strong> e ignore as laterais!</p>

        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; padding: 1.25rem; margin: 1.5rem 0;">
          <div style="font-size: 2.6rem; font-family: monospace; font-weight: 800; margin-bottom: 0.5rem;">
            <span style="color: var(--text-muted);">◄</span>
            <span style="color: var(--text-muted);">◄</span>
            <span style="color: var(--accent-info); border: 2px solid var(--accent-info); border-radius: 8px; padding: 0 0.4rem;">►</span>
            <span style="color: var(--text-muted);">◄</span>
            <span style="color: var(--text-muted);">◄</span>
          </div>
          <p style="color: var(--accent-info); font-weight: 600; margin-bottom: 0;">
            A seta do meio aponta para a <strong>DIREITA (►)</strong>. Responda DIREITA!
          </p>
        </div>

        <button id="btnStartRealGame" class="btn btn-success btn-block" style="font-size: 1.1rem; height: 52px;">
          Entendi, Começar Desafio 3 ▶
        </button>
      </div>
    `;

    document.getElementById('btnStartRealGame')?.addEventListener('click', () => {
      sound.playBeep(520, 0.1);
      if (this.onFinished) this.onFinished('selective');
    });
  }

  // 4. Tutorial Memória Espacial (Corsi)
  showMemoryTutorial() {
    const themeCfg = getThemeConfig(sessionState.getTheme());
    this.container.innerHTML = `
      <div class="card" style="max-width: 620px; text-align: center;">
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-info); text-transform: uppercase;">Tutorial 4 de 6</span>
        <h2 style="margin: 0.5rem 0 0.5rem 0;">Memória de Trabalho Espacial</h2>
        <p style="margin-bottom: 1.25rem;">Observe com atenção a sequência dos blocos!</p>

        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; padding: 1.25rem; margin: 1.5rem 0;">
          <div style="font-size: 2.6rem; margin-bottom: 0.5rem;">${themeCfg.memory.symbol} ➔ ${themeCfg.memory.symbol} ➔ ${themeCfg.memory.symbol}</div>
          <strong style="color: var(--accent-info); font-size: 1.15rem; display: block;">Memorize a Sequência</strong>
          <p style="font-size: 0.9rem; margin-bottom: 0; margin-top: 0.4rem;">
            Toque nos mesmos blocos <strong>na mesma ordem</strong> que acenderem.
          </p>
        </div>

        <button id="btnStartRealGame" class="btn btn-success btn-block" style="font-size: 1.1rem; height: 52px;">
          Entendi, Começar Desafio 4 ▶
        </button>
      </div>
    `;

    document.getElementById('btnStartRealGame')?.addEventListener('click', () => {
      sound.playBeep(520, 0.1);
      if (this.onFinished) this.onFinished('memory');
    });
  }

  // 5. Tutorial Flexibilidade Cognitiva
  showSwitchingTutorial() {
    this.container.innerHTML = `
      <div class="card" style="max-width: 620px; text-align: center;">
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-info); text-transform: uppercase;">Tutorial 5 de 6</span>
        <h2 style="margin: 0.5rem 0 0.5rem 0;">Flexibilidade Cognitiva (Troca de Regra)</h2>
        <p style="margin-bottom: 1.25rem;">A regra mudará no banner superior ao longo do desafio!</p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
          <div style="background: rgba(236, 72, 153, 0.12); border: 2px solid var(--accent-purple); border-radius: 14px; padding: 1rem;">
            <strong style="color: var(--accent-purple); display: block; margin-bottom: 0.4rem;">Regra COR</strong>
            <p style="font-size: 0.85rem; margin-bottom: 0;">Classifique se é <strong>AZUL</strong> ou <strong>VERMELHO</strong>.</p>
          </div>
          <div style="background: rgba(56, 189, 248, 0.12); border: 2px solid var(--accent-info); border-radius: 14px; padding: 1rem;">
            <strong style="color: var(--accent-info); display: block; margin-bottom: 0.4rem;">Regra FORMA</strong>
            <p style="font-size: 0.85rem; margin-bottom: 0;">Classifique se é <strong>CÍRCULO</strong> ou <strong>QUADRADO</strong>.</p>
          </div>
        </div>

        <button id="btnStartRealGame" class="btn btn-success btn-block" style="font-size: 1.1rem; height: 52px;">
          Entendi, Começar Desafio 5 ▶
        </button>
      </div>
    `;

    document.getElementById('btnStartRealGame')?.addEventListener('click', () => {
      sound.playBeep(520, 0.1);
      if (this.onFinished) this.onFinished('switching');
    });
  }

  // 6. Tutorial Percepção Temporal
  showTimeEstTutorial() {
    const themeCfg = getThemeConfig(sessionState.getTheme());
    this.container.innerHTML = `
      <div class="card" style="max-width: 620px; text-align: center;">
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-info); text-transform: uppercase;">Tutorial 6 de 6</span>
        <h2 style="margin: 0.5rem 0 0.5rem 0;">Percepção e Reprodução Temporal</h2>
        <p style="margin-bottom: 1.25rem;">Avalia sua precisão em sentir o tempo sem olhar relógio.</p>

        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; padding: 1.25rem; margin: 1.5rem 0;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">${themeCfg.timing.symbol}</div>
          <p style="font-size: 0.95rem; margin-bottom: 0.5rem;">
            1. Primeiro, observe a energia carregar. <strong>Sinta a duração</strong>.
          </p>
          <p style="font-size: 0.95rem; margin-bottom: 0; color: var(--accent-warning); font-weight: 600;">
            2. ${themeCfg.timing.instruction}
          </p>
        </div>

        <button id="btnStartRealGame" class="btn btn-success btn-block" style="font-size: 1.1rem; height: 52px;">
          Entendi, Começar Desafio 6 ▶
        </button>
      </div>
    `;

    document.getElementById('btnStartRealGame')?.addEventListener('click', () => {
      sound.playBeep(520, 0.1);
      if (this.onFinished) this.onFinished('timeest');
    });
  }
}
