# pds-maturidade | CMMI-DEV 2.0, MR-MPS-SW 2023 e ISO/IEC/IEEE 12207
## CMMI 2.0
- Modelo de melhoria de processos organizado em **áreas de prática** (practice areas), agrupadas em capacidades e categorias: **Doing** (fazer), **Managing** (gerenciar), **Enabling** (habilitar) e **Improving** (melhorar).
- **Níveis de capacidade** (por área de prática): **0 a 3**.
- **Níveis de maturidade** (da organização): **0 a 5** — 0 Incompleto, 1 Inicial, 2 Gerenciado, 3 Definido, 4 Gerenciado quantitativamente, 5 Em otimização.
- Avaliação oficial: **benchmark** (gera nível) e sustentação; no 2.0 o foco é desempenho e resultados de negócio.
## MR-MPS-SW (Softex)
- Modelo brasileiro, compatível com o CMMI, pensado também para pequenas e médias empresas.
- **7 níveis de maturidade**, do menor ao maior: **G** (Parcialmente gerenciado), **F** (Gerenciado), **E** (Parcialmente definido), **D** (Largamente definido), **C** (Definido), **B** (Gerenciado quantitativamente) e **A** (Em otimização).
- Cada nível combina **processos** e **resultados esperados** com **capacidade dos processos**.
## ISO/IEC/IEEE 12207:2017 (ABNT 2021)
- Norma de **processos do ciclo de vida do software**. Não impõe modelo de ciclo de vida nem método.
- Quatro grupos: **acordo** (aquisição e fornecimento), **habilitadores organizacionais** (gestão de modelos de ciclo de vida, infraestrutura, portfólio, RH, qualidade, conhecimento), **gerenciamento técnico** (planejamento, avaliação e controle, decisão, riscos, configuração, informação, medição, garantia da qualidade) e **técnicos** (definição de requisitos de stakeholders e do sistema, arquitetura, design, implementação, integração, verificação, transição, validação, operação, manutenção e descarte).
> Dica: verificação = "construímos certo o produto?" (conforme especificação); validação = "construímos o produto certo?" (atende ao usuário).

# pds-uml | UML 2.5
A UML 2.5 tem **14 diagramas**, em dois grupos.
## Estruturais (7)
Classes, objetos, **componentes**, **implantação** (deployment: nós de hardware e artefatos), pacotes, **estrutura composta** e **perfil**.
## Comportamentais (7)
**Casos de uso**, **atividades**, **máquina de estados**, e os 4 de **interação**: **sequência** (ordem temporal das mensagens), **comunicação** (foco nos vínculos entre objetos), **visão geral de interação** e **tempo** (timing).
## Relacionamentos no diagrama de classes
- **Associação** (linha), com multiplicidade (1, 0..1, *, 1..*).
- **Agregação** (losango vazio): todo-parte em que a parte pode existir sozinha.
- **Composição** (losango cheio): a parte depende do todo e morre com ele.
- **Generalização/herança** (seta com triângulo vazio). **Realização** (tracejada com triângulo: classe implementa interface). **Dependência** (tracejada com seta aberta).
- Visibilidade: **+** público, **−** privado, **#** protegido, **~** pacote.
## Casos de uso
- Ator (papel externo), caso de uso (objetivo do ator). **include**: comportamento obrigatório reutilizado (sempre executa). **extend**: comportamento opcional/condicional que estende o base. Generalização entre atores ou casos.
> Dica: "losango cheio = composição, morre junto" é o que mais cai.

# pds-bpmn | BPMN e modelagem de processos
**BPMN 2.0** (OMG) é a notação padrão para modelar processos de negócio.
## Elementos
- **Objetos de fluxo**: **eventos** (círculos: início fino, intermediário duplo, fim grosso), **atividades** (retângulos arredondados: tarefa ou subprocesso) e **gateways** (losangos).
- **Gateways**: **exclusivo (XOR, "X")** — um caminho só; **paralelo (AND, "+")** — todos os caminhos ao mesmo tempo; **inclusivo (OR, "O")** — um ou mais caminhos; **baseado em eventos** — o primeiro evento que ocorrer decide.
- **Conectores**: fluxo de sequência (linha cheia, dentro de um pool), **fluxo de mensagem** (tracejado, **entre pools**), associação (pontilhada, liga artefatos).
- **Swimlanes**: **pool** (participante/organização) e **lanes** (raias: papéis/áreas dentro do pool).
- **Artefatos**: objeto de dados, grupo e anotação.
## Modelagem e especificação
- **AS-IS** (como é hoje) e **TO-BE** (como deveria ser).
- Outras técnicas: fluxogramas, DFD (diagrama de fluxo de dados), diagramas de atividade UML.
> Dica: fluxo de sequência não cruza a fronteira de um pool; entre pools usa-se fluxo de mensagem.

# pds-ageis | Métodos ágeis: Scrum, Kanban e XP
**Manifesto Ágil** (2001): indivíduos e interações mais que processos e ferramentas; software funcionando mais que documentação abrangente; colaboração com o cliente mais que negociação de contratos; responder a mudanças mais que seguir um plano. São **12 princípios**.
## Scrum (Guia 2020)
- **Pilares**: transparência, inspeção e adaptação. **Valores**: comprometimento, foco, abertura, respeito e coragem.
- **Time Scrum** (até ~10 pessoas, sem sub-times): **Product Owner** (maximiza valor, gerencia o Product Backlog), **Scrum Master** (eficácia do time, remove impedimentos, serve à organização) e **Developers**.
- **Eventos**: Sprint (até 1 mês, contém os demais), Sprint Planning (até 8 h, define o porquê, o quê e como), Daily Scrum (15 min, para os Developers), Sprint Review (até 4 h) e Sprint Retrospective (até 3 h).
- **Artefatos e compromissos**: Product Backlog → **Meta do Produto**; Sprint Backlog → **Meta da Sprint**; Incremento → **Definição de Pronto**.
- Só o **Product Owner** pode cancelar a Sprint (quando a Meta da Sprint fica obsoleta).
## Kanban
- Visualizar o fluxo (quadro), **limitar o WIP** (trabalho em progresso), gerenciar o fluxo, políticas explícitas, ciclos de feedback, melhoria colaborativa. Sistema puxado.
- Métricas: **lead time** (do pedido à entrega), **cycle time** (do início do trabalho à entrega), throughput, diagrama de fluxo cumulativo (CFD).
## XP (Extreme Programming)
- Valores: comunicação, simplicidade, feedback, coragem e respeito.
- Práticas: **programação em par**, **TDD**, integração contínua, refatoração, design simples, propriedade coletiva do código, releases pequenas, cliente presente, padrões de código, ritmo sustentável (40 h).
## Outros
Lean (eliminar desperdícios), FDD, Crystal, SAFe (ágil em escala), **MoSCoW** para priorizar (Must, Should, Could, Won't), MVP.

# pds-requisitos | Engenharia de requisitos e rastreabilidade
- **Requisitos funcionais**: o que o sistema faz (funções, serviços). **Não funcionais**: como faz (desempenho, segurança, usabilidade, disponibilidade). **De domínio** e **regras de negócio**.
- **Requisitos de usuário** (linguagem natural, alto nível) x **de sistema** (detalhados, técnicos).
## Processo
**Elicitação** (descoberta) → **análise e negociação** → **especificação/documentação** → **validação** → **gerenciamento** (mudanças).
- Técnicas de elicitação: entrevistas, questionários, workshops/JAD, brainstorming, observação/etnografia, prototipação, análise de documentos, cenários e histórias de usuário.
- **Histórias de usuário**: "Como [papel], quero [ação], para [benefício]", com critérios de aceitação. Critério **INVEST**: Independente, Negociável, Valiosa, Estimável, Pequena (Small) e Testável.
- Boas características de requisito: correto, não ambíguo, completo, consistente, verificável, rastreável.
## Rastreabilidade
- Ligar cada requisito à sua **origem** (para trás) e aos **artefatos** que o implementam e testam (para frente): design, código, casos de teste.
- **Matriz de rastreabilidade**: permite análise de impacto de mudanças e verificar cobertura de testes.
## Documentação técnica e dicionário de dados
- Documentar arquitetura, APIs, decisões (ADR), manuais. Documentação "viva", versionada junto ao código (docs as code).
- **Dicionário de dados**: descreve cada elemento de dados (nome, tipo, tamanho, domínio, obrigatoriedade, significado, origem).

# pds-modelagem-dados | Engenharia de software, low-code e modelagem de dados
## Modelos de processo
- **Cascata**: fases sequenciais, bom para requisitos estáveis. **Incremental** e **iterativo**. **Espiral** (Boehm): orientado a riscos, com protótipos. **RUP**: iterativo, fases concepção, elaboração, construção e transição. **Prototipação**.
## Low-code e no-code
- Plataformas visuais que aceleram a criação de aplicações. **Low-code**: pouco código, voltado a desenvolvedores e técnicos. **No-code**: sem código, para usuários de negócio (citizen developers).
- Vantagens: rapidez, menor custo. Riscos: **dependência do fornecedor (lock-in)**, **shadow IT**, limites de customização, governança e segurança — exigem regras de governança da TI.
## Dados estruturados, semiestruturados e não estruturados
- **Estruturados**: esquema rígido, tabelas (bancos relacionais).
- **Semiestruturados**: possuem marcação/estrutura flexível e autodescritiva: **XML** (tags, validável por XSD/DTD) e **JSON** (pares chave-valor, objetos {} e arrays [], tipos string, number, boolean, null; validável por JSON Schema).
- **Não estruturados**: texto livre, imagens, áudio, vídeo.
> Dica: JSON não aceita comentários nem aspas simples; as chaves são sempre strings entre aspas duplas.

# pds-qualidade | Qualidade de software: ISO/IEC 25010:2023
O modelo de **qualidade de produto** da ISO/IEC 25010 (revisão 2023, publicada pela ABNT em 2024) tem **9 características**:
- **Adequação funcional**: completude, correção e adequação.
- **Eficiência de desempenho**: comportamento no tempo, utilização de recursos, capacidade.
- **Compatibilidade**: coexistência e interoperabilidade.
- **Capacidade de interação** (antiga **usabilidade**): reconhecimento da adequação, aprendizagem, operabilidade, proteção contra erro do usuário, engajamento, inclusividade, assistência ao usuário e autodescrição.
- **Confiabilidade**: ausência de falhas (antes "maturidade"), disponibilidade, tolerância a falhas, recuperabilidade.
- **Segurança (security)**: confidencialidade, integridade, não repúdio, responsabilização, autenticidade e **resistência**.
- **Manutenibilidade**: modularidade, reusabilidade, analisabilidade, modificabilidade, testabilidade.
- **Flexibilidade** (antiga **portabilidade**): adaptabilidade, **escalabilidade**, instalabilidade, substituibilidade.
- **Proteção (safety)** — **nova**: restrição operacional, identificação de riscos, falha segura, alerta de perigo e integração segura.
- Há também o modelo de **qualidade em uso** (ISO/IEC 25019): eficácia, eficiência, satisfação, ausência de riscos, cobertura de contexto.
> Dica: a revisão 2023 incluiu Safety e renomeou Usabilidade e Portabilidade. Comparado à versão de 2011, eram 8 características.

# pds-testes | Testes de software
## Níveis
- **Unidade** (menor parte isolada, geralmente pelo desenvolvedor), **integração** (interfaces entre componentes: top-down, bottom-up, big bang), **sistema** (o sistema completo contra requisitos) e **aceitação** (pelo usuário/cliente: **alfa** no ambiente do desenvolvedor, **beta** no ambiente real do usuário; UAT).
## Tipos
- **Funcionais**: o que o sistema faz. **Não funcionais**: desempenho, **carga** (volume esperado), **estresse** (além do limite, para ver como quebra), **volume**, segurança, usabilidade, compatibilidade.
- **Regressão**: garante que mudanças não quebraram o que já funcionava (ideal automatizar). **Smoke test**: verificação rápida das funções principais após um build. **Teste de sanidade**.
## Técnicas
- **Caixa-preta** (baseada na especificação): **partição de equivalência**, **análise de valor limite** (testar nas bordas: mínimo, mínimo−1, máximo, máximo+1), tabela de decisão, transição de estados.
- **Caixa-branca** (baseada no código): cobertura de **comandos**, **decisões/ramos**, condições, caminhos; complexidade ciclomática (= número de caminhos independentes = decisões + 1).
- **Dublês de teste**: dummy, **stub** (respostas prontas), **mock** (verifica interações), spy, fake.
- **Estático** (revisões, análise de código sem executar) x **dinâmico** (executando).
## Princípios (ISTQB)
Testes mostram a presença de defeitos, não a ausência; teste exaustivo é impossível; testar cedo (**shift-left**); defeitos se agrupam; **paradoxo do pesticida** (repetir os mesmos testes deixa de achar defeitos); depende do contexto; a falácia da ausência de erros.

# pds-configuracao | Gestão de configuração, versionamento semântico e code review
## Gestão de configuração de software (GCS)
- Atividades: **identificação** dos itens de configuração (código, documentos, scripts), **controle de mudanças** (solicitação, análise de impacto, aprovação por um comitê de controle de mudanças), **registro/contabilização do status** e **auditoria** de configuração (funcional e física).
- **Baseline**: versão aprovada de um conjunto de itens, que só muda por processo formal.
- Ferramentas: Git, repositórios de artefatos, gestão de releases.
## Versionamento semântico (SemVer 2.0)
- **MAJOR.MINOR.PATCH**: **MAJOR** para mudanças **incompatíveis** na API; **MINOR** para funcionalidades **compatíveis**; **PATCH** para **correções** compatíveis.
- Ao subir o MAJOR, MINOR e PATCH voltam a zero (1.4.2 → 2.0.0). Versão **0.y.z** = desenvolvimento inicial, a API pode mudar a qualquer momento.
- Pré-release com hífen (1.0.0-alpha.1, tem precedência menor que 1.0.0) e metadados de build com + (ignorados na precedência).
## Revisão de código (code review)
- Objetivos: encontrar defeitos cedo, padronizar, compartilhar conhecimento, melhorar a manutenibilidade.
- Formas: **pull/merge request** com revisão assíncrona, **pair programming**, **inspeção formal** (Fagan: papéis de moderador, autor, leitor, inspetor) e walkthrough.
- Boas práticas: mudanças pequenas, checklist, comentários objetivos e respeitosos, automação de estilo e testes antes da revisão humana.
