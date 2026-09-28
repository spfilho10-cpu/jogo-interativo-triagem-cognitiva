/**
 * Mini-jogo 2: CPT Simplificado (Atenção Sustentada e Vigilância Contínua)
 * Adaptado dinamicamente com estímulos dos temas infantis (Animais, Dinos, Espaço).
 */

import { PreciseTimer } from '../timer.js';
import { CognitiveMetrics } from '../metrics.js';
import { sound } from '../audio.js';
import { sessionState } from '../state.js';
import { getThemeConfig } from '../themes.js';

export class CPTGame {
  constructor(arenaEl, hudEl, onComplete) {
    this.arena = arenaEl;
    this.hud = hudEl;
    this.onComplete = onComplete;
    this.timer = new PreciseTimer();
    this.running = false;
    this.currentTrial = 0;
    this.trialsConfig = [];
    this.results = [];
    
    this.boundInputHandler = this.handleInput.bind(this);
    this.activeTrial = null;
    this.stimulusEl = null;
  }

  setupTrials(mode = 'full') {
    const totalTrials = mode === 'quick' ? 16 : 48;
    const targetRatio = 0.30;
    const targetCount = Math.round(totalTrials * targetRatio);
    const nonTargetCount = totalTrials - targetCount;

    const shapes = [
      ...Array(targetCount).fill('target'),
      ...Array(nonTargetCount).fill('nontarget')
    ];

    for (let i = shapes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shapes[i], shapes[j]] = [shapes[j], shapes[i]];
    }

    const themeCfg = getThemeConfig(sessionState.getTheme());
    const distractors = themeCfg.cpt.distractors;

    this.trialsConfig = shapes.map((type, idx) => {
      const isTarget = type === 'target';
      const posX = 15 + Math.random() * 70;
      const posY = 15 + Math.random() * 70;

      return {
        index: idx,
        isTarget,
        symbol: isTarget ? themeCfg.cpt.targetIcon : distractors[Math.floor(Math.random() * distractors.length)],
        x: posX,
        y: posY,
        isi: PreciseTimer.getRandomISI(900, 1600),
        duration: 350
      };
    });
  }

  start(mode = 'full') {
    this.setupTrials(mode);
    this.running = true;
    this.currentTrial = 0;
    this.results = [];

    window.addEventListener('keydown', this.boundInputHandler);
    this.arena.addEventListener('pointerdown', this.boundInputHandler);

    this.runNextTrial();
  }

  stop() {
    this.running = false;
    window.removeEventListener('keydown', this.boundInputHandler);
    this.arena.removeEventListener('pointerdown', this.boundInputHandler);
    this.arena.innerHTML = '';
  }

  updateHUD() {
    if (!this.hud) return;
    const progress = (this.currentTrial / this.trialsConfig.length) * 100;
    const currentBlock = Math.min(4, Math.floor((this.currentTrial / this.trialsConfig.length) * 4) + 1);
    const themeCfg = getThemeConfig(sessionState.getTheme());
    this.hud.innerHTML = `
      <span>Desafio 2 de 6: <strong>Vigilância ${themeCfg.cpt.targetLabel}</strong> (Bloco ${currentBlock}/4)</span>
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

    this.arena.innerHTML = `<div class="fixation-cross">+</div>`;
    this.activeTrial = {
      isTarget: config.isTarget,
      symbol: config.symbol,
      responded: false,
      rt: null,
      anticipatory: false,
      phase: 'isi'
    };

    await PreciseTimer.sleep(config.isi);
    if (!this.running) return;

    this.activeTrial.phase = 'stimulus';
    this.stimulusEl = document.createElement('div');
    this.stimulusEl.className = `stimulus-item ${config.isTarget ? 'cpt-target' : 'cpt-nontarget'}`;
    this.stimulusEl.style.left = `${config.x}%`;
    this.stimulusEl.style.top = `${config.y}%`;
    this.stimulusEl.style.transform = 'translate(-50%, -50%)';
    this.stimulusEl.innerHTML = `<span style="font-size: 2.5rem; user-select: none;">${config.symbol}</span>`;

    this.arena.innerHTML = '';
    this.arena.appendChild(this.stimulusEl);

    await this.timer.markStimulusOn();

    await PreciseTimer.sleep(config.duration);
    if (!this.running) return;

    if (this.stimulusEl && this.stimulusEl.parentNode) {
      this.stimulusEl.remove();
    }
    this.arena.innerHTML = `<div class="fixation-cross">+</div>`;

    await PreciseTimer.sleep(380);
    if (!this.running) return;

    this.results.push({
      isTarget: this.activeTrial.isTarget,
      symbol: this.activeTrial.symbol,
      responded: this.activeTrial.responded,
      rt: this.activeTrial.rt,
      anticipatory: this.activeTrial.anticipatory
    });

    this.activeTrial = null;
    this.runNextTrial();
  }

  handleInput(event) {
    if (!this.running || !this.activeTrial) return;

    if (event.type === 'keydown' && (event.code !== 'Space' && event.key !== ' ')) {
      return;
    }
    if (event.type === 'keydown') {
      event.preventDefault();
    }

    if (this.activeTrial.responded) return;

    const rt = this.timer.calculateRT(event);
    const themeCfg = getThemeConfig(sessionState.getTheme());

    if (this.activeTrial.phase === 'isi') {
      this.activeTrial.responded = true;
      this.activeTrial.anticipatory = true;
      this.activeTrial.rt = 0;
      sound.playCommission();
      this.showMiniFeedback('Aguarde o símbolo surgir!', 'error');
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

    this.activeTrial.responded = true;
    this.activeTrial.rt = rt;

    if (this.activeTrial.isTarget) {
      sound.playHit();
      this.showMiniFeedback(`${rt}ms`, 'success');
    } else {
      sound.playCommission();
      this.showMiniFeedback(`Apenas em ${themeCfg.cpt.targetIcon}!`, 'error');
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
    const analyzedMetrics = CognitiveMetrics.analyzeCPT(this.results);
    if (this.onComplete) {
      this.onComplete(this.results, analyzedMetrics);
    }
  }
}
