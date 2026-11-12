# pes-conceitos | Conceitos básicos e amostragem
- **População**: conjunto total de interesse. **Amostra**: parte observada. **Censo**: observar toda a população.
- **Parâmetro**: medida da população (μ, σ). **Estatística (estimador)**: medida da amostra (x̄, s), usada para estimar o parâmetro.
- **Variáveis**: **qualitativas** **nominais** (sem ordem: estado civil) e **ordinais** (com ordem: escolaridade); **quantitativas** **discretas** (contagens: número de filhos) e **contínuas** (medidas: renda, tempo).
## Técnicas de amostragem
- **Probabilísticas**: **aleatória simples** (todos com a mesma chance), **sistemática** (início aleatório e depois a cada k elementos), **estratificada** (divide em grupos homogêneos e sorteia em cada um, proporcionalmente) e **por conglomerados** (sorteia grupos inteiros, como agências, e observa todos os seus elementos).
- **Não probabilísticas**: por conveniência, por julgamento, por cotas.
- **Viés de seleção**: amostra que não representa a população (ex.: pesquisar só usuários do app) distorce as conclusões.

# pes-descritiva | Organização de dados, tabelas e gráficos
- **Frequência absoluta** (contagem), **relativa** (proporção: fi/n) e **acumulada**.
- **Tabelas de distribuição de frequências**: com classes (intervalos) para variáveis contínuas; use o **ponto médio** da classe nos cálculos.
- **Gráficos**: **histograma** (barras encostadas, dados contínuos em classes), **colunas/barras** (categorias), **setores** (partes de um todo; ângulo = % × 360°), **linhas** (evolução no tempo).
- **Pontos percentuais x porcentagem**: inadimplência de 4% para 5% = **+1 p.p.**, mas **+25%** em termos relativos.
- **Leitura de indicadores**: confira unidade, base de cálculo, período e escala do eixo antes de concluir.

# pes-medidas | Medidas de tendência central e de dispersão
## Tendência central
- **Média**: soma ÷ quantidade. **Ponderada**: Σ(valor × peso) ÷ Σpesos (ex.: 60% a 10% e 40% a 15% → 12%).
- **Mediana**: valor do meio dos dados ordenados (resistente a valores extremos).
- **Moda**: valor mais frequente.
- **Assimetria**: renda costuma ter cauda à direita → **média > mediana**. Na distribuição simétrica, média = mediana = moda.
## Dispersão
- **Amplitude**: maior − menor.
- **Variância**: média dos quadrados dos desvios — populacional divide por **n**, amostral por **n − 1**.
- **Desvio padrão**: raiz da variância, na **mesma unidade** dos dados.
- **Coeficiente de variação (CV)**: desvio padrão ÷ média; compara a dispersão de conjuntos com médias diferentes.
## Propriedades
- Somar uma constante: a média muda; a variância e o desvio padrão **não mudam**.
- Multiplicar por k: o desvio padrão é multiplicado por |k|; a variância, por k².

# pes-probabilidade | Probabilidade
- **Experimento aleatório**, **espaço amostral** (todos os resultados possíveis; duas moedas → 4) e **evento** (subconjunto).
- **Probabilidade clássica**: casos favoráveis ÷ casos possíveis (dado: par = 3/6 = 1/2; soma 7 com dois dados = 6/36 = 1/6).
- **Complementar**: P(não A) = 1 − P(A). "Pelo menos um" → use o complementar: 1 − P(nenhum).
- **União**: P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Se **mutuamente exclusivos** (não ocorrem juntos), P(A ∩ B) = 0.
- **Independentes**: P(A ∩ B) = P(A) × P(B) — um não altera a chance do outro.
- **Condicional**: P(A | B) = P(A ∩ B) ÷ P(B). Em tabelas, divida pelo total do **grupo condicionante** (ex.: inadimplentes entre os que têm cartão = 20/80).
- **Com e sem reposição**: sem reposição, as probabilidades mudam a cada retirada (3/5 × 2/4); com reposição, ficam iguais (3/5 × 3/5).
- **Probabilidade total** e **Teorema de Bayes**: P(A | B) = P(B | A) P(A) ÷ P(B). Exemplo: com fraude rara (1%), mesmo um bom alerta (90%) com 5% de falsos alarmes gera só cerca de 15% de fraudes entre os alertas.
- **Valor esperado**: soma de (valor × probabilidade). Útil para decisões (campanhas, perdas esperadas).

# pes-distribuicoes | Distribuição binomial e distribuição normal
## Binomial
- n tentativas independentes, cada uma com sucesso de probabilidade p. P(X = k) = C(n, k) · p^k · (1 − p)^(n − k).
- **Média (valor esperado) = n · p**; variância = n · p · (1 − p). Ex.: 100 contratos com 5% de inadimplência → esperam-se 5.
## Normal
- Curva em forma de **sino**, **simétrica**, com **média = mediana = moda**; área total = 1.
- **Regra empírica**: cerca de **68%** dos valores em ±1σ, **95%** em ±2σ e **99,7%** em ±3σ. Acima de +2σ: cerca de 2,5%.
- **Padronização (escore z)**: z = (x − μ) ÷ σ — indica quantos desvios padrão o valor está da média (130 com μ = 100 e σ = 15 → z = 2).
- **Aplicações financeiras**: retornos de investimentos, tempos de atendimento, valores de transações; valores muito distantes da média podem indicar anomalias (fraude).
