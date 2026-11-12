// “Matéria zerada”: o aluno acertou todas as questões existentes no banco daquela matéria (do seu perfil).
import { pertence, type Cargo } from './cargos'
import type { Question } from './questions'

// Guardado no perfil (público): matéria → quantas questões o banco tinha quando ela foi zerada.
// Se o banco crescer, o número fica menor que o total atual e o selo deixa de valer.
export type Zeradas = Partial<Record<string, number>>

export function totaisPorMateria(qs: Question[], cargo: Cargo): Record<string, number> {
  const t: Record<string, number> = Object.fromEntries(cargo.materias.map((m) => [m.id, 0]))
  for (const q of qs) for (const mc of cargo.materias) if (pertence(q, mc)) t[mc.id]++
  return t
}

export interface ProgressoMateria {
  id: string
  total: number
  acertadas: number
  zerada: boolean
}

export function progressoMaterias(qs: Question[], correct: Iterable<string>, cargo: Cargo): ProgressoMateria[] {
  const ok = new Set(correct)
  const tot = totaisPorMateria(qs, cargo)
  const ac: Record<string, number> = Object.fromEntries(cargo.materias.map((m) => [m.id, 0]))
  for (const q of qs) if (ok.has(q.id)) for (const mc of cargo.materias) if (pertence(q, mc)) ac[mc.id]++
  return cargo.materias.map((m) => ({ id: m.id, total: tot[m.id], acertadas: ac[m.id], zerada: tot[m.id] > 0 && ac[m.id] >= tot[m.id] }))
}

export function calcZeradas(qs: Question[], correct: Iterable<string>, cargo: Cargo): Zeradas {
  const z: Zeradas = {}
  for (const p of progressoMaterias(qs, correct, cargo)) if (p.zerada) z[p.id] = p.total
  return z
}

export function mesmasZeradas(a: Zeradas | undefined, b: Zeradas): boolean {
  const ka = Object.keys(a ?? {}).sort()
  const kb = Object.keys(b).sort()
  return ka.length === kb.length && ka.every((k, i) => k === kb[i] && a![k] === b[k])
}

// Matérias cujo selo ainda vale para o banco atual
export function zeradasValidas(z: Zeradas | undefined, totais: Record<string, number>, cargo: Cargo): string[] {
  return cargo.materias.filter((m) => (z?.[m.id] ?? 0) > 0 && z![m.id]! >= (totais[m.id] ?? Infinity)).map((m) => m.id)
}

// Conjunto de “já acertadas” usado no sorteio: nas matérias zeradas não se filtra mais nada,
// e qualquer questão da matéria pode voltar.
export function acertadasParaSorteio(qs: Question[], correct: string[], cargo: Cargo): Set<string> {
  const zer = cargo.materias.filter((mc) => progressoMaterias(qs, correct, cargo).find((p) => p.id === mc.id)?.zerada)
  if (!zer.length) return new Set(correct)
  const porId = new Map(qs.map((q) => [q.id, q]))
  return new Set(correct.filter((id) => {
    const q = porId.get(id)
    return !q || !zer.some((mc) => pertence(q, mc))
  }))
}
