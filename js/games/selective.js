/**
 * Mini-jogo 3: Atenção Seletiva e Tempo de Reação (Paradigma Flanker & Distratores)
 * Avalia a capacidade de filtrar estímulos distratores concorrentes e focar
 * exclusivamente no alvo central relevante (Custo de Interferência Cognitiva).
 */

import { PreciseTimer } from '../timer.js';
import { CognitiveMetrics } from '../metrics.js';
import { sound } from '../audio.js';

export class SelectiveAttentionGame {
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
    
    this.boundKeyHandler = this.handleKeyInput.bind(this);
    this.boundBtnHandler = this.handleBtnInput.bind(this);
    this.activeTrial = null;
  }

  setupTrials(mode = 'full') {
    // 32 ensaios no modo completo (~1.5 min); 12 ensaios no modo rápido (~35s)
    const totalTrials = mode === 'quick' ? 12 : 32;
    const half = Math.floor(totalTrials / 2);

    const conditions = [
      ...Array(half).fill('congruent'),
      ...Array(totalTrials - half).fill('incongruent')
    ];

    // Embaralhamento
    for (let i = conditions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [conditions[i], conditions[j]] = [conditions[j], conditions[i]];
    }

    this.trialsConfig = conditions.map((cond, idx) => {
      const targetDir = Math.random() > 0.5 ? 'left' : 'right';
      const flankerDir = cond === 'congruent' ? targetDir : (targetDir === 'left' ? 'right' : 'left');

      return {
        index: idx,
        condition: cond,
        targetDir,
        flankerDir,
        isi: PreciseTimer.getRandomISI(800, 1300),
        duration: 1200 // Janela para responder
      };
    });
  }

  start(mode = 'full') {
    this.setupTrials(mode);
    this.running = true;
    this.currentTrial = 0;
    this.results = [];

    // Habilitar controles direcionais no rodapé para telas móveis
    this.renderDirectionalControls();

    window.addEventListener('keydown', this.boundKeyHandler);

    this.runNextTrial();
  }

  stop() {
    this.running = false;
    window.removeEventListener('keydown', this.boundKeyHandler);
    this.arena.innerHTML = '';
    if (this.controlsEl) {
      this.controlsEl.innerHTML = '';
    }
  }

  renderDirectionalControls() {
    if (!this.controlsEl) return;
    this.controlsEl.innerHTML = `
      <div style="display: flex; gap: 1rem; width: 100%; max-width: 480px;">
        <button id="btnFlankerLeft" class="btn btn-primary" style="flex: 1; height: 60px; font-size: 1.4rem;" aria-label="Responder Esquerda">
          ◀ ESQUERDA
        </button>
        <button id="btnFlankerRight" class="btn btn-primary" style="flex: 1; height: 60px; font-size: 1.4rem;" aria-label="Responder Direita">
          DIREITA ▶
        </button>
      </div>
    `;

    document.getElementById('btnFlankerLeft')?.addEventListener('pointerdown', (e) => this.handleBtnInput(e, 'left'));
    document.getElementById('btnFlankerRight')?.addEventListener('pointerdown', (e) => this.handleBtnInput(e, 'right'));
  }

  updateHUD() {
    if (!this.hud) return;
    const progress = (this.currentTrial / this.trialsConfig.length) * 100;
    this.hud.innerHTML = `
      <span>Desafio 3 de 3: <strong>Atenção Seletiva (Flanker)</strong></span>
      <div class="progress-track" role="progressbar" aria-valuenow="${Math.round(progress)}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar-fill" style="width: ${progress}%"></div>
      </div>
      <span>${this.currentTrial} / ${this.trialsConfig.length}</span>
    `;
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
      condition: config.condition,
      targetDir: config.targetDir,
      flankerDir: config.flankerDir,
      responded: false,
      correct: false,
      rt: null,
      anticipatory: false,
      phase: 'isi'
    };

    await PreciseTimer.sleep(config.isi);
    if (!this.running) return;

    // Fase 2: Apresentar matriz Flanker (5 setas, com a central sendo o alvo de foco)
    this.activeTrial.phase = 'stimulus';
    const targetSymbol = config.targetDir === 'left' ? '◄' : '►';
    const flankerSymbol = config.flankerDir === 'left' ? '◄' : '►';

    this.arena.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
        <div style="font-size: 0.9rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">
          Foque apenas na <strong style="color: #38bdf8;">SETA CENTRAL</strong>
        </div>
        <div style="display: flex; align-items: center; gap: 0.8rem; font-size: 3.2rem; font-family: monospace; font-weight: 800; user-select: none;">
          <span style="color: #64748b; opacity: 0.75;">${flankerSymbol}</span>
          <span style="color: #64748b; opacity: 0.75;">${flankerSymbol}</span>
          <span style="color: #38bdf8; background: rgba(56, 189, 248, 0.15); border: 2px solid #38bdf8; border-radius: 12px; padding: 0.1rem 0.6rem; box-shadow: 0 0 25px rgba(56, 189, 248, 0.4);">${targetSymbol}</span>
          <span style="color: #64748b; opacity: 0.75;">${flankerSymbol}</span>
          <span style="color: #64748b; opacity: 0.75;">${flankerSymbol}</span>
        </div>
      </div>
    `;

    await this.timer.markStimulusOn();

    // Janela de resposta de 1200ms
    await PreciseTimer.sleep(config.duration);
    if (!this.running) return;

    // Registrar omissão caso não tenha respondido
    if (!this.activeTrial.responded) {
      this.results.push({
        condition: this.activeTrial.condition,
        targetDir: this.activeTrial.targetDir,
        responded: false,
        correct: false,
        rt: null,
        anticipatory: false
      });
      sound.playCommission();
      this.showMiniFeedback('Tempo esgotado!', 'error');
    }

    this.activeTrial = null;
    await PreciseTimer.sleep(250);
    this.runNextTrial();
  }

  handleKeyInput(event) {
    if (!this.running || !this.activeTrial) return;

    let dir = null;
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
      dir = 'left';
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
      dir = 'right';
    }

    if (!dir) return;
    event.preventDefault();
    this.processResponse(event, dir);
  }

  handleBtnInput(event, dir) {
    if (!this.running || !this.activeTrial) return;
    event.preventDefault();
    this.processResponse(event, dir);
  }

  processResponse(event, chosenDir) {
    if (this.activeTrial.responded) return;

    const rt = this.timer.calculateRT(event);

    if (this.activeTrial.phase === 'isi') {
      this.activeTrial.responded = true;
      this.activeTrial.anticipatory = true;
      this.activeTrial.rt = 0;
      sound.playCommission();
      this.showMiniFeedback('Aguarde as setas!', 'error');
      return;
    }

    if (PreciseTimer.isAnticipatory(rt)) {
      this.activeTrial.responded = true;
      this.activeTrial.anticipatory = true;
      this.activeTrial.rt = rt;
      sound.playCommission();
      this.showMiniFeedback('Muito rápido!', 'error');
      return;
    }

    const isCorrect = chosenDir === this.activeTrial.targetDir;
    this.activeTrial.responded = true;
    this.activeTrial.correct = isCorrect;
    this.activeTrial.rt = rt;

    this.results.push({
      condition: this.activeTrial.condition,
      targetDir: this.activeTrial.targetDir,
      chosenDir,
      responded: true,
      correct: isCorrect,
      rt,
      anticipatory: false
    });

    if (isCorrect) {
      sound.playHit();
      this.showMiniFeedback(`${rt}ms`, 'success');
    } else {
      sound.playCommission();
      this.showMiniFeedback('Direção errada!', 'error');
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
    const analyzedMetrics = CognitiveMetrics.analyzeSelective(this.results);
    if (this.onComplete) {
      this.onComplete(this.results, analyzedMetrics);
    }
  }
}
