/**
 * Motor de Cálculo Estatístico e Psicométrico
 * Implementa métricas clássicas de neuropsicologia computacional e Teoria de Detecção de Sinal (SDT).
 */

export class CognitiveMetrics {
  /**
   * Média aritmética
   */
  static mean(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return Math.round(sum / numbers.length);
  }

  /**
   * Desvio padrão do tempo de reação (RTV / SD_RT)
   * Principal métrica psicométrica de instabilidade atencional no TDAH.
   */
  static standardDeviation(numbers) {
    if (!numbers || numbers.length < 2) return 0;
    const avg = this.mean(numbers);
    const squareDiffs = numbers.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / (numbers.length - 1);
    return Math.round(Math.sqrt(avgSquareDiff));
  }

  /**
   * Coeficiente de Variação (CV = SD / Mean * 100)
   * Mede a variabilidade percentual normalizada pela velocidade individual.
   */
  static coefficientOfVariation(mean, sd) {
    if (!mean || mean === 0) return 0;
    return Number(((sd / mean) * 100).toFixed(1));
  }

  /**
   * Aproximação racional da função probit (inversa da normal cumulativa Z)
   * Baseado no algoritmo clássico de Abramowitz & Stegun.
   */
  static normInv(p) {
    const a1 = -39.69683028665376;
    const a2 = 220.9460984245205;
    const a3 = -275.9285104469687;
    const a4 = 138.357751867269;
    const a5 = -30.66479806614716;
    const a6 = 2.506628277459239;

    const b1 = -54.47609879822406;
    const b2 = 161.5858368580409;
    const b3 = -155.6989798598866;
    const b4 = 66.80131188771972;
    const b5 = -13.28068155288572;

    const c1 = -0.007784894002430293;
    const c2 = -0.3223964580411365;
    const c3 = -2.400758277161838;
    const c4 = -2.549732539343734;
    const c5 = 4.374664141464968;
    const c6 = 2.938163982698783;

    const d1 = 0.007784695709041462;
    const d2 = 0.3224671290700398;
    const d3 = 2.445134137142996;
    const d4 = 3.754408661907416;

    const p_low = 0.02425;
    const p_high = 1 - p_low;
    let q, r;

    if (p < p_low) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
             ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    if (p <= p_high) {
      q = p - 0.5;
      r = q * q;
      return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
             (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
            ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }

  /**
   * Cálculo de Teoria de Detecção de Sinal (Signal Detection Theory - SDT)
   * Calcula d-prime (d') e Critério (c) com correção de Hautus (1995) para proporções extremas.
   */
  static calculateSDT(hits, totalTargets, commissions, totalNonTargets) {
    if (totalTargets === 0 || totalNonTargets === 0) {
      return { dPrime: 0, criterion: 0 };
    }

    const hitRate = (hits + 0.5) / (totalTargets + 1);
    const faRate = (commissions + 0.5) / (totalNonTargets + 1);

    const zHit = this.normInv(hitRate);
    const zFA = this.normInv(faRate);

    const dPrime = Number((zHit - zFA).toFixed(2));
    const criterion = Number((-0.5 * (zHit + zFA)).toFixed(2));

    return { dPrime, criterion };
  }

  /**
   * Análise do Mini-jogo 1: Go/No-Go
   */
  static analyzeGoNoGo(trials) {
    const goTrials = trials.filter(t => t.type === 'go');
    const noGoTrials = trials.filter(t => t.type === 'nogo');

    const hits = goTrials.filter(t => t.responded && !t.anticipatory);
    const omissions = goTrials.filter(t => !t.responded);
    const commissions = noGoTrials.filter(t => t.responded);
    const correctNoGos = noGoTrials.filter(t => !t.responded);
    const anticipations = trials.filter(t => t.anticipatory);

    const validRTs = hits.map(t => t.rt);
    const meanRT = this.mean(validRTs);
    const sdRT = this.standardDeviation(validRTs);
    const cv = this.coefficientOfVariation(meanRT, sdRT);

    const { dPrime, criterion } = this.calculateSDT(
      hits.length,
      goTrials.length,
      commissions.length,
      noGoTrials.length
    );

    const commissionRate = noGoTrials.length > 0
      ? Number(((commissions.length / noGoTrials.length) * 100).toFixed(1))
      : 0;

    const omissionRate = goTrials.length > 0
      ? Number(((omissions.length / goTrials.length) * 100).toFixed(1))
      : 0;

    let inhibitionScore = 100 - (commissionRate * 1.5) - (anticipations.length * 5);
    inhibitionScore = Math.max(10, Math.min(100, Math.round(inhibitionScore)));

    return {
      totalTrials: trials.length,
      goTrials: goTrials.length,
      noGoTrials: noGoTrials.length,
      hits: hits.length,
      omissions: omissions.length,
      commissions: commissions.length,
      correctNoGos: correctNoGos.length,
      anticipations: anticipations.length,
      meanRT,
      sdRT,
      cv,
      commissionRate,
      omissionRate,
      dPrime,
      criterion,
      inhibitionScore
    };
  }

  /**
   * Análise do Mini-jogo 2: CPT (Atenção Sustentada e Vigilância)
   */
  static analyzeCPT(trials) {
    const targetTrials = trials.filter(t => t.isTarget);
    const nonTargetTrials = trials.filter(t => !t.isTarget);

    const hits = targetTrials.filter(t => t.responded && !t.anticipatory);
    const omissions = targetTrials.filter(t => !t.responded);
    const commissions = nonTargetTrials.filter(t => t.responded);
    const anticipations = trials.filter(t => t.anticipatory);

    const validRTs = hits.map(t => t.rt);
    const meanRT = this.mean(validRTs);
    const sdRT = this.standardDeviation(validRTs);
    const cv = this.coefficientOfVariation(meanRT, sdRT);

    const { dPrime, criterion } = this.calculateSDT(
      hits.length,
      targetTrials.length,
      commissions.length,
      nonTargetTrials.length
    );

    const quarter = Math.max(1, Math.floor(trials.length / 4));
    const q1Trials = trials.slice(0, quarter);
    const q4Trials = trials.slice(quarter * 3);

    const q1Hits = q1Trials.filter(t => t.isTarget && t.responded && !t.anticipatory);
    const q1Targets = q1Trials.filter(t => t.isTarget).length || 1;
    const q1Accuracy = (q1Hits.length / q1Targets) * 100;

    const q4Hits = q4Trials.filter(t => t.isTarget && t.responded && !t.anticipatory);
    const q4Targets = q4Trials.filter(t => t.isTarget).length || 1;
    const q4Accuracy = (q4Hits.length / q4Targets) * 100;

    const vigilanceDecrement = Number((q1Accuracy - q4Accuracy).toFixed(1));

    const omissionRate = targetTrials.length > 0
      ? Number(((omissions.length / targetTrials.length) * 100).toFixed(1))
      : 0;

    let sustainedScore = 100 - (omissionRate * 1.5) - (Math.max(0, vigilanceDecrement) * 1.2);
    sustainedScore = Math.max(10, Math.min(100, Math.round(sustainedScore)));

    return {
      totalTrials: trials.length,
      targetTrials: targetTrials.length,
      nonTargetTrials: nonTargetTrials.length,
      hits: hits.length,
      omissions: omissions.length,
      commissions: commissions.length,
      anticipations: anticipations.length,
      meanRT,
      sdRT,
      cv,
      omissionRate,
      dPrime,
      criterion,
      vigilanceDecrement,
      sustainedScore
    };
  }

  /**
   * Análise do Mini-jogo 3: Atenção Seletiva (Flanker)
   */
  static analyzeSelective(trials) {
    const hits = trials.filter(t => t.correct && !t.anticipatory);
    const errors = trials.filter(t => !t.correct && t.responded);
    const omissions = trials.filter(t => !t.responded);

    const congruentTrials = hits.filter(t => t.condition === 'congruent');
    const incongruentTrials = hits.filter(t => t.condition === 'incongruent');

    const rtCongruent = this.mean(congruentTrials.map(t => t.rt));
    const rtIncongruent = this.mean(incongruentTrials.map(t => t.rt));
    
    const interferenceCost = Math.max(0, rtIncongruent - rtCongruent);

    const validRTs = hits.map(t => t.rt);
    const meanRT = this.mean(validRTs);
    const sdRT = this.standardDeviation(validRTs);

    const accuracyRate = trials.length > 0
      ? Number(((hits.length / trials.length) * 100).toFixed(1))
      : 0;

    let selectiveScore = accuracyRate - (interferenceCost > 150 ? 15 : interferenceCost > 80 ? 8 : 0);
    selectiveScore = Math.max(10, Math.min(100, Math.round(selectiveScore)));

    return {
      totalTrials: trials.length,
      hits: hits.length,
      errors: errors.length,
      omissions: omissions.length,
      accuracyRate,
      meanRT,
      sdRT,
      rtCongruent,
      rtIncongruent,
      interferenceCost,
      selectiveScore
    };
  }

  /**
   * Análise do Mini-jogo 4: Memória de Trabalho Espacial (Corsi)
   */
  static analyzeSpatialMemory(trials) {
    const correctTrials = trials.filter(t => t.correct);
    const accuracyRate = trials.length > 0 ? Number(((correctTrials.length / trials.length) * 100).toFixed(1)) : 0;

    // Span máximo alcançado com sucesso
    let maxSpan = 0;
    correctTrials.forEach(t => {
      if (t.span > maxSpan) maxSpan = t.span;
    });

    const meanTapRT = this.mean(trials.map(t => t.meanTapRT || 0).filter(rt => rt > 0));

    // Escore de Memória (0 a 100)
    let memoryScore = Math.round((accuracyRate * 0.7) + (Math.min(5, maxSpan) * 6));
    memoryScore = Math.max(10, Math.min(100, memoryScore));

    return {
      totalTrials: trials.length,
      correctTrials: correctTrials.length,
      accuracyRate,
      maxSpan,
      meanTapRT,
      memoryScore
    };
  }

  /**
   * Análise do Mini-jogo 5: Flexibilidade Cognitiva (Task Switching)
   */
  static analyzeTaskSwitching(trials) {
    const correctTrials = trials.filter(t => t.correct && t.responded);
    const switchTrials = correctTrials.filter(t => t.isSwitch);
    const nonSwitchTrials = correctTrials.filter(t => !t.isSwitch);

    const rtSwitch = this.mean(switchTrials.map(t => t.rt));
    const rtNonSwitch = this.mean(nonSwitchTrials.map(t => t.rt));

    // Custo de alternância temporal (Switch Cost)
    const switchCost = Math.max(0, rtSwitch - rtNonSwitch);

    const accuracyRate = trials.length > 0 ? Number(((correctTrials.length / trials.length) * 100).toFixed(1)) : 0;
    const perseverativeErrors = trials.filter(t => t.isSwitch && !t.correct && t.responded).length;

    let flexibilityScore = accuracyRate - (perseverativeErrors * 8) - (switchCost > 200 ? 12 : switchCost > 100 ? 6 : 0);
    flexibilityScore = Math.max(10, Math.min(100, Math.round(flexibilityScore)));

    return {
      totalTrials: trials.length,
      accuracyRate,
      rtSwitch,
      rtNonSwitch,
      switchCost,
      perseverativeErrors,
      flexibilityScore
    };
  }

  /**
   * Análise do Mini-jogo 6: Percepção e Reprodução Temporal
   */
  static analyzeTimeEstimation(trials) {
    if (!trials || trials.length === 0) {
      return { meanErrorPct: 0, temporalBias: 'Neutro', timingScore: 75 };
    }

    const errorsPct = trials.map(t => t.errorPct);
    const meanErrorPct = Number((errorsPct.reduce((a, b) => a + b, 0) / errorsPct.length).toFixed(1));

    const totalDiff = trials.map(t => t.diffMs).reduce((a, b) => a + b, 0);
    const temporalBias = totalDiff > 400 ? 'Superestimação (Respostas alongadas)' : totalDiff < -400 ? 'Subestimação (Impaciência/Precipitação)' : 'Calibrado';

    let timingScore = Math.round(100 - (meanErrorPct * 1.4));
    timingScore = Math.max(10, Math.min(100, timingScore));

    return {
      totalTrials: trials.length,
      meanErrorPct,
      temporalBias,
      timingScore
    };
  }
}
