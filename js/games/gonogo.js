/**
 * Mini-jogo 1: Go/No-Go (Controle Inibitório e Impulsividade)
 * Adaptado dinamicamente com skins lúdicas infantis (Animais, Dinos, Espaço) e temas adultos.
 */

import { PreciseTimer } from '../timer.js';
import { CognitiveMetrics } from '../metrics.js';
import { sound } from '../audio.js';
import { sessionState } from '../state.js';
import { getThemeConfig } from '../themes.js';

export class GoNoGoGame {
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
    const totalTrials = mode === 'quick' ? 16 : 40;
    const noGoCount = Math.round(totalTrials * 0.25);
    const goCount = totalTrials - noGoCount;

    const types = [
      ...Array(goCount).fill('go'),
      ...Array(noGoCount).fill('nogo')
    ];

    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }

    this.trialsConfig = types.map((type, idx) => ({
      index: idx,
      type: type,
      isi: PreciseTimer.getRandomISI(850, 1400),
      duration: 450
    }));
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
    const themeCfg = getThemeConfig(sessionState.getTheme());
    this.hud.innerHTML = `
      <span>Desafio 1 de 6: <strong>${themeCfg.gonogo.goLabel}</strong> (Go/No-Go)</span>
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
    const themeCfg = getThemeConfig(sessionState.getTheme());

    // Fase 1: ISI
    this.arena.innerHTML = `<div class="fixation-cross">+</div>`;
    this.activeTrial = {
      type: config.type,
      responded: false,
      rt: null,
      anticipatory: false,
      phase: 'isi'
    };

    await PreciseTimer.sleep(config.isi);
    if (!this.running) return;

    // Fase 2: Estímulo Dinâmico do Tema Ativo
    this.activeTrial.phase = 'stimulus';
    this.stimulusEl = document.createElement('div');
    this.stimulusEl.className = `stimulus-item ${config.type === 'go' ? 'go-stimulus' : 'nogo-stimulus'}`;
    
    const icon = config.type === 'go' ? themeCfg.gonogo.goIcon : themeCfg.gonogo.noGoIcon;
    this.stimulusEl.innerHTML = `<span style="font-size: 2.8rem; user-select: none;">${icon}</span>`;

    this.arena.innerHTML = '';
    this.arena.appendChild(this.stimulusEl);

    await this.timer.markStimulusOn();

    await PreciseTimer.sleep(config.duration);
    if (!this.running) return;

    if (this.stimulusEl && this.stimulusEl.parentNode) {
      this.stimulusEl.remove();
    }
    this.arena.innerHTML = `<div class="fixation-cross">+</div>`;

    await PreciseTimer.sleep(350);
    if (!this.running) return;

    this.results.push({
      type: this.activeTrial.type,
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
      this.showMiniFeedback('Aguarde o símbolo!', 'error');
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

    if (this.activeTrial.type === 'go') {
      sound.playHit();
      this.showMiniFeedback(`${rt}ms`, 'success');
    } else {
      sound.playCommission();
      this.showMiniFeedback(`Ops! Era ${themeCfg.gonogo.noGoLabel}!`, 'error');
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
    const analyzedMetrics = CognitiveMetrics.analyzeGoNoGo(this.results);
    if (this.onComplete) {
      this.onComplete(this.results, analyzedMetrics);
    }
  }
}
