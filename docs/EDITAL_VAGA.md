# Termo de Referência / Descrição de Vaga Técnica (1 Página)

## Projeto: Bateria de Triagem Neurocognitiva para TDAH — 6 Fases (Web/PWA & Mobile)

### 1. Contexto e Objetivo
Contratação de desenvolvedor(a) Front-end / Full-stack ou estúdio de tecnologia para conceber e entregar uma aplicação web progressiva (PWA) responsiva e empacotável para mobile (Android/iOS) voltada à **triagem e autoavaliação inicial orientada de TDAH**. A ferramenta implementa **6 tarefas neuropsicológicas consolidadas** para mensuração de controle inibitório, vigilância sustentada, tempo de reação, memória de trabalho visuoespacial, flexibilidade cognitiva e percepção temporal, com suporte a **temas infantis gamificados** (exclusivos para crianças) e **temas adultos/clínicos**.

---

### 2. Escopo e Entregáveis Obrigatórios
1. **PWA Completa & Responsiva**: Aplicação responsiva (smartphones, tablets e desktops), com funcionamento 100% offline (*Service Worker Network-First*) e instalação na tela inicial.
2. **Seis Tarefas Neurocognitivas Validadas**:
   - **1. Go/No-Go**: Estímulo frequente (75%) e inibição rara (25%), com medição de comissões, omissões e RT.
   - **2. CPT Contínuo**: Alvos espaciais dinâmicos no tempo, com cálculo de declínio de vigilância ($Q_1$ vs $Q_4$).
   - **3. Atenção Seletiva (Flanker)**: Identificação sob condições congruentes e incongruentes com cálculo do custo de interferência.
   - **4. Memória de Trabalho Espacial (Corsi)**: Grade 3x3 com sequências iluminadas e cálculo do *Span* visuoespacial.
   - **5. Flexibilidade Cognitiva (Task Switching)**: Alternância imprevista entre Cor e Forma com cálculo do *Switch Cost*.
   - **6. Percepção Temporal**: Reprodução manual de intervalos de tempo e mensuração de viés temporal.
3. **Sistema de Personalização Visual com Restrição por Idade**:
   - Temas Infantis (Safári dos Animais, Dinossauros e Astronautas Kids) visíveis **estritamente para crianças**.
   - Temas Adultos (Espaço Cósmico Dark e Clínico Clean Light) sóbrios para adolescentes e adultos.
4. **Mecanismo de Temporização Precisa**: Implementação com `performance.now()` e leitura de timestamps nativos de hardware (`event.timeStamp`) para acurácia milissegúndica.
5. **Painel de Resultados e Exportação**: Gráfico de radar poligonal de 6 eixos em HTML5 Canvas, linguagem ética não-diagnóstica e exportadores para **JSON bruto**, **CSV tabular** e **Impressão/PDF**.
6. **Código-Fonte e Documentação**: Repositório Git com suite de testes automatizados e manuais de entrega/arquitetura.

---

### 3. Requisitos Técnicos e Perfil Desejado
- **Essenciais**:
  - Forte domínio de JavaScript/TypeScript moderno (ES6+), HTML5 Canvas e APIs nativas (Web Audio API, Service Worker).
  - Experiência comprovada em PWA, design responsivo e acessibilidade web (WCAG 2.1 AA/AAA).
  - Conhecimento em arquitetura de software modular, limpa e sem acoplamento desnecessário.
- **Diferenciais**:
  - Experiência prévia em jogos sérios, ferramentas psicométricas ou aplicações de telemedicina/saúde digital.
  - Familiaridade com empacotadores híbridos (Capacitor / Cordova).

---

### 4. Cronograma Sugerido e Prazos

| Etapa | Descrição | Prazo Estimado |
| :--- | :--- | :--- |
| **Etapa 1** | Wireframes, arquitetura de software e motor de precisão temporal | 1 semana |
| **Etapa 2** | Implementação das 6 tarefas cognitivas e tutoriais guiados | 2 semanas |
| **Etapa 3** | Motor psicométrico, temas infantis/adultos e dashboard de radar 6 eixos | 1 semana |
| **Etapa 4** | Testes de usabilidade, revisão de acessibilidade, documentação e entrega | 1 semana |
| **Total** | Ciclo completo de desenvolvimento | **5 semanas** |

---

### 5. Critérios de Avaliação de Propostas

| Critério | Peso | Descrição da Avaliação |
| :--- | :---: | :--- |
| **Experiência e Portfólio** | 35% | Qualidade e fluidez de projetos anteriores (PWA, interatividade e responsividade). |
| **Proposta Técnica e Arquitetura** | 30% | Clareza na abordagem para garantir precisão temporal milissegúndica e offline-first. |
| **Custo e Relação Custo-Benefício** | 20% | Adequação orçamentária ao escopo delimitado. |
| **Prazos e Metodologia** | 15% | Viabilidade do cronograma apresentado e clareza nos marcos de entrega. |
