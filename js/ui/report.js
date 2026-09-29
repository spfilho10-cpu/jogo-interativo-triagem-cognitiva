import { getThemeConfig } from '../themes.js';

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class ReportUI {
  constructor(containerEl, sessionState, onRestart) {
    this.container = containerEl;
    this.state = sessionState;
    this.onRestart = onRestart;
  }

  render() {
    const { results, participant, durationSeconds, mode, theme } = this.state.session;
    const gonogo = results.gonogo || {};
    const cpt = results.cpt || {};
    const selective = results.selective || {};
    const memory = results.memory || {};
    const switching = results.switching || {};
    const timeest = results.timeest || {};

    const meanRTV = Math.round(((gonogo.sdRT || 60) + (cpt.sdRT || 70)) / 2);
    let stabilityScore = Math.max(15, Math.min(100, Math.round(100 - (meanRTV - 30) * 0.7)));

    const scores = {
      inhibition: gonogo.inhibitionScore || 75,
      sustained: cpt.sustainedScore || 75,
      stability: stabilityScore,
      selective: selective.selectiveScore || 75,
      memory: memory.memoryScore || 75,
      flexibility: switching.flexibilityScore || 75
    };

    const themeCfg = getThemeConfig(theme);
    const themeName = themeCfg ? themeCfg.name : (theme || 'Padrão');
    const ageLabel = participant.ageGroup === 'adult' ? 'Adulto' : participant.ageGroup === 'teen' ? 'Adolescente' : 'Criança';
    const modeLabel = mode === 'quick' ? 'Demonstração (~3 min)' : 'Sessão Completa (~8–10 min)';

    this.container.innerHTML = `
      <div class="report-container">
        <div class="report-header">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-info); text-transform: uppercase;">
                Bateria Neurocognitiva Completa (6 Fases)
              </span>
              <h1 style="font-size: 1.85rem; margin: 0.25rem 0;">Painel de Perfil Atencional & Executivo</h1>
              <p style="margin-bottom: 0; font-size: 0.9rem;">
                Modo: <strong>${escapeHTML(modeLabel)}</strong> • 
                Tema: <strong>${escapeHTML(themeName)}</strong> • 
                Faixa: <strong>${escapeHTML(ageLabel)}</strong> • 
                Duração: <strong>${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s</strong>
              </p>
            </div>
            <div class="report-actions">
              <button id="btnExportJSON" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                📥 JSON Completo
              </button>
              <button id="btnExportCSV" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                📊 Planilha CSV
              </button>
              <button id="btnPrintReport" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                🖨️ Imprimir / PDF
              </button>
            </div>
          </div>
        </div>

        <div class="disclaimer-box" role="alert" style="margin-bottom: 2rem;">
          <div class="disclaimer-icon">ℹ️</div>
          <div class="disclaimer-text">
            <strong>Orientações Éticas e Limitações:</strong> Os dados abaixo mapeiam funções executivas e tempos de reação computacionais. 
            Este relatório tem caráter de triagem inicial e não substitui consulta especializada com neuropsicólogo, psicólogo ou médico.
          </div>
        </div>

        <!-- Gráfico de Radar de 6 Eixos em Canvas -->
        <div style="text-align: center; margin-bottom: 2.25rem;">
          <h3 style="margin-bottom: 0.5rem;">Mapeamento dos 6 Domínios Executivos</h3>
          <p style="font-size: 0.85rem; margin-bottom: 1rem;">Visualização global da congruência e estabilidade entre as tarefas cognitivas.</p>
          <div class="chart-wrapper">
            <canvas id="reportRadarCanvas" width="420" height="420" role="img" aria-label="Gráfico de radar de 6 eixos cognitivos"></canvas>
          </div>
        </div>

        <!-- Grade com os 6 Cartões de Domínio -->
        <div class="domain-cards-grid-6">
          <!-- 1. Controle Inibitório -->
          <div class="domain-card">
            <div class="domain-card-header">
              <span style="font-weight: 700; font-size: 0.95rem;">1. Controle Inibitório</span>
              ${this.getStatusBadge(scores.inhibition)}
            </div>
            <div class="domain-score">${scores.inhibition}<span style="font-size: 1rem; color: var(--text-muted); font-weight: 400;">/100</span></div>
            <div style="font-size: 0.85rem; margin-top: 0.5rem;">
              • Erros de Comissão (No-Go): <strong>${gonogo.commissionRate || 0}%</strong><br>
              • Respostas Prematuras: <strong>${gonogo.anticipations || 0}</strong><br>
              • d' (Sensibilidade): <strong>${gonogo.dPrime || 0}</strong>
            </div>
          </div>

          <!-- 2. Atenção Sustentada -->
          <div class="domain-card">
            <div class="domain-card-header">
              <span style="font-weight: 700; font-size: 0.95rem;">2. Atenção Sustentada</span>
              ${this.getStatusBadge(scores.sustained)}
            </div>
            <div class="domain-score">${scores.sustained}<span style="font-size: 1rem; color: var(--text-muted); font-weight: 400;">/100</span></div>
            <div style="font-size: 0.85rem; margin-top: 0.5rem;">
              • Taxa de Omissão (Lapsos): <strong>${cpt.omissionRate || 0}%</strong><br>
              • Declínio de Vigilância: <strong>${cpt.vigilanceDecrement > 0 ? '+' + cpt.vigilanceDecrement + '%' : (cpt.vigilanceDecrement || 0) + '%'}</strong><br>
              • RT Médio no Alvo: <strong>${cpt.meanRT || 0}ms</strong>
            </div>
          </div>

          <!-- 3. Estabilidade do RT (RTV) -->
          <div class="domain-card">
            <div class="domain-card-header">
              <span style="font-weight: 700; font-size: 0.95rem;">3. Estabilidade (RTV)</span>
              ${this.getStatusBadge(scores.stability)}
            </div>
            <div class="domain-score">${scores.stability}<span style="font-size: 1rem; color: var(--text-muted); font-weight: 400;">/100</span></div>
            <div style="font-size: 0.85rem; margin-top: 0.5rem;">
              • Desvio Padrão do RT: <strong>${meanRTV}ms</strong><br>
              • Coef. Variação (CV): <strong>${gonogo.cv || 0}%</strong><br>
              • Homogeneidade: <strong>${meanRTV < 70 ? 'Excelente' : meanRTV < 110 ? 'Intermediária' : 'Oscilante'}</strong>
            </div>
          </div>

          <!-- 4. Atenção Seletiva -->
          <div class="domain-card">
            <div class="domain-card-header">
              <span style="font-weight: 700; font-size: 0.95rem;">4. Atenção Seletiva</span>
              ${this.getStatusBadge(scores.selective)}
            </div>
            <div class="domain-score">${scores.selective}<span style="font-size: 1rem; color: var(--text-muted); font-weight: 400;">/100</span></div>
            <div style="font-size: 0.85rem; margin-top: 0.5rem;">
              • Acurácia sob Distração: <strong>${selective.accuracyRate || 0}%</strong><br>
              • Custo de Interferência: <strong>+${selective.interferenceCost || 0}ms</strong><br>
              • Erros por Distratores: <strong>${selective.errors || 0}</strong>
            </div>
          </div>

          <!-- 5. Memória de Trabalho Espacial -->
          <div class="domain-card">
            <div class="domain-card-header">
              <span style="font-weight: 700; font-size: 0.95rem;">5. Memória de Trabalho</span>
              ${this.getStatusBadge(scores.memory)}
            </div>
            <div class="domain-score">${scores.memory}<span style="font-size: 1rem; color: var(--text-muted); font-weight: 400;">/100</span></div>
            <div style="font-size: 0.85rem; margin-top: 0.5rem;">
              • Span Espacial Máximo: <strong>${memory.maxSpan || 0} passos</strong><br>
              • Acurácia de Sequência: <strong>${memory.accuracyRate || 0}%</strong><br>
              • Latência de Resgate: <strong>${memory.meanTapRT || 0}ms/bloco</strong>
            </div>
          </div>

          <!-- 6. Flexibilidade & Tempo -->
          <div class="domain-card">
            <div class="domain-card-header">
              <span style="font-weight: 700; font-size: 0.95rem;">6. Flexibilidade & Tempo</span>
              ${this.getStatusBadge(scores.flexibility)}
            </div>
            <div class="domain-score">${scores.flexibility}<span style="font-size: 1rem; color: var(--text-muted); font-weight: 400;">/100</span></div>
            <div style="font-size: 0.85rem; margin-top: 0.5rem;">
              • Custo de Troca de Regra: <strong>+${switching.switchCost || 0}ms</strong><br>
              • Erros Perseverativos: <strong>${switching.perseverativeErrors || 0}</strong><br>
              • Calibração Temporal: <strong>${timeest.temporalBias || 'Calibrado'}</strong> (Erro: ${timeest.meanErrorPct || 0}%)
            </div>
          </div>
        </div>

        <!-- Síntese Narrativa -->
        <div class="recommendations-box">
          <h3 style="margin-bottom: 0.75rem;">📋 Síntese do Perfil Neurocognitivo</h3>
          <ul style="margin-bottom: 1.25rem; line-height: 1.7;">
            ${this.generateNarrativeInsights(scores, gonogo, cpt, selective, memory, switching, timeest, meanRTV)}
          </ul>
          <h3 style="margin-bottom: 0.5rem;">🩺 Recomendações e Próximos Passos</h3>
          <ul style="margin-bottom: 0; line-height: 1.6;">
            <li>Caso os resultados apontem variabilidade alta em domínios correlatos (especialmente Inibição, Estabilidade RTV e Memória de Trabalho), considere levar este relatório exportado para um profissional especializado para uma investigação diagnóstica integrada.</li>
            <li>A exportação em formato CSV contém os milissegundos exatos de cada ensaio realizado e pode ser anexada em prontuários clínicos.</li>
          </ul>
        </div>

        <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 2rem;">
          <button id="btnRestartSession" class="btn btn-primary" style="min-width: 240px;">
            🔄 Realizar Nova Sessão
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.drawRadarChart(scores);
    }, 60);

    window.addEventListener('beforeprint', () => {
      this.drawRadarChart(scores, true);
    });
    window.addEventListener('afterprint', () => {
      this.drawRadarChart(scores, false);
    });

    document.getElementById('btnExportJSON')?.addEventListener('click', () => this.state.exportJSON());
    document.getElementById('btnExportCSV')?.addEventListener('click', () => this.state.exportCSV());
    document.getElementById('btnPrintReport')?.addEventListener('click', () => window.print());
    document.getElementById('btnRestartSession')?.addEventListener('click', () => {
      if (this.onRestart) this.onRestart();
    });
  }

  getStatusBadge(score) {
    if (score >= 75) {
      return `<span class="domain-status status-regular">Esperado</span>`;
    } else if (score >= 55) {
      return `<span class="domain-status status-attention">Atenção Leve</span>`;
    } else {
      return `<span class="domain-status status-high-variability">Variabilidade Alta</span>`;
    }
  }

  generateNarrativeInsights(scores, gonogo, cpt, selective, memory, switching, timeest, rtv) {
    const insights = [];

    // Inibição
    if ((gonogo.commissionRate || 0) > 25 || (gonogo.anticipations || 0) > 3) {
      insights.push(`<strong>Controle Inibitório:</strong> Respostas pré-potentes frequentes antes da frenagem (taxa de comissão de ${gonogo.commissionRate}%), apontando para impulsividade motora sob demanda de velocidade.`);
    } else {
      insights.push(`<strong>Controle Inibitório:</strong> Boa capacidade de retenção motora e precisão satisfatória diante dos estímulos de contenção.`);
    }

    // Atenção Sustentada
    if ((cpt.omissionRate || 0) > 15 || (cpt.vigilanceDecrement || 0) > 12) {
      insights.push(`<strong>Atenção Sustentada:</strong> Registrado decréscimo de vigilância ao longo do teste (${cpt.vigilanceDecrement}%), indicando fadiga atencional progressiva.`);
    } else {
      insights.push(`<strong>Atenção Sustentada:</strong> Manutenção homogênea do estado de alerta durante toda a tarefa contínua.`);
    }

    // RTV
    if (rtv > 100) {
      insights.push(`<strong>Estabilidade Atencional (RTV):</strong> Alta variabilidade temporal (${rtv}ms de desvio padrão), padrão caracterizado na literatura por lapsos momentâneos de foco.`);
    } else {
      insights.push(`<strong>Estabilidade Atencional (RTV):</strong> Tempos de resposta estáveis e velocidade motora consistente.`);
    }

    // Memória de Trabalho
    if ((memory.maxSpan || 0) < 4 || (memory.accuracyRate || 0) < 60) {
      insights.push(`<strong>Memória de Trabalho Espacial:</strong> Limitação no resgate sequencial imediato (Span máximo de ${memory.maxSpan || 0} passos), sugerindo sobrecarga rápida na alça visuoespacial.`);
    } else {
      insights.push(`<strong>Memória de Trabalho Espacial:</strong> Capacidade de retenção sequencial adequada (Span de ${memory.maxSpan || 0} passos preservado).`);
    }

    // Flexibilidade Cognitiva & Tempo
    if ((switching.switchCost || 0) > 150 || (switching.perseverativeErrors || 0) > 2) {
      insights.push(`<strong>Flexibilidade Cognitiva:</strong> Custo de alternância acentuado (+${switching.switchCost || 0}ms), demonstrando esforço adicional na inibição da regra anterior.`);
    } else {
      insights.push(`<strong>Flexibilidade Cognitiva:</strong> Boa velocidade de adaptação quando regras e critérios mudam inesperadamente.`);
    }

    if ((timeest.meanErrorPct || 0) > 30) {
      insights.push(`<strong>Percepção Temporal:</strong> Discrepância na estimativa e reprodução de intervalos (${timeest.meanErrorPct}% de erro médio), correlacionada ao fenômeno de distorção temporal.`);
    }

    return insights.map(item => `<li>${item}</li>`).join('');
  }

  drawRadarChart(scores, isPrint = false) {
    const canvas = document.getElementById('reportRadarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 135;

    ctx.clearRect(0, 0, width, height);

    if (isPrint) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    const labels = [
      'Inibição',
      'Sustentada',
      'Estabilidade (RTV)',
      'Seletiva',
      'Memória Espacial',
      'Flexibilidade'
    ];

    const values = [
      scores.inhibition,
      scores.sustained,
      scores.stability,
      scores.selective,
      scores.memory,
      scores.flexibility
    ];

    const numAxes = labels.length;
    const angleStep = (Math.PI * 2) / numAxes;

    // Teia de fundo poligonal (20% a 100%)
    const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
    ctx.strokeStyle = isPrint ? 'rgba(148, 163, 184, 0.55)' : 'rgba(100, 116, 139, 0.35)';
    ctx.lineWidth = 1;

    levels.forEach(level => {
      ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius * level);
        const y = centerY + Math.sin(angle) * (radius * level);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    });

    // Eixos radiais e rótulos
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = isPrint ? 'rgba(100, 116, 139, 0.65)' : 'rgba(100, 116, 139, 0.5)';
      ctx.stroke();

      const labelX = centerX + Math.cos(angle) * (radius + 28);
      const labelY = centerY + Math.sin(angle) * (radius + 16);

      ctx.font = isPrint ? 'bold 11px system-ui' : '600 11px system-ui';
      ctx.fillStyle = isPrint ? '#0f172a' : '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], labelX, labelY);
    }

    // Polígono de Desempenho
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const normalizedVal = Math.max(10, Math.min(100, values[i])) / 100;
      const x = centerX + Math.cos(angle) * (radius * normalizedVal);
      const y = centerY + Math.sin(angle) * (radius * normalizedVal);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.fillStyle = isPrint ? 'rgba(2, 132, 199, 0.22)' : 'rgba(56, 189, 248, 0.32)';
    ctx.fill();
    ctx.strokeStyle = isPrint ? '#0284c7' : '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Vértices
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const normalizedVal = Math.max(10, Math.min(100, values[i])) / 100;
      const x = centerX + Math.cos(angle) * (radius * normalizedVal);
      const y = centerY + Math.sin(angle) * (radius * normalizedVal);

      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}
