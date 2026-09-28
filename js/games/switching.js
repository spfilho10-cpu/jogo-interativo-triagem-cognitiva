/**
 * Mini-jogo 5: Flexibilidade Cognitiva e Alternância de Regra (Task Switching)
 * Avalia o custo de alternância (*Switch Cost*), rigidez cognitiva e erros perseverativos,
 * áreas tradicionalmente desafiadoras para o funcionamento executivo no TDAH.
 */

import { PreciseTimer } from '../timer.js';
import { CognitiveMetrics } from '../metrics.js';
import { sound } from '../audio.js';

export class TaskSwitchingGame {
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
    this.activeTrial = null;
    
    this.boundKeyHandler = this.handleKeyInput.bind(this);
  }

  setupTrials(mode = 'full') {
    // 24 ensaios no modo completo (~1.5 min); 12 no modo rápido (~40s)
    const totalTrials = mode === 'quick' ? 12 : 24;
    const rules = [];
    let currentRule = Math.random() > 0.5 ? 'color' : 'shape';

    for (let i = 0; i < totalTrials; i++) {
      // Alternar a regra a cada 3 a 5 ensaios
      if (i > 0 && i % (Math.floor(Math.random() * 3) + 3) === 0) {
        currentRule = currentRule === 'color' ? 'shape' : 'color';
      }
      rules.push(currentRule);
    }

    const colors = ['blue', 'red'];
    const shapes = ['circle', 'square'];

    this.trialsConfig = rules.map((rule, idx) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const isSwitch = idx > 0 && rules[idx] !== rules[idx - 1];

      return {
        index: idx,
        rule, // 'color' ou 'shape'
        color, // 'blue' ou 'red'
        shape, // 'circle' ou 'square'
        isSwitch,
        isi: PreciseTimer.getRandomISI(800, 1300)
      };
    });
  }

  start(mode = 'full') {
    this.setupTrials(mode);
    this.running = true;
    this.currentTrial = 0;
    this.results = [];

    window.addEventListener('keydown', this.boundKeyHandler);
    this.runNextTrial();
  }

  stop() {
    this.running = false;
    window.removeEventListener('keydown', this.boundKeyHandler);
    this.arena.innerHTML = '';
    if (this.controlsEl) this.controlsEl.innerHTML = '';
  }

  updateHUD() {
    if (!this.hud) return;
    const progress = (this.currentTrial / this.trialsConfig.length) * 100;
    this.hud.innerHTML = `
      <span>Desafio 5 de 6: <strong>Flexibilidade Cognitiva</strong></span>
      <div class="progress-track" role="progressbar" aria-valuenow="${Math.round(progress)}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar-fill" style="width: ${progress}%"></div>
      </div>
      <span>${this.currentTrial} / ${this.trialsConfig.length}</span>
    `;
  }

  renderControls(rule) {
    if (!this.controlsEl) return;
    if (rule === 'color') {
      this.controlsEl.innerHTML = `
        <div style="display: flex; gap: 1rem; width: 100%; max-width: 460px;">
          <button id="btnSwitchOpt1" class="btn" style="flex: 1; height: 56px; background: #2563eb; color: #fff; font-weight: 700; font-size: 1.1rem;">
            🔵 AZUL (1)
          </button>
          <button id="btnSwitchOpt2" class="btn" style="flex: 1; height: 56px; background: #dc2626; color: #fff; font-weight: 700; font-size: 1.1rem;">
            🔴 VERMELHO (2)
          </button>
        </div>
      `;
      document.getElementById('btnSwitchOpt1')?.addEventListener('pointerdown', (e) => this.handleResponse(e, 'blue'));
      document.getElementById('btnSwitchOpt2')?.addEventListener('pointerdown', (e) => this.handleResponse(e, 'red'));
    } else {
      this.controlsEl.innerHTML = `
        <div style="display: flex; gap: 1rem; width: 100%; max-width: 460px;">
          <button id="btnSwitchOpt1" class="btn" style="flex: 1; height: 56px; background: #0284c7; color: #fff; font-weight: 700; font-size: 1.1rem;">
            ⚪ CÍRCULO (1)
          </button>
          <button id="btnSwitchOpt2" class="btn" style="flex: 1; height: 56px; background: #0284c7; color: #fff; font-weight: 700; font-size: 1.1rem;">
            ⏹️ QUADRADO (2)
          </button>
        </div>
      `;
      document.getElementById('btnSwitchOpt1')?.addEventListener('pointerdown', (e) => this.handleResponse(e, 'circle'));
      document.getElementById('btnSwitchOpt2')?.addEventListener('pointerdown', (e) => this.handleResponse(e, 'square'));
    }
  }

  async runNextTrial() {
    if (!this.running) return;

    if (this.currentTrial >= this.trialsConfig.length) {
      this.finish();
      return;
    }

    this.updateHUD();
    const config = this.trialsConfig[this.currentTrial];
    this.currentTrial++;

    // Fase 1: ISI
    this.arena.innerHTML = `<div class="fixation-cross">+</div>`;
    this.activeTrial = {
      rule: config.rule,
      color: config.color,
      shape: config.shape,
      isSwitch: config.isSwitch,
      responded: false,
      phase: 'isi'
    };

    await PreciseTimer.sleep(config.isi);
    if (!this.running) return;

    // Fase 2: Exibir banner de regra e o estímulo
    this.activeTrial.phase = 'stimulus';
    const ruleLabel = config.rule === 'color' ? '🎨 CLASSIFIQUE PELA COR' : '📐 CLASSIFIQUE PELA FORMA';
    const ruleClass = config.rule === 'color' ? 'rule-color' : 'rule-shape';

    // Ícone do estímulo
    let symbol = '🔵';
    if (config.color === 'blue' && config.shape === 'circle') symbol = '🔵';
    else if (config.color === 'blue' && config.shape === 'square') symbol = '🟦';
    else if (config.color === 'red' && config.shape === 'circle') symbol = '🔴';
    else if (config.color === 'red' && config.shape === 'square') symbol = '🟥';

    this.arena.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 1.25rem;">
        <div class="rule-indicator-banner ${ruleClass}">${ruleLabel}</div>
        <div class="switching-stimulus-card">${symbol}</div>
      </div>
    `;

    this.renderControls(config.rule);
    await this.timer.markStimulusOn();

    // Janela de resposta de 2.5s
    await PreciseTimer.sleep(2500);
    if (!this.running) return;

    if (!this.activeTrial.responded) {
      this.results.push({
        rule: this.activeTrial.rule,
        isSwitch: this.activeTrial.isSwitch,
        responded: false,
        correct: false,
        rt: null
      });
      sound.playCommission();
      this.showMiniFeedback('Tempo esgotado!', 'error');
    }

    this.activeTrial = null;
    await PreciseTimer.sleep(300);
    this.runNextTrial();
  }

  handleKeyInput(event) {
    if (!this.running || !this.activeTrial || this.activeTrial.phase !== 'stimulus') return;
    const key = event.key;
    if (key !== '1' && key !== '2' && key !== 'ArrowLeft' && key !== 'ArrowRight') return;
    event.preventDefault();

    let chosen = null;
    if (this.activeTrial.rule === 'color') {
      chosen = (key === '1' || key === 'ArrowLeft') ? 'blue' : 'red';
    } else {
      chosen = (key === '1' || key === 'ArrowLeft') ? 'circle' : 'square';
    }

    this.handleResponse(event, chosen);
  }

  handleResponse(event, chosen) {
    if (!this.activeTrial || this.activeTrial.responded || this.activeTrial.phase !== 'stimulus') return;

    const rt = this.timer.calculateRT(event);
    if (PreciseTimer.isAnticipatory(rt)) return;

    this.activeTrial.responded = true;
    const correctTarget = this.activeTrial.rule === 'color' ? this.activeTrial.color : this.activeTrial.shape;
    const isCorrect = chosen === correctTarget;

    this.results.push({
      rule: this.activeTrial.rule,
      isSwitch: this.activeTrial.isSwitch,
      responded: true,
      correct: isCorrect,
      rt
    });

    if (isCorrect) {
      sound.playHit();
      this.showMiniFeedback(`${rt}ms`, 'success');
    } else {
      sound.playCommission();
      this.showMiniFeedback('Regra incorreta!', 'error');
    }
  }

  showMiniFeedback(text, type) {
    const fb = document.createElement('div');
    fb.className = `feedback-badge ${type}`;
    fb.textContent = text;
    this.arena.appendChild(fb);
    setTimeout(() => fb.remove(), 400);
  }

  finish() {
    this.stop();
    const analyzedMetrics = CognitiveMetrics.analyzeTaskSwitching(this.results);
    if (this.onComplete) {
      this.onComplete(this.results, analyzedMetrics);
    }
  }
}
