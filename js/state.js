/**
 * Gerenciador de Estado da Sessão, Persistência e Temas
 * Armazena dados de ensaio a ensaio dos 6 jogos e gera exportações em JSON e CSV.
/**
 * Mitiga Injeção de Fórmulas CSV (DDE) sanitizando o início de cada célula
 * e escapando aspas e delimitadores.
 */
export function sanitizeCSVCell(val) {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  // Se começar com caracteres que disparam fórmulas no Excel/Calc (=, +, -, @, \t, \r), adiciona aspas simples
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export class SessionState {
  constructor() {
    let savedTheme = (typeof localStorage !== 'undefined' && localStorage.getItem('tdah_theme')) || 'animals';
    // Mapear tema legado caso exista
    if (savedTheme === 'playful') savedTheme = 'animals';
    this.currentTheme = savedTheme;
    this.reset();
  }

  reset() {
    this.session = {
      id: 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      mode: 'full', // 'full' (~8-10 min) ou 'quick' (~3-4 min)
      theme: this.currentTheme,
      participant: {
        ageGroup: 'child', // Padrão infantil
        device: this.detectDeviceInfo()
      },
      results: {
        gonogo: null,
        cpt: null,
        selective: null,
        memory: null,
        switching: null,
        timeest: null
      },
      rawTrials: {
        gonogo: [],
        cpt: [],
        selective: [],
        memory: [],
        switching: [],
        timeest: []
      },
      durationSeconds: 0
    };
    this.startTime = 0;
  }

  detectDeviceInfo() {
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0));
    return {
      type: isTouch ? 'mobile/touch' : 'desktop/mouse',
      screen: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080',
      pixelRatio: typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'AutomatedTest/Node'
    };
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.session.theme = theme;
    if (typeof localStorage !== 'undefined') localStorage.setItem('tdah_theme', theme);
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme);
  }

  getTheme() {
    return this.currentTheme;
  }

  setMode(mode) {
    this.session.mode = mode === 'quick' ? 'quick' : 'full';
  }

  setAgeGroup(ageGroup) {
    this.session.participant.ageGroup = ageGroup;
    if (ageGroup !== 'child' && (this.currentTheme === 'animals' || this.currentTheme === 'dinosaurs' || this.currentTheme === 'space_kids')) {
      this.setTheme('cosmic');
    }
  }

  startSessionTimer() {
    this.startTime = Date.now();
  }

  finalizeSession() {
    if (this.startTime > 0) {
      this.session.durationSeconds = Math.round((Date.now() - this.startTime) / 1000);
    }
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    try {
      const historyJson = localStorage.getItem('tdah_sessions_history');
      const history = historyJson ? JSON.parse(historyJson) : [];
      history.unshift(this.session);
      if (history.length > 20) history.pop();
      localStorage.setItem('tdah_sessions_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Não foi possível salvar no LocalStorage:', e);
    }
  }

  exportJSON() {
    const jsonStr = JSON.stringify(this.session, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `triagem_tdah_6fases_${this.session.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  exportCSV() {
    const headers = [
      'session_id', 'timestamp', 'theme', 'age_group', 'device_type', 
      'game', 'trial_index', 'detail_info', 'responded', 'correct', 'reaction_or_produced_time'
    ];

    const rows = [];

    // 1. Go/No-Go
    this.session.rawTrials.gonogo.forEach((t, idx) => {
      rows.push([
        this.session.id, this.session.timestamp, this.session.theme, this.session.participant.ageGroup,
        this.session.participant.device.type, '1_GoNoGo', idx + 1, t.type, t.responded,
        t.type === 'go' ? t.responded : !t.responded, t.rt || ''
      ]);
    });

    // 2. CPT
    this.session.rawTrials.cpt.forEach((t, idx) => {
      rows.push([
        this.session.id, this.session.timestamp, this.session.theme, this.session.participant.ageGroup,
        this.session.participant.device.type, '2_CPT', idx + 1, t.isTarget ? 'target' : 'nontarget',
        t.responded, t.isTarget ? t.responded : !t.responded, t.rt || ''
      ]);
    });

    // 3. Selective Attention
    this.session.rawTrials.selective.forEach((t, idx) => {
      rows.push([
        this.session.id, this.session.timestamp, this.session.theme, this.session.participant.ageGroup,
        this.session.participant.device.type, '3_SelectiveAttention', idx + 1, t.condition,
        t.responded, t.correct, t.rt || ''
      ]);
    });

    // 4. Spatial Memory
    this.session.rawTrials.memory.forEach((t, idx) => {
      rows.push([
        this.session.id, this.session.timestamp, this.session.theme, this.session.participant.ageGroup,
        this.session.participant.device.type, '4_SpatialMemory', idx + 1, `span_${t.span}`,
        true, t.correct, t.meanTapRT || ''
      ]);
    });

    // 5. Task Switching
    this.session.rawTrials.switching.forEach((t, idx) => {
      rows.push([
        this.session.id, this.session.timestamp, this.session.theme, this.session.participant.ageGroup,
        this.session.participant.device.type, '5_TaskSwitching', idx + 1, `${t.rule}_switch=${t.isSwitch}`,
        t.responded, t.correct, t.rt || ''
      ]);
    });

    // 6. Time Estimation
    this.session.rawTrials.timeest.forEach((t, idx) => {
      rows.push([
        this.session.id, this.session.timestamp, this.session.theme, this.session.participant.ageGroup,
        this.session.participant.device.type, '6_TimeEstimation', idx + 1, `target_${t.targetMs}ms_diff=${t.diffMs}ms`,
        true, t.errorPct <= 20, t.producedMs || ''
      ]);
    });

    const csvContent = [
      headers.map(sanitizeCSVCell).join(','),
      ...rows.map(row => row.map(sanitizeCSVCell).join(','))
    ].join('\r\n');

    // Adiciona BOM UTF-8 (\uFEFF) para garantir caracteres e acentos perfeitos no Microsoft Excel
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `triagem_tdah_6fases_${this.session.id}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export const sessionState = new SessionState();
