# rle-proposicoes | Proposições, conectivos e tabela-verdade
**Proposição** é uma frase declarativa que pode ser julgada como verdadeira (V) ou falsa (F). Perguntas, ordens, exclamações e sentenças abertas ("x > 3") **não** são proposições.
## Conectivos
- **Negação** (~p): inverte o valor.
- **Conjunção** (p ∧ q, "e"): só é V quando **as duas** são V.
- **Disjunção inclusiva** (p ∨ q, "ou"): só é F quando **as duas** são F.
- **Disjunção exclusiva** ("ou... ou"): V quando os valores são **diferentes**.
- **Condicional** (p → q, "se... então"): só é F quando **V → F** (antecedente verdadeiro e consequente falso).
- **Bicondicional** (p ↔ q, "se e somente se"): V quando os valores são **iguais**.
## Tabela-verdade
Com n proposições simples, a tabela tem **2 elevado a n** linhas. **Tautologia**: sempre V; **contradição**: sempre F; **contingência**: às vezes V, às vezes F.
## Condição suficiente e necessária
Em p → q: p é **condição suficiente** para q; q é **condição necessária** para p.
> Dica: "Se chover, levo guarda-chuva" é falsa apenas se choveu e eu não levei.

# rle-equivalencias | Equivalências e negações
## Equivalências que mais caem
- **p → q ≡ ~q → ~p** (contrapositiva): "Se estudo, passo" = "Se não passei, não estudei".
- **p → q ≡ ~p ∨ q**: "Se estudo, passo" = "Não estudo ou passo".
- **p ↔ q ≡ (p → q) ∧ (q → p)**.
- Atenção: p → q **não** equivale a q → p (recíproca) nem a ~p → ~q (inversa).
## Negações (Leis de De Morgan)
- ~(p ∧ q) ≡ ~p ∨ ~q: negar "e" vira "ou" negando as partes.
- ~(p ∨ q) ≡ ~p ∧ ~q.
- **~(p → q) ≡ p ∧ ~q**: "Se chove, então fico em casa" → negação: "Chove **e** não fico em casa".
- ~(p ↔ q) ≡ ou p ou q (disjunção exclusiva).
## Quantificadores
- Negação de "**Todo** A é B": "**Algum** A **não** é B" (ou "Existe A que não é B").
- Negação de "**Algum** A é B": "**Nenhum** A é B".
- Negação de "Nenhum A é B": "Algum A é B".
> Dica: negar "todos" nunca é "nenhum". Basta um contraexemplo.

# rle-argumentos | Argumentos, silogismos e diagramas
Um **argumento** é um conjunto de premissas que leva a uma conclusão. É **válido** quando, se todas as premissas forem verdadeiras, a conclusão é obrigatoriamente verdadeira (validade é sobre a **forma**, não sobre a verdade do conteúdo).
## Formas válidas
- **Modus ponens**: p → q; p; logo q.
- **Modus tollens**: p → q; ~q; logo ~p.
- **Silogismo hipotético**: p → q; q → r; logo p → r.
- **Silogismo disjuntivo**: p ∨ q; ~p; logo q.
## Falácias comuns
- **Afirmar o consequente**: p → q; q; logo p (inválido).
- **Negar o antecedente**: p → q; ~p; logo ~q (inválido).
## Diagramas de Venn (categóricas)
- "Todo A é B": conjunto A dentro de B. "Nenhum A é B": conjuntos separados. "Algum A é B": interseção não vazia.
- Desenhe os conjuntos e teste se a conclusão vale em **todos** os desenhos possíveis.
## Método prático para validar
Suponha a conclusão **falsa** e tente deixar todas as premissas verdadeiras. Se conseguir, o argumento é inválido.

# rle-raciocinio | Raciocínio verbal, sequencial e associações lógicas
## Associação lógica (tabelas)
Monte uma tabela cruzando as categorias (pessoa × profissão × cidade). Marque os "não" de cada pista e use eliminação: cada linha e coluna tem exatamente um "sim".
## Verdades e mentiras
Suponha que uma pessoa diz a verdade e verifique se gera contradição. Procure **afirmações contraditórias** entre si: exatamente uma delas é verdadeira.
## Sequências
- Numéricas: teste diferença constante (PA), razão constante (PG), diferenças das diferenças, alternância de duas sequências intercaladas, quadrados/cubos, Fibonacci (cada termo = soma dos dois anteriores).
- De letras: converta em posição no alfabeto (A = 1... Z = 26; atenção se a questão considera K, W e Y).
- Figuras: observe rotação, quantidade e posição.
## Orientação espacial e temporal
- Calendário: os dias da semana se repetem a cada 7 dias; um ano comum avança 1 dia da semana, um bissexto, 2.
- Relógio: ângulo entre ponteiros = |30·H − 5,5·M| graus.
## Conjuntos
- União: n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Para três conjuntos, comece preenchendo o diagrama pela interseção dos três.
> Dica: em associação lógica, leia todas as pistas antes; pistas com "não" são as que mais eliminam.
