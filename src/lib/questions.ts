import type { MateriaId, Slot } from './materias'
import { materiaDoCargo, pertence, type Cargo } from './cargos'

// Formato compacto usado nos arquivos JSON do banco
export interface RawQuestion {
  id: string
  m: MateriaId // matéria do edital
  a?: string // área (sub-tópico)
  s: string // assunto
  t?: string // texto de apoio (opcional)
  q: string // enunciado
  o: string[] // 5 alternativas
  c: number // índice da correta (0-4)
  e: string // explicação da correta
  x: string[] // comentário de cada alternativa
  r?: string // questão real de prova FCC: órgão e ano (ex.: "TRT · 2013")
  rc?: string // cargo da prova real
}

export interface Question extends RawQuestion {
  area: string
}

let cache: Question[] | null = null
let byId: Map<string, Question> | null = null

export async function loadQuestions(): Promise<Question[]> {
  if (cache) return cache
  const mods = import.meta.glob<{ default: RawQuestion[] }>('../data/questoes/*.json')
  const parts = await Promise.all(Object.values(mods).map((load) => load()))
  const all: Question[] = []
  for (const p of parts) {
    for (const q of p.default) {
      all.push({ ...q, area: q.a ?? q.m })
    }
  }
  cache = all
  byId = new Map(all.map((q) => [q.id, q]))
  return all
}

export function getQuestion(id: string): Question | undefined {
  return byId?.get(id)
}

// Questão real, já aplicada em prova da FCC (as demais são inéditas, no estilo FCC)
export const ehReal = (q?: Pick<Question, 'r'>) => !!q?.r

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Ordem de exibição das alternativas (embaralhada para não viciar a posição do gabarito)
export function randomOrder(): number[] {
  return shuffle([0, 1, 2, 3, 4])
}

export interface PickResult {
  ids: string[]
  repetidas: number // quantas tiveram de vir de questões já acertadas (banco esgotado)
  completadas: number // com “preferir”: quantas não eram preferidas e entraram só para completar
}

/**
 * Sorteia questões seguindo os slots, sem repetir questões já acertadas pelo usuário.
 * Para Conhecimentos Específicos, espalha as questões entre as áreas, priorizando as
 * áreas em que o usuário mais erra.
 */
export function pickQuestions(
  all: Question[],
  slots: Slot[],
  acertadas: Set<string>,
  excluir: Set<string> = new Set(),
  pesoArea: Record<string, number> = {},
  cargo: Cargo,
  preferir?: (q: Question) => boolean
): PickResult {
  const escolhidas: string[] = []
  const usados = new Set(excluir)
  let repetidas = 0
  let completadas = 0

  for (const slot of slots) {
    const mc = materiaDoCargo(cargo, slot.materia)
    if (!mc) continue
    const areas = slot.area === undefined ? undefined : Array.isArray(slot.area) ? slot.area : [slot.area]
    const pool = all.filter((q) => pertence(q, mc) && (!areas || areas.includes(q.area)) && !usados.has(q.id))
    const ineditas = pool.filter((q) => !acertadas.has(q.id))
    const jaAcertadas = pool.filter((q) => acertadas.has(q.id))
    // matéria com várias áreas (ex.: Específicos de TI): espalha entre as áreas, priorizando as que o aluno mais erra
    const espalhar = new Set(pool.map((q) => q.area)).size > 2 && !slot.area
    const sortear = (lista: Question[], n: number) => (espalhar ? spreadByArea(lista, n, pesoArea) : shuffle(lista).slice(0, n))

    // Com “preferir” (teste prova real): primeiro as preferidas, depois as outras só para completar
    const grupos = preferir
      ? [ineditas.filter(preferir), ineditas.filter((q) => !preferir(q))]
      : [ineditas]
    const pegas: Question[] = []
    for (const g of grupos) pegas.push(...sortear(g, slot.n - pegas.length))
    const repor = preferir
      ? [...shuffle(jaAcertadas.filter(preferir)), ...shuffle(jaAcertadas.filter((q) => !preferir(q)))]
      : shuffle(jaAcertadas)
    while (pegas.length < slot.n && repor.length) {
      pegas.push(repor.shift()!)
      repetidas++
    }
    if (preferir) completadas += pegas.filter((q) => !preferir(q)).length
    for (const q of pegas) {
      usados.add(q.id)
      escolhidas.push(q.id)
    }
  }
  return { ids: escolhidas, repetidas, completadas }
}

function spreadByArea(pool: Question[], n: number, peso: Record<string, number>): Question[] {
  const porArea = new Map<string, Question[]>()
  for (const q of shuffle(pool)) {
    if (!porArea.has(q.area)) porArea.set(q.area, [])
    porArea.get(q.area)!.push(q)
  }
  // ordem das áreas: sorteio ponderado (áreas com mais erros têm mais chance de vir primeiro)
  const areas = [...porArea.keys()]
    .map((a) => ({ a, k: Math.random() ** (1 / (1 + (peso[a] ?? 0))) }))
    .sort((x, y) => y.k - x.k)
    .map((x) => x.a)
  const out: Question[] = []
  while (out.length < n && areas.some((a) => porArea.get(a)!.length)) {
    for (const a of areas) {
      const lista = porArea.get(a)!
      if (lista.length && out.length < n) out.push(lista.shift()!)
    }
  }
  return out
}

export const LETRAS = ['A', 'B', 'C', 'D', 'E']

// Valor gravado quando o usuário escolhe “Não sei responder” (conta como erro)
export const NAO_SEI = -1
