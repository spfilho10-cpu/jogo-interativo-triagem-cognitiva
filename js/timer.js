/**
 * Motor de Temporização e Medição de Latência de Alta Fidelidade
 * Utiliza performance.now() e event.timeStamp para precisão em nível de milissegundos.
 */

export class PreciseTimer {
  constructor() {
    this.stimulusTimestamp = 0;
    this.responseReceived = false;
  }

  /**
   * Marca o início da apresentação visual do estímulo.
   * Deve ser chamado dentro de requestAnimationFrame para sincronizar com a taxa de atualização do display.
   */
  markStimulusOn() {
    return new Promise((resolve) => {
      requestAnimationFrame((frameTime) => {
        // window.performance.now() alinhado com o vsync
        this.stimulusTimestamp = frameTime || performance.now();
        this.responseReceived = false;
        resolve(this.stimulusTimestamp);
      });
    });
  }

  /**
   * Calcula o tempo de reação a partir do carimbo do evento de hardware do navegador.
   * @param {Event} event Evento nativo de pointerdown/keydown
   * @returns {number} Tempo de reação em ms
   */
  calculateRT(event) {
    const eventTime = event && event.timeStamp ? event.timeStamp : performance.now();
    const rt = Math.round(eventTime - this.stimulusTimestamp);
    return rt;
  }

  /**
   * Gera um intervalo entre estímulos (ISI) aleatório com jitter uniforme.
   * Impede respostas rítmicas e previsibilidade motora.
   * @param {number} minMs Intervalo mínimo em ms
   * @param {number} maxMs Intervalo máximo em ms
   * @returns {number} Intervalo sorteado
   */
  static getRandomISI(minMs = 800, maxMs = 1500) {
    return Math.floor(minMs + Math.random() * (maxMs - minMs));
  }

  /**
   * Pausa precisa assíncrona baseada em Promise
   * @param {number} ms Duração em milissegundos
   */
  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Avalia se uma resposta é antecipatória (prematura).
   * Na literatura neuropsicológica, respostas abaixo de 100-150ms ocorrem antes da
   * transmissão sensorial cortical e são consideradas antecipatórias.
   * @param {number} rt Tempo de reação medido
   */
  static isAnticipatory(rt) {
    return rt < 130;
  }
}
