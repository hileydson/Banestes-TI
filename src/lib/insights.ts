import { AREA_BY_ID, MATERIAS, type MateriaId } from './materias'
import type { Profile, Score } from './types'

export const pct = (s?: Score) => (s && s.a + s.e > 0 ? (s.a / (s.a + s.e)) * 100 : 0)
export const total = (s?: Score) => (s ? s.a + s.e : 0)
export const fmtPct = (n: number) => `${Math.round(n)}%`

export interface InsightMateria {
  id: MateriaId
  nome: string
  cor: string
  aproveitamento: number
  respondidas: number
  diferenca: number // pontos percentuais em relação à média geral
}

export interface Insight {
  geral: number
  respondidas: number
  materias: InsightMateria[]
  pior?: InsightMateria
  melhor?: InsightMateria
  piorArea?: { nome: string; aproveitamento: number; respondidas: number }
  mensagens: string[]
}

export function computeInsight(p: Profile): Insight {
  let a = 0
  let e = 0
  for (const m of MATERIAS) {
    a += p.stats[m.id]?.a ?? 0
    e += p.stats[m.id]?.e ?? 0
  }
  const geral = a + e ? (a / (a + e)) * 100 : 0
  const materias: InsightMateria[] = MATERIAS.map((m) => {
    const s = p.stats[m.id]
    const ap = pct(s)
    return { id: m.id, nome: m.nome, cor: m.cor, aproveitamento: ap, respondidas: total(s), diferenca: ap - geral }
  })
  const comDados = materias.filter((m) => m.respondidas > 0)
  const ordenadas = [...comDados].sort((x, y) => x.aproveitamento - y.aproveitamento)
  const pior = ordenadas[0]
  const melhor = ordenadas[ordenadas.length - 1]

  const areas = Object.entries(p.areaStats)
    .filter(([id, s]) => AREA_BY_ID[id] && total(s) >= 2)
    .map(([id, s]) => ({ nome: AREA_BY_ID[id].nome, aproveitamento: pct(s), respondidas: total(s) }))
    .sort((x, y) => x.aproveitamento - y.aproveitamento)
  const piorArea = areas[0]

  const mensagens: string[] = []
  if (pior && melhor && pior.id !== melhor.id) {
    mensagens.push(
      `Seu rendimento em ${pior.nome} está em ${fmtPct(pior.aproveitamento)}, ${Math.abs(Math.round(pior.diferenca))} pontos percentuais ${
        pior.diferenca < 0 ? 'abaixo' : 'acima'
      } da sua média geral (${fmtPct(geral)}). É a matéria que mais precisa de atenção agora.`
    )
    mensagens.push(
      `Seu ponto forte é ${melhor.nome}, com ${fmtPct(melhor.aproveitamento)} de acertos (${Math.round(melhor.diferenca) >= 0 ? '+' : ''}${Math.round(
        melhor.diferenca
      )} p.p. em relação à média).`
    )
  } else if (pior) {
    mensagens.push(`Seu aproveitamento em ${pior.nome} está em ${fmtPct(pior.aproveitamento)}. Continue resolvendo para comparar com as outras matérias.`)
  }
  if (piorArea && piorArea.aproveitamento < 60) {
    mensagens.push(`Dentro das matérias, o assunto mais fraco é "${piorArea.nome}" (${fmtPct(piorArea.aproveitamento)} em ${piorArea.respondidas} questões).`)
  }
  if (a + e > 0) {
    mensagens.push(
      geral >= 60
        ? `Na média geral você está com ${fmtPct(geral)} — acima da nota mínima de aprovação do edital (6,0). Mantenha o ritmo!`
        : `Na média geral você está com ${fmtPct(geral)}. O edital exige nota mínima 6,0 — foque nas matérias abaixo da média.`
    )
  }
  return { geral, respondidas: a + e, materias, pior, melhor, piorArea, mensagens }
}

// Nota no padrão do edital: CG (peso 1) e CE (peso 2), escala 0–10
export function notaEdital(acertosCG: number, totalCG: number, acertosCE: number, totalCE: number) {
  const notaCG = totalCG ? (acertosCG / totalCG) * 10 : 0
  const notaCE = totalCE ? (acertosCE / totalCE) * 10 : 0
  const notaFinal = (notaCG + 2 * notaCE) / 3
  const r = (n: number) => Math.round(n * 100) / 100
  return { notaCG: r(notaCG), notaCE: r(notaCE), notaFinal: r(notaFinal), aprovado: notaFinal >= 6 }
}
