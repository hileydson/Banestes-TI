// Aproveitamento “recente”: por matéria, conta só as últimas 10 questões respondidas nela;
// o geral é a média simples do aproveitamento de todas as matérias do perfil (matéria sem questões conta 0%).
// Assim o número acompanha a evolução: erros antigos saem da conta à medida que a pessoa resolve novas questões.
import { LISTA_CARGOS, pertence, scoreMateria, type Cargo, type MateriaCargo } from './cargos'
import type { Question } from './questions'
import type { Attempt, Profile } from './types'

export const JANELA_RECENTES = 10

// Histórico guardado no perfil (público, para o ranking): id da matéria do perfil → "1"/"0" das últimas
// respostas, da mais antiga para a mais recente. Guarda as matérias dos dois perfis (ex.: RLE do Analista
// e RLQ do Técnico), para que trocar de perfil não zere o histórico.
export type Recentes = Record<string, string>

export function materiasDaQuestao(q: Pick<Question, 'm' | 'area'>): string[] {
  const ids = new Set<string>()
  for (const c of LISTA_CARGOS) for (const mc of c.materias) if (pertence(q as Question, mc)) ids.add(mc.id)
  return [...ids]
}

export function registrarResposta(rec: Recentes, q: Pick<Question, 'm' | 'area'>, ok: boolean) {
  for (const id of materiasDaQuestao(q)) rec[id] = ((rec[id] ?? '') + (ok ? '1' : '0')).slice(-JANELA_RECENTES)
}

export interface AprovMateria {
  id: string
  nome: string
  curto: string
  cor: string
  pct: number // 0–100
  n: number // questões consideradas (até 10)
  acertos: number
  seq: string // "1"/"0" da mais antiga para a mais recente ('' quando vem do acumulado)
}

const conta1 = (s: string) => s.split('').filter((c) => c === '1').length

export function aproveitamentoMateria(p: Profile, mc: MateriaCargo): AprovMateria {
  const base = { id: mc.id, nome: mc.nome, curto: mc.curto, cor: mc.cor }
  if (p.recentes) {
    const seq = p.recentes[mc.id] ?? ''
    const a = conta1(seq)
    return { ...base, pct: seq.length ? (a / seq.length) * 100 : 0, n: seq.length, acertos: a, seq }
  }
  // Perfil que ainda não abriu o app depois da mudança: aproxima pelo acumulado (proporção), limitado a 10
  const s = scoreMateria(p, mc)
  const t = s.a + s.e
  const pct = t ? (s.a / t) * 100 : 0
  const n = Math.min(JANELA_RECENTES, t)
  return { ...base, pct, n, acertos: Math.round((pct * n) / 100), seq: '' }
}

export interface AprovGeral {
  pct: number
  materias: AprovMateria[]
  comQuestoes: number // matérias com pelo menos 1 questão
  consideradas: number // total de questões consideradas (soma das janelas)
}

export function aproveitamentoGeral(p: Profile, cargo: Cargo): AprovGeral {
  const materias = cargo.materias.map((mc) => aproveitamentoMateria(p, mc))
  const pct = materias.length ? materias.reduce((s, m) => s + m.pct, 0) / materias.length : 0
  return {
    pct,
    materias,
    comQuestoes: materias.filter((m) => m.n > 0).length,
    consideradas: materias.reduce((s, m) => s + m.n, 0)
  }
}

// Monta o histórico recente de quem já tinha respostas antes desta mudança, a partir dos testes e provas
// salvos (mais novos primeiro). Os registros guardam acertos/erros por matéria do banco, sem a ordem das
// questões dentro de cada teste nem a área; matérias recortadas por área (ex.: Mat. Financeira do Técnico)
// usam a proporção do acumulado da área.
export function recentesDoHistorico(p: Profile, attempts: Attempt[]): Recentes {
  const rec: Recentes = {}
  const novos = [...attempts].sort((x, y) => y.data - x.data)
  const sintetico = (a: number, e: number) => {
    const t = a + e
    const n = Math.min(JANELA_RECENTES, t)
    const ac = t ? Math.round((a / t) * n) : 0
    return '0'.repeat(n - ac) + '1'.repeat(ac)
  }
  for (const c of LISTA_CARGOS) {
    for (const mc of c.materias) {
      if (rec[mc.id] !== undefined) continue
      let seq = ''
      if (!mc.areas) {
        for (const at of novos) {
          const s = at.porMateria?.[mc.m]
          if (!s || s.a + s.e === 0) continue
          seq = '0'.repeat(s.e) + '1'.repeat(s.a) + seq
          if (seq.length >= JANELA_RECENTES) break
        }
        if (!seq) {
          const s = p.stats[mc.m]
          if (s) seq = sintetico(s.a, s.e)
        }
      } else {
        let a = 0,
          e = 0
        for (const ar of mc.areas) {
          a += p.areaStats[ar]?.a ?? 0
          e += p.areaStats[ar]?.e ?? 0
        }
        seq = sintetico(a, e)
      }
      seq = seq.slice(-JANELA_RECENTES)
      if (seq) rec[mc.id] = seq
    }
  }
  return rec
}
