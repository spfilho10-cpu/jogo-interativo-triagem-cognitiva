/**
 * Orquestrador Central da Aplicação (App State Machine - 6 Fases)
 * Coordena o fluxo entre Onboarding, Tutoriais, as 6 Tarefas Cognitivas, Pausas e Relatório Final.
 * Inclui controle de retorno ao início (Home / Reinício Seguro).
 */

import { sound } from './audio.js';
import { sessionState } from './state.js';
import { OnboardingUI } from './ui/onboarding.js';
import { TutorialUI } from './ui/tutorial.js';
import { ReportUI } from './ui/report.js';
import { GoNoGoGame } from './games/gonogo.js';
import { CPTGame } from './games/cpt.js';
import { SelectiveAttentionGame } from './games/selective.js';
import { SpatialMemoryGame } from './games/memory.js';
import { TaskSwitchingGame } from './games/switching.js';
import { TimeEstimationGame } from './games/timeest.js';

class AppCoordinator {
  constructor() {
    this.screenContainer = document.getElementById('mainViewport');
    this.audioToggleBtn = document.getElementById('btnToggleAudio');
    this.fullscreenBtn = document.getElementById('btnFullscreen');
    this.themeSelector = document.getElementById('headerThemeSelector');
    this.homeBtn = document.getElementById('btnHome');
    
    this.activeGameInstance = null;
    this.currentScreen = 'onboarding';

    this.initHeaderControls();
    this.showOnboarding();
  }

  initHeaderControls() {
    // 1. Inicializar Tema Salvo
    const currentTheme = sessionState.getTheme();
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (this.themeSelector) {
      this.themeSelector.value = currentTheme;
      this.themeSelector.addEventListener('change', (e) => {
        sessionState.setTheme(e.target.value);
        const onboardingThemeSelect = document.getElementById('selectThemePicker');
        if (onboardingThemeSelect) onboardingThemeSelect.value = e.target.value;
      });
    }

    // 2. Botão Voltar ao Início / Reconfigurar
    if (this.homeBtn) {
      this.homeBtn.addEventListener('click', () => {
        this.handleHomeClick();
      });
    }

    // 3. Alternador de Áudio
    if (this.audioToggleBtn) {
      this.updateAudioIcon();
      this.audioToggleBtn.addEventListener('click', () => {
        sound.toggleMute();
        this.updateAudioIcon();
      });
    }

    // 4. Tela Cheia
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          this.fullscreenBtn.textContent = '⤓';
        } else {
          document.exitFullscreen().catch(() => {});
          this.fullscreenBtn.textContent = '⤢';
        }
      });
    }
  }

  updateAudioIcon() {
    if (!this.audioToggleBtn) return;
    this.audioToggleBtn.textContent = sound.isMuted() ? '🔇' : '🔊';
    this.audioToggleBtn.setAttribute('aria-label', sound.isMuted() ? 'Ativar som' : 'Desativar som');
  }

  // Tratamento do clique no botão Home / Início
  handleHomeClick() {
    if (this.currentScreen === 'onboarding') {
      // Já está na tela inicial
      return;
    }

    // Se estiver em jogo ou tutorial, exibir modal de confirmação para não perder dados por acidente
    this.showHomeConfirmModal();
  }

  showHomeConfirmModal() {
    // Remover modal anterior caso exista
    const existing = document.getElementById('homeConfirmModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'homeConfirmModal';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content" style="text-align: center; max-width: 480px;">
        <div style="font-size: 2.8rem; margin-bottom: 0.5rem;">🏠</div>
        <h3 style="margin-bottom: 0.5rem;">Voltar à Tela Inicial?</h3>
        <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Deseja interromper a sessão atual para alterar a <strong>idade</strong>, o <strong>modo</strong> ou o <strong>tema</strong>? 
          A rodada atual será reiniciada.
        </p>
        <div style="display: flex; gap: 0.75rem; justify-content: center;">
          <button id="btnCancelHomeModal" class="btn btn-secondary" style="flex: 1;">
            Continuar Teste
          </button>
          <button id="btnConfirmHomeModal" class="btn btn-primary" style="flex: 1;">
            Sim, Voltar ao Início
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btnCancelHomeModal')?.addEventListener('click', () => {
      modal.remove();
    });

    document.getElementById('btnConfirmHomeModal')?.addEventListener('click', () => {
      modal.remove();
      this.forceReturnToHome();
    });
  }

  forceReturnToHome() {
    // Parar jogo ativo se houver
    if (this.activeGameInstance && typeof this.activeGameInstance.stop === 'function') {
      this.activeGameInstance.stop();
      this.activeGameInstance = null;
    }
    sound.playBeep(350, 0.1);
    this.showOnboarding();
  }

  // 1. Tela Inicial
  showOnboarding() {
    this.currentScreen = 'onboarding';
    this.activeGameInstance = null;
    sessionState.reset();

    const onboarding = new OnboardingUI(this.screenContainer, ({ ageGroup, mode, theme }) => {
      sessionState.setAgeGroup(ageGroup);
      sessionState.setMode(mode);
      if (theme) sessionState.setTheme(theme);
      sessionState.startSessionTimer();
      this.showGoNoGoTutorial();
    });
    onboarding.render();
  }

  // FASE 1: Go/No-Go
  showGoNoGoTutorial() {
    this.currentScreen = 'tutorial';
    this.activeGameInstance = null;
    const tutorial = new TutorialUI(this.screenContainer, () => this.launchGoNoGo());
    tutorial.showGoNoGoTutorial();
  }

  launchGoNoGo() {
    this.currentScreen = 'game';
    this.renderGameShell();
    const arenaEl = document.getElementById('stageCanvas');
    const hudEl = document.getElementById('gameHud');

    const game = new GoNoGoGame(arenaEl, hudEl, (rawTrials, metrics) => {
      this.activeGameInstance = null;
      sessionState.session.rawTrials.gonogo = rawTrials;
      sessionState.session.results.gonogo = metrics;
      this.showIntermission(
        'Fase 1 concluída! 🎉',
        'Próximo desafio (2/6): avaliaremos sua <strong>atenção sustentada e vigilância contínua</strong>.',
        () => this.showCPTTutorial()
      );
    });

    this.activeGameInstance = game;
    game.start(sessionState.session.mode);
  }

  // FASE 2: CPT
  showCPTTutorial() {
    this.currentScreen = 'tutorial';
    this.activeGameInstance = null;
    const tutorial = new TutorialUI(this.screenContainer, () => this.launchCPT());
    tutorial.showCPTTutorial();
  }

  launchCPT() {
    this.currentScreen = 'game';
    this.renderGameShell();
    const arenaEl = document.getElementById('stageCanvas');
    const hudEl = document.getElementById('gameHud');

    const game = new CPTGame(arenaEl, hudEl, (rawTrials, metrics) => {
      this.activeGameInstance = null;
      sessionState.session.rawTrials.cpt = rawTrials;
      sessionState.session.results.cpt = metrics;
      this.showIntermission(
        'Fase 2 concluída! 🌟',
        'Próximo desafio (3/6): teste de <strong>atenção seletiva contra distratores</strong>.',
        () => this.showSelectiveTutorial()
      );
    });

    this.activeGameInstance = game;
    game.start(sessionState.session.mode);
  }

  // FASE 3: Flanker / Atenção Seletiva
  showSelectiveTutorial() {
    this.currentScreen = 'tutorial';
    this.activeGameInstance = null;
    const tutorial = new TutorialUI(this.screenContainer, () => this.launchSelective());
    tutorial.showSelectiveTutorial();
  }

  launchSelective() {
    this.currentScreen = 'game';
    this.renderGameShell();
    const arenaEl = document.getElementById('stageCanvas');
    const hudEl = document.getElementById('gameHud');
    const controlsEl = document.getElementById('gameControlsFooter');

    const game = new SelectiveAttentionGame(arenaEl, hudEl, controlsEl, (rawTrials, metrics) => {
      this.activeGameInstance = null;
      sessionState.session.rawTrials.selective = rawTrials;
      sessionState.session.results.selective = metrics;
      this.showIntermission(
        'Fase 3 concluída! 🎯',
        'Próximo desafio (4/6): teste de <strong>memória de trabalho espacial</strong>.',
        () => this.showMemoryTutorial()
      );
    });

    this.activeGameInstance = game;
    game.start(sessionState.session.mode);
  }

  // FASE 4: Memória Espacial (Corsi)
  showMemoryTutorial() {
    this.currentScreen = 'tutorial';
    this.activeGameInstance = null;
    const tutorial = new TutorialUI(this.screenContainer, () => this.launchMemory());
    tutorial.showMemoryTutorial();
  }

  launchMemory() {
    this.currentScreen = 'game';
    this.renderGameShell();
    const arenaEl = document.getElementById('stageCanvas');
    const hudEl = document.getElementById('gameHud');
    const controlsEl = document.getElementById('gameControlsFooter');

    const game = new SpatialMemoryGame(arenaEl, hudEl, controlsEl, (rawTrials, metrics) => {
      this.activeGameInstance = null;
      sessionState.session.rawTrials.memory = rawTrials;
      sessionState.session.results.memory = metrics;
      this.showIntermission(
        'Fase 4 concluída! 💡',
        'Próximo desafio (5/6): teste de <strong>flexibilidade cognitiva e troca de regras</strong>.',
        () => this.showSwitchingTutorial()
      );
    });

    this.activeGameInstance = game;
    game.start(sessionState.session.mode);
  }

  // FASE 5: Task Switching (Flexibilidade)
  showSwitchingTutorial() {
    this.currentScreen = 'tutorial';
    this.activeGameInstance = null;
    const tutorial = new TutorialUI(this.screenContainer, () => this.launchSwitching());
    tutorial.showSwitchingTutorial();
  }

  launchSwitching() {
    this.currentScreen = 'game';
    this.renderGameShell();
    const arenaEl = document.getElementById('stageCanvas');
    const hudEl = document.getElementById('gameHud');
    const controlsEl = document.getElementById('gameControlsFooter');

    const game = new TaskSwitchingGame(arenaEl, hudEl, controlsEl, (rawTrials, metrics) => {
      this.activeGameInstance = null;
      sessionState.session.rawTrials.switching = rawTrials;
      sessionState.session.results.switching = metrics;
      this.showIntermission(
        'Fase 5 concluída! 🔄',
        'Último desafio (6/6): teste de <strong>percepção e reprodução temporal</strong>.',
        () => this.showTimeEstTutorial()
      );
    });

    this.activeGameInstance = game;
    game.start(sessionState.session.mode);
  }

  // FASE 6: Percepção Temporal
  showTimeEstTutorial() {
    this.currentScreen = 'tutorial';
    this.activeGameInstance = null;
    const tutorial = new TutorialUI(this.screenContainer, () => this.launchTimeEst());
    tutorial.showTimeEstTutorial();
  }

  launchTimeEst() {
    this.currentScreen = 'game';
    this.renderGameShell();
    const arenaEl = document.getElementById('stageCanvas');
    const hudEl = document.getElementById('gameHud');
    const controlsEl = document.getElementById('gameControlsFooter');

    const game = new TimeEstimationGame(arenaEl, hudEl, controlsEl, (rawTrials, metrics) => {
      this.activeGameInstance = null;
      sessionState.session.rawTrials.timeest = rawTrials;
      sessionState.session.results.timeest = metrics;
      this.showReport();
    });

    this.activeGameInstance = game;
    game.start(sessionState.session.mode);
  }

  // Relatório Final Expandido
  showReport() {
    this.currentScreen = 'report';
    this.activeGameInstance = null;
    sessionState.finalizeSession();
    const report = new ReportUI(this.screenContainer, sessionState, () => {
      this.showOnboarding();
    });
    report.render();
  }

  renderGameShell() {
    this.screenContainer.innerHTML = `
      <div class="game-arena">
        <div id="gameHud" class="game-hud"></div>
        <div id="stageCanvas" class="stage-canvas" role="region" aria-label="Arena de teste cognitivo"></div>
        <div id="gameControlsFooter" class="game-controls-footer">
          <button id="btnMobileActionTrigger" class="action-trigger-btn" aria-label="Responder">
            ⚡ APERTAR (Espaço)
          </button>
        </div>
      </div>
    `;

    const actionBtn = document.getElementById('btnMobileActionTrigger');
    if (actionBtn) {
      actionBtn.addEventListener('pointerdown', (e) => {
        const stage = document.getElementById('stageCanvas');
        if (stage) {
          const fakeEvent = new CustomEvent('pointerdown', { bubbles: true, cancelable: true });
          fakeEvent.timeStamp = e.timeStamp || performance.now();
          stage.dispatchEvent(fakeEvent);
        }
      });
    }
  }

  showIntermission(title, message, onProceed) {
    this.currentScreen = 'intermission';
    this.activeGameInstance = null;
    this.screenContainer.innerHTML = `
      <div class="card" style="max-width: 580px; text-align: center; padding: 2.5rem 2rem;">
        <div style="font-size: 3rem; margin-bottom: 0.75rem;">⭐</div>
        <h2>${title}</h2>
        <p style="font-size: 1.1rem; margin-bottom: 1.75rem;">${message}</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.75rem;">
          Faça uma pausa rápida de alguns segundos caso sinta cansaço visual ou postural.
        </p>
        <button id="btnProceedIntermission" class="btn btn-primary btn-block" style="height: 54px; font-size: 1.1rem;">
          Avançar para o Próximo Desafio ▶
        </button>
      </div>
    `;

    document.getElementById('btnProceedIntermission')?.addEventListener('click', () => {
      if (onProceed) onProceed();
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new AppCoordinator();
});
