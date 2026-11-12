# rle-tendencia | Medidas de tendência central
- **Média aritmética simples**: soma dos valores ÷ quantidade.
- **Média ponderada**: Σ(valor × peso) ÷ Σ pesos.
- **Mediana**: valor do meio dos dados **ordenados**. Com quantidade par, média dos dois centrais. Posição: (n + 1)/2.
- **Moda**: valor mais frequente (pode haver nenhuma, uma — unimodal — ou várias).
## Propriedades da média
- Somar uma constante a todos os valores soma essa constante à média (e à mediana e à moda).
- Multiplicar todos por uma constante multiplica a média por ela.
- A média é sensível a valores extremos (outliers); a mediana não.
## Dados agrupados
- Em tabelas de frequência, a média é Σ(xi × fi) ÷ Σfi. Com classes, use o **ponto médio** de cada classe.
- Frequência **relativa** = fi/n; **acumulada** = soma das frequências até a classe.
> Dica: se acrescentar um novo valor igual à média, a média não muda.

# rle-dispersao | Medidas de dispersão
Medem o quanto os dados se espalham em torno da média.
- **Amplitude total**: maior − menor valor.
- **Desvio médio**: média dos módulos dos desvios |xi − média|.
- **Variância**: média dos quadrados dos desvios. **Populacional**: divide por n. **Amostral**: divide por **n − 1**.
- **Desvio padrão**: raiz quadrada da variância (tem a **mesma unidade** dos dados; a variância tem a unidade ao quadrado).
- **Coeficiente de variação**: desvio padrão ÷ média (dispersão relativa, em %; permite comparar conjuntos de unidades diferentes).
## Propriedades
- Somar uma constante **não altera** variância nem desvio padrão.
- Multiplicar por k: o desvio padrão é multiplicado por |k| e a variância por k².
> Dica: variância sempre ≥ 0; é zero só se todos os valores forem iguais.

# rle-graficos | Gráficos e tabelas
- **Histograma**: barras **encostadas**, para dados contínuos agrupados em classes; a área de cada barra representa a frequência.
- **Gráfico de colunas/barras**: compara categorias (barras separadas).
- **Setores (pizza)**: mostra partes de um todo; o ângulo = percentual × 360°.
- **Linhas**: evolução ao longo do tempo.
- **Infográfico**: combina dados, ícones e texto para comunicar uma informação.
- **Polígono de frequências**: liga os pontos médios do topo das barras do histograma.
## Como resolver
Leia título, eixos, unidades e legenda antes dos números. Fique atento a escalas que não começam em zero e a valores em milhares/porcentagem.

# rle-contagem | Contagem: princípios, permutações e combinações
- **Princípio multiplicativo**: etapas sucessivas e independentes → multiplique as possibilidades (placas, senhas).
- **Princípio aditivo**: casos que se excluem ("ou um ou outro") → some.
- **Permutação simples**: ordenar n elementos distintos = n! (fatorial). Anagramas de AMOR = 4! = 24.
- **Permutação com repetição**: n! ÷ (a! · b! ...). Anagramas de BANANA = 6! ÷ (3! · 2!) = 60.
- **Arranjo** (a **ordem importa**): A(n,p) = n! ÷ (n − p)!. Pódio de 3 entre 10 = 10 · 9 · 8 = 720.
- **Combinação** (a **ordem não importa**): C(n,p) = n! ÷ [p! (n − p)!]. Comissão de 3 entre 10 = 120.
## Probabilidade (base)
P = casos favoráveis ÷ casos possíveis. Eventos independentes: multiplique. Eventos excludentes: some. P(não A) = 1 − P(A).
> Dica: pergunte "trocar a ordem gera outro resultado?" Se sim, arranjo; se não, combinação.
