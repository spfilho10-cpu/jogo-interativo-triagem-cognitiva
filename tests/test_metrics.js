/**
 * Suite de Testes Automatizados — NeuroScreen TDAH
 * Valida o motor estatístico das 6 tarefas e as regras de filtragem de temas por idade.
 * 
 * Execução: node tests/test_metrics.js
 */

import { CognitiveMetrics } from '../js/metrics.js';
import { THEMES_CONFIG, getThemeConfig, getThemesForAgeGroup } from '../js/themes.js';
import { sanitizeCSVCell } from '../js/state.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    process.exit(1);
  }
  passedTests++;
  console.log(`✅ SUCESSO: ${message}`);
}

console.log('====================================================');
console.log('🧪 INICIANDO BATERIA DE TESTES — NEUROSCREEN TDAH');
console.log('====================================================\n');

// ----------------------------------------------------
// 1. TESTE: Go/No-Go
// ----------------------------------------------------
console.log('--- 1. Validando Paradigma Go/No-Go ---');
const gngSample = [
  { type: 'go', responded: true, rt: 320, anticipatory: false },
  { type: 'go', responded: true, rt: 340, anticipatory: false },
  { type: 'go', responded: true, rt: 310, anticipatory: false },
  { type: 'go', responded: false, rt: null, anticipatory: false }, // Omissão
  { type: 'nogo', responded: false, rt: null, anticipatory: false }, // Acerto NoGo
  { type: 'nogo', responded: true, rt: 290, anticipatory: false }   // Comissão
];
const gngResult = CognitiveMetrics.analyzeGoNoGo(gngSample);

assert(!isNaN(gngResult.meanRT) && gngResult.meanRT > 0, 'Tempo de Reação Médio calculado');
assert(gngResult.omissions === 1, 'Cálculo de omissões (desatenção)');
assert(gngResult.commissions === 1, 'Cálculo de comissões (impulsividade)');
assert(!isNaN(gngResult.dPrime), "Cálculo de Sensibilidade d' (Signal Detection)");
assert(gngResult.inhibitionScore >= 0 && gngResult.inhibitionScore <= 100, 'Score de Inibição dentro de 0-100');

// ----------------------------------------------------
// 2. TESTE: CPT (Continuous Performance Test)
// ----------------------------------------------------
console.log('\n--- 2. Validando Paradigma CPT ---');
const cptSample = [
  { isTarget: true, responded: true, rt: 350, anticipatory: false },
  { isTarget: false, responded: false, rt: null, anticipatory: false },
  { isTarget: true, responded: false, rt: null, anticipatory: false },
  { isTarget: false, responded: true, rt: 390, anticipatory: false }
];
const cptResult = CognitiveMetrics.analyzeCPT(cptSample);

assert(cptResult.targetTrials === 2, 'Contagem de alvos CPT');
assert(cptResult.hits === 1, 'Contagem de acertos em alvos');
assert(cptResult.omissions === 1, 'Contagem de omissões em alvos');
assert(cptResult.commissions === 1, 'Contagem de falsos alarmes em distratores');
assert(!isNaN(cptResult.vigilanceDecrement), 'Cálculo do declínio de vigilância');

// ----------------------------------------------------
// 3. TESTE: Atenção Seletiva (Flanker)
// ----------------------------------------------------
console.log('\n--- 3. Validando Paradigma Flanker ---');
const flankerSample = [
  { condition: 'congruent', correct: true, responded: true, rt: 340 },
  { condition: 'incongruent', correct: true, responded: true, rt: 440 }
];
const flankerResult = CognitiveMetrics.analyzeSelective(flankerSample);

assert(flankerResult.interferenceCost === 100, 'Custo de interferência (Incongruente - Congruente)');
assert(flankerResult.accuracyRate === 100, 'Acurácia de respostas sob distração');

// ----------------------------------------------------
// 4. TESTE: Memória de Trabalho Espacial (Corsi)
// ----------------------------------------------------
console.log('\n--- 4. Validando Paradigma Memória Espacial ---');
const memorySample = [
  { span: 3, correct: true, meanTapRT: 400 },
  { span: 4, correct: true, meanTapRT: 450 },
  { span: 5, correct: false, meanTapRT: 520 }
];
const memoryResult = CognitiveMetrics.analyzeSpatialMemory(memorySample);

assert(memoryResult.maxSpan === 4, 'Identificação do Span máximo alcançado com sucesso');
assert(memoryResult.correctTrials === 2, 'Contagem de sequências corretas');
assert(memoryResult.memoryScore >= 10 && memoryResult.memoryScore <= 100, 'Score de memória dentro dos limites');

// ----------------------------------------------------
// 5. TESTE: Flexibilidade Cognitiva (Task Switching)
// ----------------------------------------------------
console.log('\n--- 5. Validando Paradigma Task Switching ---');
const switchSample = [
  { rule: 'color', isSwitch: false, correct: true, responded: true, rt: 380 },
  { rule: 'shape', isSwitch: true, correct: true, responded: true, rt: 490 }
];
const switchResult = CognitiveMetrics.analyzeTaskSwitching(switchSample);

assert(switchResult.switchCost === 110, 'Custo de alternância (Switch Cost = 490 - 380)');
assert(switchResult.flexibilityScore >= 10 && switchResult.flexibilityScore <= 100, 'Score de flexibilidade');

// ----------------------------------------------------
// 6. TESTE: Percepção Temporal (Time Estimation)
// ----------------------------------------------------
console.log('\n--- 6. Validando Paradigma de Percepção Temporal ---');
const timingSample = [
  { targetMs: 2000, producedMs: 1900, diffMs: -100, errorPct: 5.0 },
  { targetMs: 3500, producedMs: 3600, diffMs: 100, errorPct: 2.8 }
];
const timingResult = CognitiveMetrics.analyzeTimeEstimation(timingSample);

assert(timingResult.meanErrorPct === 3.9, 'Cálculo de erro percentual médio de reprodução');
assert(timingResult.temporalBias === 'Calibrado', 'Classificação de viés direcional');

// ----------------------------------------------------
// 7. TESTE: Regras de Temas e Restrição por Idade
// ----------------------------------------------------
console.log('\n--- 7. Validando Regras de Restrição de Temas por Idade ---');
const adultThemes = getThemesForAgeGroup('adult').map(t => t.id);
const teenThemes = getThemesForAgeGroup('teen').map(t => t.id);
const childThemes = getThemesForAgeGroup('child').map(t => t.id);

assert(
  !adultThemes.includes('animals') && !adultThemes.includes('dinosaurs') && !adultThemes.includes('space_kids'),
  'Adulto NÃO tem acesso a nenhum tema infantil'
);
assert(
  !teenThemes.includes('animals') && !teenThemes.includes('dinosaurs') && !teenThemes.includes('space_kids'),
  'Adolescente NÃO tem acesso a nenhum tema infantil'
);
assert(
  childThemes.includes('animals') && childThemes.includes('dinosaurs') && childThemes.includes('space_kids'),
  'Criança TEM acesso exclusivo aos temas lúdicos infantis'
);

['animals', 'dinosaurs', 'space_kids', 'cosmic', 'clinical'].forEach(id => {
  const cfg = getThemeConfig(id);
  assert(cfg && cfg.gonogo && cfg.cpt, `Configurações completas presentes no tema ${id}`);
});

// ----------------------------------------------------
// 8. TESTE: Segurança de Exportação e Mitigação de CSV Injection (OWASP)
// ----------------------------------------------------
console.log('\n--- 8. Validando Sanitização e Mitigação de CSV Formula Injection ---');
assert(sanitizeCSVCell('=1+1') === "\"'=1+1\"", 'Injeção com sinal de igual (=) neutralizada com apóstrofo');
assert(sanitizeCSVCell('+cmd|/c calc!A0') === "\"'+cmd|/c calc!A0\"", 'Injeção com sinal de mais (+) neutralizada');
assert(sanitizeCSVCell('-2+3') === "\"'-2+3\"", 'Injeção com sinal de menos (-) neutralizada');
assert(sanitizeCSVCell('@SUM(A1:A10)') === "\"'@SUM(A1:A10)\"", 'Injeção com arroba (@) neutralizada');
assert(sanitizeCSVCell('Texto normal com, vírgula') === '"Texto normal com, vírgula"', 'Texto com vírgula escapado entre aspas');
assert(sanitizeCSVCell('Texto com "aspas"') === '"Texto com ""aspas"""', 'Aspas duplas duplicadas conforme RFC 4180');

console.log('\n====================================================');
console.log(`🎉 TODOS OS ${passedTests}/${totalTests} TESTES FORAM APROVADOS COM SUCESSO!`);
console.log('====================================================');
