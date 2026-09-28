/**
 * Mini-jogo 4: Memória de Trabalho Espacial (Corsi Blocks)
 * Adaptado dinamicamente com temas infantis (Pegadas de animais, fósseis de dinossauros).
 */

import { PreciseTimer } from '../timer.js';
import { CognitiveMetrics } from '../metrics.js';
import { sound } from '../audio.js';
import { sessionState } from '../state.js';
import { getThemeConfig } from '../themes.js';

export class SpatialMemoryGame {
  constructor(arenaEl, hudEl, controlsEl, onComplete) {
    this.arena = arenaEl;
    this.hud = hudEl;
    this.controlsEl = controlsEl;
    this.onComplete = onComplete;
    this.timer = new PreciseTimer();
    this.running = false;
    this.currentTrial = 0;
    this.trialsConfig = [];
    this.results = [];
    this.userSequence = [];
    this.acceptingInput = false;
    this.activeTrial = null;
    this.boundKeyHandler = this.handleGlobalKeyDown.bind(this);
  }

  setupTrials(mode = 'full') {
    const spans = mode === 'quick' ? [3, 3, 4] : [3, 3, 4, 4, 5, 5];

    this.trialsConfig = spans.map((span, idx) => {
      const seq = [];
      for (let i = 0; i < span; i++) {
        let nextPad;
        do {
          nextPad = Math.floor(Math.random() * 9);
        } while (seq.length > 0 && seq[seq.length - 1] === nextPad);
        seq.push(nextPad);
      }
      return { index: idx, span, sequence: seq };
    });
  }

  start(mode = 'full') {
    this.setupTrials(mode);
    this.running = true;
    this.currentTrial = 0;
    this.results = [];
    if (this.controlsEl) this.controlsEl.innerHTML = '';

    window.addEventListener('keydown', this.boundKeyHandler);
    this.runNextTrial();
  }

  stop() {
    this.running = false;
    this.acceptingInput = false;
    window.removeEventListener('keydown', this.boundKeyHandler);
    this.arena.innerHTML = '';
  }

  updateHUD(statusMsg = '') {
    if (!this.hud) return;
    const progress = (this.currentTrial / this.trialsConfig.length) * 100;
    const themeCfg = getThemeConfig(sessionState.getTheme());
    this.hud.innerHTML = `
      <span>Desafio 4 de 6: <strong>${themeCfg.memory.label}</strong> ${statusMsg ? `(${statusMsg})` : ''}</span>
      <div class="progress-track" role="progressbar" aria-valuenow="${Math.round(progress)}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar-fill" style="width: ${progress}%"></div>
      </div>
      <span>${this.currentTrial} / ${this.trialsConfig.length}</span>
    `;
  }

  renderGrid() {
    const themeCfg = getThemeConfig(sessionState.getTheme());
    this.arena.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <div id="memoryInstructionText" style="font-size: 0.95rem; font-weight: 600; color: var(--text-secondary);">
          Observe a sequência de ${themeCfg.memory.label.toLowerCase()}...
        </div>
        <div class="memory-grid" id="memoryGridContainer" role="group" aria-label="Grade de 9 blocos de memória">
          ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `
            <div class="memory-pad" data-index="${i}" id="pad_${i}" tabindex="0" role="button" aria-label="Bloco ${i + 1}">
              <span style="opacity: 0.4; font-size: 1.5rem;" aria-hidden="true">${themeCfg.memory.symbol}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const pads = this.arena.querySelectorAll('.memory-pad');
    pads.forEach(pad => {
      pad.addEventListener('pointerdown', (e) => {
        const padIdx = parseInt(pad.getAttribute('data-index'), 10);
        this.handlePadClick(e, padIdx);
      });

      pad.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.code === 'Space' || e.key === ' ') {
          e.preventDefault();
          const padIdx = parseInt(pad.getAttribute('data-index'), 10);
          this.handlePadClick(e, padIdx);
        }
      });
    });
  }

  handleGlobalKeyDown(e) {
    if (!this.running || !this.acceptingInput) return;
    // Atalhos numéricos de 1 a 9 no teclado normal ou numérico
    const keyMatch = e.code ? e.code.match(/^(Digit|Numpad)([1-9])$/) : null;
    let num = null;
    if (keyMatch) {
      num = parseInt(keyMatch[2], 10);
    } else if (e.key >= '1' && e.key <= '9') {
      num = parseInt(e.key, 10);
    }

    if (num !== null && num >= 1 && num <= 9) {
      e.preventDefault();
      const padIdx = num - 1;
      this.handlePadClick(e, padIdx);
    }
  }

  async runNextTrial() {
    if (!this.running) return;

    if (this.currentTrial >= this.trialsConfig.length) {
      this.finish();
      return;
    }

    this.updateHUD('Observando...');
    const config = this.trialsConfig[this.currentTrial];
    this.currentTrial++;
    this.userSequence = [];
    this.acceptingInput = false;

    this.renderGrid();
    await PreciseTimer.sleep(700);
    if (!this.running) return;

    for (let i = 0; i < config.sequence.length; i++) {
      if (!this.running) return;
      const padIdx = config.sequence[i];
      await this.highlightPad(padIdx, 450);
      await PreciseTimer.sleep(220);
    }

    if (!this.running) return;

    this.updateHUD('Sua vez!');
    const instr = document.getElementById('memoryInstructionText');
    if (instr) {
      instr.textContent = `Sua vez! Toque nos ${config.span} blocos na mesma ordem.`;
      instr.style.color = 'var(--accent-info)';
    }

    this.acceptingInput = true;
    this.activeTrial = {
      span: config.span,
      sequence: config.sequence,
      startTime: performance.now(),
      tapTimings: []
    };
  }

  async highlightPad(padIdx, durationMs = 400) {
    const pad = document.getElementById(`pad_${padIdx}`);
    if (!pad) return;
    pad.classList.add('active-lit');
    const spanIcon = pad.querySelector('span');
    if (spanIcon) spanIcon.style.opacity = '1';

    sound.playBeep(440 + padIdx * 45, durationMs / 1000);
    await PreciseTimer.sleep(durationMs);
    pad.classList.remove('active-lit');
    if (spanIcon) spanIcon.style.opacity = '0.4';
  }

  async handlePadClick(event, padIdx) {
    if (!this.running || !this.acceptingInput || !this.activeTrial) return;

    event.preventDefault();
    const tapTime = performance.now() - this.activeTrial.startTime;
    this.activeTrial.tapTimings.push(tapTime);
    this.userSequence.push(padIdx);

    const pad = document.getElementById(`pad_${padIdx}`);
    if (pad) {
      pad.classList.add('active-lit');
      sound.playBeep(440 + padIdx * 45, 0.12);
      setTimeout(() => pad.classList.remove('active-lit'), 180);
    }

    if (this.userSequence.length === this.activeTrial.sequence.length) {
      this.acceptingInput = false;
      let isCorrect = true;
      for (let i = 0; i < this.activeTrial.sequence.length; i++) {
        if (this.userSequence[i] !== this.activeTrial.sequence[i]) {
          isCorrect = false;
          break;
        }
      }

      this.results.push({
        span: this.activeTrial.span,
        correct: isCorrect,
        expected: this.activeTrial.sequence,
        actual: this.userSequence,
        meanTapRT: CognitiveMetrics.mean(this.activeTrial.tapTimings)
      });

      if (isCorrect) {
        sound.playHit();
        this.showMiniFeedback('Sequência Correta! ⭐', 'success');
      } else {
        sound.playCommission();
        this.showMiniFeedback('Sequência Incorreta', 'error');
      }

      await PreciseTimer.sleep(900);
      this.activeTrial = null;
      this.runNextTrial();
    }
  }

  showMiniFeedback(text, type) {
    const fb = document.createElement('div');
    fb.className = `feedback-badge ${type}`;
    fb.textContent = text;
    this.arena.appendChild(fb);
    setTimeout(() => fb.remove(), 600);
  }

  finish() {
    this.stop();
    const analyzedMetrics = CognitiveMetrics.analyzeSpatialMemory(this.results);
    if (this.onComplete) {
      this.onComplete(this.results, analyzedMetrics);
    }
  }
}
