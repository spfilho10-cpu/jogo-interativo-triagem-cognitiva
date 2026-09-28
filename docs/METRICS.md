# Documento de Métricas Psicométricas e Fórmulas Neurocognitivas (6 Fases)

Este documento detalha os fundamentos científicos, fórmulas matemáticas e critérios de interpretação das métricas coletadas pela bateria ampliada de 6 fases do **NeuroScreen TDAH**.

---

## 1. Controle Inibitório e Impulsividade (Go/No-Go)

### Fundamentação
O paradigma Go/No-Go avalia a capacidade do córtex pré-frontal ventrolateral e da área motora suplementar em suprimir uma resposta motora pré-potente já iniciada.

### Métricas e Fórmulas
- **Tempo de Reação Médio ($\overline{RT}$)**:
  $$\overline{RT} = \frac{1}{N_{hits}} \sum_{i=1}^{N_{hits}} RT_i \quad (RT \ge 130\text{ ms})$$
- **Variabilidade do Tempo de Reação ($SD_{RT}$ / RTV)**:
  $$SD_{RT} = \sqrt{\frac{1}{N_{hits} - 1} \sum_{i=1}^{N_{hits}} (RT_i - \overline{RT})^2}$$
- **Coeficiente de Variação ($CV$)**:
  $$CV = \left( \frac{SD_{RT}}{\overline{RT}} \right) \times 100\%$$
- **Taxa de Comissão (Impulsividade)**:
  $$\text{Taxa de Comissão} = \left( \frac{\text{Comissões}}{N_{\text{No-Go}}} \right) \times 100\%$$
- **Teoria de Detecção de Sinal (SDT - $d'$ e $c$)**:
  Com correção de proporções extremas de Hautus (1995):
  $$H_{adj} = \frac{\text{Hits} + 0.5}{N_{\text{Go}} + 1}, \quad FA_{adj} = \frac{\text{Comissões} + 0.5}{N_{\text{No-Go}} + 1}$$
  $$d' = Z(H_{adj}) - Z(FA_{adj}), \quad c = -0.5 \times [Z(H_{adj}) + Z(FA_{adj})]$$

---

## 2. Atenção Sustentada e Vigilância Contínua (CPT)

### Fundamentação
Baseado no Conners CPT. Avalia a habilidade de sustentar a prontidão cognitiva e o estado de alerta endógeno por longos períodos em tarefas monótonas.

### Métricas e Fórmulas
- **Taxa de Omissão (Lapsos Atencionais)**:
  $$\text{Taxa de Omissão} = \left( \frac{\text{Omissões}}{N_{\text{Alvos}}} \right) \times 100\%$$
- **Decréscimo de Vigilância ($\Delta_{\text{Vigilância}}$)**:
  Comparação entre a acurácia no 1º quarto temporal ($Q_1$) e no 4º quarto temporal ($Q_4$):
  $$\Delta_{\text{Vigilância}} = \text{Acurácia}_{Q1} - \text{Acurácia}_{Q4}$$
  *(Valores positivos altos indicam rápido esgotamento dos recursos atencionais).*

---

## 3. Atenção Seletiva e Resistência a Distratores (Flanker)

### Fundamentação
Baseado no clássico paradigma Eriksen Flanker (1974). Mede o custo do processamento executivo para filtrar estímulos periféricos concorrentes.

### Métricas e Fórmulas
- **Custo de Interferência Cognitiva ($\Delta RT_{\text{Flanker}}$)**:
  $$\Delta RT_{\text{Flanker}} = \overline{RT}_{\text{Incongruente}} - \overline{RT}_{\text{Congruente}}$$
- **Taxa de Erros sob Distração**:
  $$\text{Taxa de Erro} = \left( \frac{\text{Erros}}{N_{\text{Total}}} \right) \times 100\%$$

---

## 4. Memória de Trabalho Espacial (Blocos de Corsi)

### Fundamentação
Déficits na alça visuoespacial da memória de trabalho são amplamente documentados como uma das principais marcas executivas no TDAH (Barkley, 1997; Martinussen et al., 2005), limitando a capacidade de reter e manipular sequências no espaço mental.

### Métricas e Fórmulas
- **Span Espacial Máximo ($Span_{\max}$)**:
  Maior comprimento de sequência reproduzido com 100% de precisão:
  $$Span_{\max} = \max \{ \text{Comprimento da Sequência Correta} \}$$
- **Acurácia de Resgate Sequencial**:
  $$\text{Acurácia} = \left( \frac{\text{Tentativas Corretas}}{N_{\text{Tentativas}}} \right) \times 100\%$$
- **Latência de Resgate por Elemento**:
  Tempo médio decorrido entre cada toque consecutivo na grade.

---

## 5. Flexibilidade Cognitiva e Alternância de Regra (Task Switching)

### Fundamentação
Avalia a capacidade de alterar o conjunto atencional (*attentional set-shifting*) entre dimensões concorrentes (Cor vs Forma), testando a inibição proativa e reativa (Monsell, 2003).

### Métricas e Fórmulas
- **Custo de Alternância Temporal (*Switch Cost*)**:
  Acréscimo de tempo exigido pelo córtex pré-frontal para reorganizar a nova regra:
  $$\text{Switch Cost} = \overline{RT}_{\text{Troca}} - \overline{RT}_{\text{Não-Troca}}$$
- **Erros Perseverativos**:
  Número de vezes em que o participante respondeu de acordo com a regra anterior imediatamente após a troca de regra ter sido anunciada.

---

## 6. Percepção e Reprodução Temporal (Time Estimation)

### Fundamentação
Indivíduos com TDAH frequentemente apresentam "cegueira temporal" (*time blindness*), uma dificuldade neurobiológica intrínseca mediada pelos circuitos cerebelo-tálamo-corticais e estriatais para mensurar durações sem pistas externas (Rubia et al., 2009; Castellanos & Tannock, 2002).

### Métricas e Fórmulas
- **Erro Percentual Médio ($\text{Erro}_{\%}$)**:
  $$\text{Erro}_{\%} = \frac{1}{N} \sum_{i=1}^{N} \left( \frac{|T_{\text{reproduzido}, i} - T_{\text{alvo}, i}|}{T_{\text{alvo}, i}} \right) \times 100\%$$
- **Viés Direcional Temporal**:
  $$\Delta T = \sum (T_{\text{reproduzido}} - T_{\text{alvo}})$$
  - $\Delta T < 0$: Subestimação (impaciência motora ou sensação de que o tempo passou mais rápido).
  - $\Delta T > 0$: Superestimação (hipoalerta temporal).

---

## 7. Referências Bibliográficas

1. **Barkley, R. A. (1997)**. *Behavioral inhibition, sustained attention, and executive functions: constructing a unifying theory of ADHD*. Psychological Bulletin, 121(1), 65-94.
2. **Castellanos, F. X., & Tannock, R. (2002)**. *Neuroscience of attention-deficit/hyperactivity disorder: the search for endophenotypes*. Nature Reviews Neuroscience, 3(8), 617-628.
3. **Conners, C. K., et al. (2003)**. *The Continuous Performance Test: A normative study*. Journal of Abnormal Child Psychology, 31(5), 555-562.
4. **Eriksen, B. A., & Eriksen, C. W. (1974)**. *Effects of noise letters upon the identification of a target letter in a nonsearch task*. Perception & Psychophysics, 16(1), 143-149.
5. **Martinussen, R., et al. (2005)**. *A meta-analysis of working memory impairments in children with attention-deficit/hyperactivity disorder*. Journal of the American Academy of Child & Adolescent Psychiatry, 44(4), 377-384.
6. **Monsell, S. (2003)**. *Task switching*. Trends in Cognitive Sciences, 7(3), 134-140.
7. **Rubia, K., et al. (2009)**. *Methylphenidate normalizes fronto-striatal underactivation during interference inhibition and time estimation in ADHD*. Neuropsychopharmacology, 34(9), 2143-2155.
