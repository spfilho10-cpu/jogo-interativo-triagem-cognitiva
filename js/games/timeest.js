/**
 * Mini-jogo 6: Percepção e Reprodução Temporal (Time Estimation)
 * Adaptado com temas infantis (Alimentar o pet, chocar o ovo de dino, carregar a nave).
 */

import { PreciseTimer } from '../timer.js';
import { CognitiveMetrics } from '../metrics.js';
import { sound } from '../audio.js';
import { sessionState } from '../state.js';
import { getThemeConfig } from '../themes.js';

export class TimeEstimationGame {
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
    this.holdStartTime = 0;
    this.isHolding = false;

    this.boundDownHandler = this.handleHoldStart.bind(this);
    this.boundUpHandler = this.handleHoldEnd.bind(this);
    this.boundBlurHandler = () => {
      if (this.isHolding) {
        this.handleHoldEnd({ type: 'blur' });
      }
    };
  }

  setupTrials(mode = 'full') {
    const targets = mode === 'quick' ? [2000, 3500, 2000, 3500] : [2000, 3500, 2000, 3500, 2000, 3500];
    this.trialsConfig = targets.map((targetMs, idx) => ({
      index: idx,
      targetMs
    }));
  }

  start(mode = 'full') {
    this.setupTrials(mode);
    this.running = true;
    this.currentTrial = 0;
    this.results = [];

    this.runNextTrial();
  }

  stop() {
    this.running = false;
    this.detachListeners();
    this.arena.innerHTML = '';
    if (this.controlsEl) this.controlsEl.innerHTML = '';
  }

  detachListeners() {
    window.removeEventListener('keydown', this.boundDownHandler);
    window.removeEventListener('keyup', this.boundUpHandler);
    window.removeEventListener('blur', this.boundBlurHandler);
    document.removeEventListener('visibilitychange', this.boundBlurHandler);
    const triggerBtn = document.getElementById('btnTimeTrigger');
    if (triggerBtn) {
      triggerBtn.removeEventListener('pointerdown', this.boundDownHandler);
      window.removeEventListener('pointerup', this.boundUpHandler);
    }
  }

  updateHUD(statusMsg = '') {
    if (!this.hud) return;
    const progress = (this.currentTrial / this.trialsConfig.length) * 100;
    this.hud.innerHTML = `
      <span>Desafio 6 de 6: <strong>Percepção Temporal</strong> ${statusMsg ? `(${statusMsg})` : ''}</span>
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

    this.updateHUD('Demonstração');
    const config = this.trialsConfig[this.currentTrial];
    this.currentTrial++;
    if (this.controlsEl) this.controlsEl.innerHTML = '';
    const themeCfg = getThemeConfig(sessionState.getTheme());

    // Fase 1: Intervalo de Referência
    this.arena.innerHTML = `
      <div class="time-gauge-container">
        <div style="font-size: 1rem; font-weight: 600;">
          Memorize a duração da energia:
        </div>
        <div class="time-gauge-orb" id="timeOrbVisual">${themeCfg.timing.symbol}</div>
        <div style="font-size: 0.9rem; color: var(--text-secondary);">Aguarde a demonstração terminar...</div>
      </div>
    `;

    await PreciseTimer.sleep(700);
    if (!this.running) return;

    const orb = document.getElementById('timeOrbVisual');
    if (orb) {
      orb.classList.add('holding');
      sound.playBeep(380, config.targetMs / 1000);
    }

    await PreciseTimer.sleep(config.targetMs);
    if (!this.running) return;

    if (orb) orb.classList.remove('holding');
    await PreciseTimer.sleep(600);
    if (!this.running) return;

    // Fase 2: Reprodução pelo Jogador
    this.updateHUD('Sua vez');
    this.activeTrial = {
      targetMs: config.targetMs,
      completed: false
    };

    this.arena.innerHTML = `
      <div class="time-gauge-container">
        <div style="font-size: 1.1rem; color: var(--accent-info); font-weight: 700; text-align: center;">
          ${themeCfg.timing.instruction}
        </div>
        <div class="time-gauge-orb" id="timeOrbPlayer">${themeCfg.timing.symbol}</div>
        <div style="font-size: 0.9rem; color: var(--text-secondary); text-align: center;">
          <strong>SEGURE</strong> o botão abaixo (ou Barra de Espaço) e <strong>SOLTE</strong> quando achar que o mesmo tempo terminou.
        </div>
      </div>
    `;

    if (this.controlsEl) {
      this.controlsEl.innerHTML = `
        <button id="btnTimeTrigger" class="action-trigger-btn" style="background: linear-gradient(135deg, #d97706, #b45309); border-color: #f59e0b;">
          ⏱️ SEGURE PARA CONTAR TEMPO
        </button>
      `;

      const triggerBtn = document.getElementById('btnTimeTrigger');
      triggerBtn.addEventListener('pointerdown', this.boundDownHandler);
      window.addEventListener('pointerup', this.boundUpHandler);
    }

    window.addEventListener('keydown', this.boundDownHandler);
    window.addEventListener('keyup', this.boundUpHandler);
    window.addEventListener('blur', this.boundBlurHandler);
    document.addEventListener('visibilitychange', this.boundBlurHandler);
  }

  handleHoldStart(e) {
    if (!this.running || !this.activeTrial || this.activeTrial.completed || this.isHolding) return;
    if (e.type === 'keydown' && e.code !== 'Space' && e.key !== ' ') return;
    if (e.type === 'keydown') e.preventDefault();

    this.isHolding = true;
    this.holdStartTime = performance.now();

    const orb = document.getElementById('timeOrbPlayer');
    if (orb) orb.classList.add('holding');
    sound.playBeep(380, 5);
  }

  async handleHoldEnd(e) {
    if (!this.running || !this.activeTrial || this.activeTrial.completed || !this.isHolding) return;
    if (e.type === 'keyup' && e.code !== 'Space' && e.key !== ' ') return;

    this.isHolding = false;
    this.activeTrial.completed = true;
    const holdDuration = Math.round(performance.now() - this.holdStartTime);

    const orb = document.getElementById('timeOrbPlayer');
    if (orb) orb.classList.remove('holding');

    this.detachListeners();

    const diff = holdDuration - this.activeTrial.targetMs;
    const absDiff = Math.abs(diff);
    const errorPct = Number(((absDiff / this.activeTrial.targetMs) * 100).toFixed(1));

    this.results.push({
      targetMs: this.activeTrial.targetMs,
      producedMs: holdDuration,
      diffMs: diff,
      errorPct
    });

    if (errorPct <= 20) {
      sound.playHit();
      this.showMiniFeedback(`Muito preciso! (${holdDuration}ms / Alvo: ${this.activeTrial.targetMs}ms)`, 'success');
    } else {
      sound.playCommission();
      const direction = diff > 0 ? 'Demorou um pouco mais' : 'Soltou antes da hora';
      this.showMiniFeedback(`${direction} (${holdDuration}ms)`, 'error');
    }

    await PreciseTimer.sleep(1400);
    this.activeTrial = null;
    this.runNextTrial();
  }

  showMiniFeedback(text, type) {
    const fb = document.createElement('div');
    fb.className = `feedback-badge ${type}`;
    fb.textContent = text;
    this.arena.appendChild(fb);
    setTimeout(() => fb.remove(), 1000);
  }

  finish() {
    this.stop();
    const analyzedMetrics = CognitiveMetrics.analyzeTimeEstimation(this.results);
    if (this.onComplete) {
      this.onComplete(this.results, analyzedMetrics);
    }
  }
}
