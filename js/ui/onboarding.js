/**
 * Componente de Onboarding, Consentimento e Configuração Inicial
 * Filtra estritamente os temas por faixa etária:
 * - Crianças (6 a 12 anos): Acesso aos temas infantis (Animais, Dinos, Espaço Kids).
 * - Adolescentes e Adultos: Acesso exclusivo aos temas sóbrios (Cósmico e Clínico).
 */

import { sessionState } from '../state.js';
import { getThemesForAgeGroup } from '../themes.js';

export class OnboardingUI {
  constructor(containerEl, onStart) {
    this.container = containerEl;
    this.onStart = onStart;
  }

  render() {
    // Definir padrão inicial com base na idade atual da sessão (padrão 'adult' ou o selecionado)
    const currentAge = sessionState.session.participant.ageGroup || 'adult';

    this.container.innerHTML = `
      <div class="card" style="max-width: 700px;">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;" id="onboardingEmojiHeader">🧠⚡</div>
          <h1>Triagem Cognitiva & Atenção</h1>
          <p class="lead-text">Bateria neuropsicológica interativa com 6 fases para avaliação de controle inibitório, foco sustentado, memória espacial e percepção temporal.</p>
        </div>

        <div class="disclaimer-box" role="alert">
          <div class="disclaimer-icon">⚠️</div>
          <div class="disclaimer-text">
            <strong>Aviso Ético e Científico:</strong> Esta aplicação destina-se à triagem e autoavaliação inicial de traços executivos e atencionais. 
            <strong>Não substitui avaliação clínica médica ou neuropsicológica</strong>. Em caso de dificuldades persistentes, procure um especialista habilitado.
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="selectAgeGroup">Faixa Etária do Participante:</label>
          <select id="selectAgeGroup" class="select-control">
            <option value="adult" ${currentAge === 'adult' ? 'selected' : ''}>Adulto (18 anos ou mais)</option>
            <option value="teen" ${currentAge === 'teen' ? 'selected' : ''}>Adolescente (13 a 17 anos)</option>
            <option value="child" ${currentAge === 'child' ? 'selected' : ''}>Criança (6 a 12 anos)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="selectSessionMode">Modo da Sessão:</label>
          <select id="selectSessionMode" class="select-control">
            <option value="full" selected>Sessão Completa 6 Fases (~8 a 10 min) — Mais detalhada</option>
            <option value="quick">Modo Rápido / Demonstração (~3 a 4 min) — Para testes ágeis</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="selectThemePicker" id="themePickerLabel">🎨 Personalização Visual & Tema:</label>
          <select id="selectThemePicker" class="select-control">
            <!-- Opções injetadas dinamicamente com base na idade -->
          </select>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.1rem; margin-bottom: 1.75rem; font-size: 0.9rem;">
          <strong style="color: var(--text-primary);">As 6 Fases que você realizará:</strong>
          <ol style="padding-left: 1.25rem; margin-top: 0.4rem; line-height: 1.6; color: var(--text-secondary);">
            <li><strong>Go/No-Go:</strong> Controle de impulsividade (freio motor).</li>
            <li><strong>CPT Contínuo:</strong> Vigilância e foco contínuo ao longo do tempo.</li>
            <li><strong>Atenção Seletiva:</strong> Foco no alvo contra distratores (Flanker).</li>
            <li><strong>Memória Espacial:</strong> Sequências de memória visuoespacial (Corsi).</li>
            <li><strong>Flexibilidade Cognitiva:</strong> Troca dinâmica de regras (Cor vs Forma).</li>
            <li><strong>Percepção Temporal:</strong> Reprodução de intervalos de tempo.</li>
          </ol>
        </div>

        <button id="btnStartScreening" class="btn btn-primary btn-block" style="font-size: 1.15rem; height: 56px;">
          Concordar e Iniciar Triagem ▶
        </button>
      </div>
    `;

    // Inicializar opções de tema filtradas para a idade inicial
    this.updateThemeOptionsByAge(currentAge);

    // Ouvinte de mudança de idade: filtra os temas estritamente
    const ageSelect = document.getElementById('selectAgeGroup');
    ageSelect?.addEventListener('change', (e) => {
      const newAge = e.target.value;
      sessionState.setAgeGroup(newAge);
      this.updateThemeOptionsByAge(newAge);
    });

    // Ouvinte de mudança de tema manual
    document.getElementById('selectThemePicker')?.addEventListener('change', (e) => {
      const selected = e.target.value;
      sessionState.setTheme(selected);
      this.syncHeaderSelector(selected);
    });

    // Iniciar
    document.getElementById('btnStartScreening')?.addEventListener('click', () => {
      const ageGroup = document.getElementById('selectAgeGroup').value;
      const mode = document.getElementById('selectSessionMode').value;
      const theme = document.getElementById('selectThemePicker').value;
      if (this.onStart) {
        this.onStart({ ageGroup, mode, theme });
      }
    });
  }

  /**
   * Atualiza as opções de tema na tela e no cabeçalho estritamente com base na idade.
   */
  updateThemeOptionsByAge(ageGroup) {
    const themeSelect = document.getElementById('selectThemePicker');
    const headerThemeSelect = document.getElementById('headerThemeSelector');
    const emojiHeader = document.getElementById('onboardingEmojiHeader');
    const allowedThemes = getThemesForAgeGroup(ageGroup);

    if (emojiHeader) {
      emojiHeader.textContent = ageGroup === 'child' ? '🦁🦖🛸' : '🧠⚡📋';
    }

    // Se o tema atual não é permitido para esta idade, alterar para o tema padrão correspondente
    let currentTheme = sessionState.getTheme();
    const isThemeAllowed = allowedThemes.some(t => t.id === currentTheme);

    if (!isThemeAllowed) {
      currentTheme = ageGroup === 'child' ? 'animals' : 'cosmic';
      sessionState.setTheme(currentTheme);
    }

    // 1. Atualizar o select da tela de Onboarding
    if (themeSelect) {
      themeSelect.innerHTML = allowedThemes.map(t => `
        <option value="${t.id}" ${t.id === currentTheme ? 'selected' : ''}>
          ${t.name}
        </option>
      `).join('');
    }

    // 2. Atualizar o select do cabeçalho
    if (headerThemeSelect) {
      headerThemeSelect.innerHTML = allowedThemes.map(t => `
        <option value="${t.id}" ${t.id === currentTheme ? 'selected' : ''}>
          ${t.name.split(' (')[0]}
        </option>
      `).join('');
    }

    // Atualizar atributo no HTML
    document.documentElement.setAttribute('data-theme', currentTheme);
  }

  syncHeaderSelector(themeId) {
    const headerThemeSelect = document.getElementById('headerThemeSelector');
    if (headerThemeSelect) {
      headerThemeSelect.value = themeId;
    }
  }
}
