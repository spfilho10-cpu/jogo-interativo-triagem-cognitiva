/**
 * Configuração e Mapeamento de Temas e Skins Lúdicas (Gamificação Infantil e Adulta)
 * Fornece metades visuais, ícones de estímulo e textos adaptados para crianças e adultos.
 */

export const THEMES_CONFIG = {
  // 1. Infantil: Safári dos Animais
  animals: {
    id: 'animals',
    name: '🦁 Safári dos Animais (Infantil)',
    category: 'kids',
    banner: '🌿 Aventura na Selva',
    gonogo: {
      goIcon: '🦁',
      goLabel: 'Leãozinho Amigo',
      noGoIcon: '🐝',
      noGoLabel: 'Abelhinha Picadora',
      goTip: 'Toque rápido no Leãozinho!',
      noGoTip: 'Cuidado com a Abelha! NÃO aperte!'
    },
    cpt: {
      targetIcon: '⭐',
      targetLabel: 'Estrela da Selva',
      distractors: ['🐵', '🐘', '🦒', '🐼', '🐯', '🐰']
    },
    memory: {
      symbol: '🐾',
      label: 'Pegadas Mágicas'
    },
    timing: {
      symbol: '🍎',
      instruction: 'Segure para alimentar o leãozinho na hora certa!'
    }
  },

  // 2. Infantil: Mundo dos Dinossauros
  dinosaurs: {
    id: 'dinosaurs',
    name: '🦖 Mundo dos Dinossauros (Infantil)',
    category: 'kids',
    banner: '🌋 Era Jurássica',
    gonogo: {
      goIcon: '🦕',
      goLabel: 'Brontossauro Amigo',
      noGoIcon: '🦖',
      noGoLabel: 'T-Rex Feroz',
      goTip: 'Toque rápido no Dino amigo!',
      noGoTip: 'O T-Rex apareceu! Pare e NÃO aperte!'
    },
    cpt: {
      targetIcon: '🥚',
      targetLabel: 'Ovo Dourado de Dino',
      distractors: ['🦴', '🌋', '🌿', '🪨', '🌴', '🐾']
    },
    memory: {
      symbol: '🦴',
      label: 'Fósseis Escondidos'
    },
    timing: {
      symbol: '🥚',
      instruction: 'Segure o tempo exato para o ovo chocar!'
    }
  },

  // 3. Infantil: Aventura Espacial Kids
  space_kids: {
    id: 'space_kids',
    name: '🛸 Astronautas & Galáxia (Infantil)',
    category: 'kids',
    banner: '🚀 Missão Espacial Mirim',
    gonogo: {
      goIcon: '🚀',
      goLabel: 'Foguete Aliado',
      noGoIcon: '☄️',
      noGoLabel: 'Meteoro Perigoso',
      goTip: 'Aperte no Foguete rápido!',
      noGoTip: 'Meteoro vindo! NÃO aperte!'
    },
    cpt: {
      targetIcon: '🌟',
      targetLabel: 'Super Estrela',
      distractors: ['🪐', '🛸', '🛰️', '🌙', '👾', '🌍']
    },
    memory: {
      symbol: '✨',
      label: 'Portais Estelares'
    },
    timing: {
      symbol: '🔋',
      instruction: 'Carregue a bateria da nave na duração certa!'
    }
  },

  // 4. Padrão: Espaço Cósmico (Dark / Adulto)
  cosmic: {
    id: 'cosmic',
    name: '🚀 Espaço Cósmico (Padrão Dark)',
    category: 'standard',
    banner: '⚡ Estação Orbital',
    gonogo: {
      goIcon: '⚡',
      goLabel: 'Sinal Verde (GO)',
      noGoIcon: '✋',
      noGoLabel: 'Sinal Vermelho (NO-GO)',
      goTip: 'Aperte o mais rápido possível!',
      noGoTip: 'Freie imediatamente!'
    },
    cpt: {
      targetIcon: '⭐',
      targetLabel: 'Estrela Dourada',
      distractors: ['🔷', '🟣', '🔶', '🔺', '🟩']
    },
    memory: {
      symbol: '💡',
      label: 'Matriz de Blocos'
    },
    timing: {
      symbol: '⏳',
      instruction: 'Reproduza a duração exata do intervalo'
    }
  },

  // 5. Clínico: Consultório (Clean Light / Adulto)
  clinical: {
    id: 'clinical',
    name: '🩺 Clínico / Consultório (Clean Light)',
    category: 'clinical',
    banner: '📋 Avaliação Neurocognitiva',
    gonogo: {
      goIcon: '🟢',
      goLabel: 'Alvo Válido (Go)',
      noGoIcon: '🛑',
      noGoLabel: 'Inibição (No-Go)',
      goTip: 'Responda com agilidade',
      noGoTip: 'Iniba a resposta motora'
    },
    cpt: {
      targetIcon: '⭐',
      targetLabel: 'Alvo Primário',
      distractors: ['🔹', '🔸', '🔺', '▫️', '◾']
    },
    memory: {
      symbol: '🟦',
      label: 'Sequência Visuoespacial'
    },
    timing: {
      symbol: '⏱️',
      instruction: 'Mensure o intervalo de tempo'
    }
  }
};

export function getThemeConfig(themeId = 'cosmic') {
  return THEMES_CONFIG[themeId] || THEMES_CONFIG.cosmic;
}

/**
 * Retorna os temas permitidos estritamente conforme a faixa etária:
 * - Criança: Temas infantis (Safári, Dinossauros, Espaço Kids) + Cósmico
 * - Adolescente e Adulto: APENAS temas adultos/sóbrios (Cósmico e Clínico). Temas infantis nunca aparecem.
 */
export function getThemesForAgeGroup(ageGroup = 'adult') {
  if (ageGroup === 'child') {
    return [
      THEMES_CONFIG.animals,
      THEMES_CONFIG.dinosaurs,
      THEMES_CONFIG.space_kids,
      THEMES_CONFIG.cosmic
    ];
  }
  // Adultos e Adolescentes: estritamente sóbrios
  return [
    THEMES_CONFIG.cosmic,
    THEMES_CONFIG.clinical
  ];
}
