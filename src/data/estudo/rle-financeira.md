# rle-juros | Juros simples e compostos
- **Capital (C)**: valor inicial. **Juros (J)**: remuneração. **Montante (M)**: C + J. **Taxa (i)** e **prazo (n)** sempre na **mesma unidade de tempo**.
## Juros simples
- Os juros incidem só sobre o capital inicial: **J = C · i · n** e **M = C (1 + i·n)**.
- Crescimento **linear** (progressão aritmética).
- Taxas proporcionais: 12% ao ano = 1% ao mês.
## Juros compostos
- Juros sobre juros: **M = C (1 + i)^n**.
- Crescimento **exponencial** (progressão geométrica).
- Para n < 1 período, os juros simples rendem mais; para n = 1, iguais; para n > 1, os compostos rendem mais.
- Número de períodos: n = log(M/C) ÷ log(1 + i) (a prova costuma dar os logaritmos).
## Capitalização contínua
M = C · e^(i·n), com e ≈ 2,718. É o limite dos compostos quando a capitalização ocorre a cada instante.
> Dica: a FCC costuma fornecer tabelas de (1 + i)^n; use-as em vez de calcular potências.

# rle-taxas | Taxas nominal, efetiva, real e equivalentes
- **Taxa nominal**: o período da taxa difere do período de capitalização (ex.: 12% ao ano capitalizados mensalmente). Para usar, converta proporcionalmente: 12% a.a. ÷ 12 = 1% a.m.
- **Taxa efetiva**: a que realmente incide no período. 1% a.m. composto gera (1,01)^12 − 1 ≈ 12,68% a.a.
- **Taxas equivalentes** (compostos): (1 + ia) = (1 + im)^12. Ex.: 21% a.a. ↔ 10% ao semestre, pois 1,1² = 1,21.
- **Taxa real** (descontando a inflação): (1 + aparente) = (1 + real) × (1 + inflação). Ex.: rendeu 10% com inflação de 4%: real = 1,10 ÷ 1,04 − 1 ≈ 5,77% (não 6%).
- **Taxa aparente**: a nominal observada, sem descontar a inflação.
> Dica: em juros simples, taxas equivalentes = proporcionais; em compostos, não.

# rle-descontos | Descontos simples e compostos
Desconto é o abatimento por antecipar o pagamento de um título. **N** = valor nominal (de face, no vencimento); **A** = valor atual (pago hoje); D = N − A.
## Desconto simples
- **Comercial (bancário, "por fora")**: incide sobre o **nominal**: Dc = N · i · n; A = N (1 − i·n).
- **Racional ("por dentro")**: incide sobre o **valor atual**: Dr = A · i · n; N = A (1 + i·n).
- Com os mesmos dados, o desconto comercial é **maior** que o racional. Relação: Dc = Dr (1 + i·n).
## Desconto composto
- **Racional composto**: A = N ÷ (1 + i)^n (é o mais usado; equivale a trazer a valor presente).
- **Comercial composto**: A = N (1 − i)^n.
> Dica: "taxa efetiva" de uma operação de desconto comercial é maior que a taxa de desconto informada.

# rle-series | Equivalência de capitais e séries de pagamentos
## Equivalência de capitais (data focal)
Dois fluxos são equivalentes se, levados para a mesma data (data focal), têm o mesmo valor. Em juros compostos, a data focal pode ser qualquer uma; leve cada valor com (1 + i)^n para frente ou divida para trás.
## Valor presente e futuro
- VF = VP (1 + i)^n; VP = VF ÷ (1 + i)^n.
## Séries uniformes (prestações iguais, PMT)
- **Postecipada** (primeira parcela ao fim do 1º período): VP = PMT × [1 − (1 + i)^(−n)] ÷ i.
- **Antecipada** (com entrada): VP = PMT × fator × (1 + i).
- **Diferida** (carência): desconte o valor presente pelos períodos de carência.
- **Perpetuidade**: VP = PMT ÷ i.
- Valor futuro de uma série (poupança programada): VF = PMT × [(1 + i)^n − 1] ÷ i.
## Séries não uniformes
Traga cada pagamento a valor presente separadamente e some.

# rle-amortizacao | Sistemas de amortização: Price, SAC e misto
Prestação = **amortização** (parte que reduz a dívida) + **juros** (sobre o saldo devedor).
## Sistema Price (francês)
- **Prestações constantes**. Juros decrescentes e amortização crescente.
- PMT = SD × i ÷ [1 − (1 + i)^(−n)].
## SAC (amortização constante)
- **Amortização constante** = dívida ÷ n. Juros e prestações **decrescentes** (em PA).
- A primeira prestação do SAC é maior que a do Price, mas o **total de juros** pago no SAC é **menor**.
## Sistema misto (SAM)
- Cada prestação é a **média aritmética** das prestações do Price e do SAC no mesmo período.
> Dica: no SAC, os juros de cada mês = taxa × saldo devedor do mês anterior; o saldo cai de forma linear.

# rle-vpl-tir | Fluxo de caixa, VPL e TIR
- **Fluxo de caixa**: entradas e saídas ao longo do tempo (investimento inicial negativo em t = 0).
- **VPL (Valor Presente Líquido)**: soma de todos os fluxos trazidos a valor presente pela **taxa mínima de atratividade (TMA)**, menos o investimento. **VPL > 0**: o projeto rende mais que a TMA (aceitar); **VPL = 0**: rende exatamente a TMA; **VPL < 0**: rejeitar.
- **TIR (Taxa Interna de Retorno)**: a taxa que **zera o VPL**. Se **TIR > TMA**, o projeto é viável.
- Projetos excludentes: prefira o de **maior VPL** (a TIR pode dar ranking diferente). Fluxos com várias trocas de sinal podem ter mais de uma TIR.
- **Payback**: tempo para recuperar o investimento (simples, sem descontar; ou descontado).
> Dica: quanto maior a taxa de desconto, menor o VPL.
