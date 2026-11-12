// “Matéria zerada”: o aluno acertou todas as questões existentes no banco daquela matéria.
import { MATERIAS, type MateriaId } from './materias'
import type { Question } from './questions'

// Guardado no perfil (público): matéria → quantas questões o banco tinha quando ela foi zerada.
// Se o banco crescer, o número fica menor que o total atual e o selo deixa de valer.
export type Zeradas = Partial<Record<MateriaId, number>>

export function totaisPorMateria(qs: Question[]): Record<MateriaId, number> {
  const t = Object.fromEntries(MATERIAS.map((m) => [m.id, 0])) as Record<MateriaId, number>
  for (const q of qs) t[q.m]++
  return t
}

export interface ProgressoMateria {
  id: MateriaId
  total: number
  acertadas: number
  zerada: boolean
}

export function progressoMaterias(qs: Question[], correct: Iterable<string>): ProgressoMateria[] {
  const ok = new Set(correct)
  const tot = totaisPorMateria(qs)
  const ac = Object.fromEntries(MATERIAS.map((m) => [m.id, 0])) as Record<MateriaId, number>
  for (const q of qs) if (ok.has(q.id)) ac[q.m]++
  return MATERIAS.map((m) => ({ id: m.id, total: tot[m.id], acertadas: ac[m.id], zerada: tot[m.id] > 0 && ac[m.id] >= tot[m.id] }))
}

export function calcZeradas(qs: Question[], correct: Iterable<string>): Zeradas {
  const z: Zeradas = {}
  for (const p of progressoMaterias(qs, correct)) if (p.zerada) z[p.id] = p.total
  return z
}

export function mesmasZeradas(a: Zeradas | undefined, b: Zeradas): boolean {
  const ka = Object.keys(a ?? {}).sort()
  const kb = Object.keys(b).sort()
  return ka.length === kb.length && ka.every((k, i) => k === kb[i] && a![k as MateriaId] === b[k as MateriaId])
}

// Matérias cujo selo ainda vale para o banco atual
export function zeradasValidas(z: Zeradas | undefined, totais: Record<MateriaId, number>): MateriaId[] {
  return MATERIAS.filter((m) => (z?.[m.id] ?? 0) > 0 && z![m.id]! >= totais[m.id]).map((m) => m.id)
}

// Conjunto de “já acertadas” usado no sorteio: nas matérias zeradas não se filtra mais nada,
// e qualquer questão da matéria pode voltar.
export function acertadasParaSorteio(qs: Question[], correct: string[]): Set<string> {
  const zer = new Set(progressoMaterias(qs, correct).filter((p) => p.zerada).map((p) => p.id))
  if (!zer.size) return new Set(correct)
  const materiaDe = new Map(qs.map((q) => [q.id, q.m]))
  return new Set(correct.filter((id) => !zer.has(materiaDe.get(id)!)))
}
