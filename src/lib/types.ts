import type { MateriaId } from './materias'

export interface AppUser {
  uid: string
  provider: 'google' | 'password' | 'local'
  username?: string
  email?: string | null
  displayName?: string | null
}

export interface Score {
  a: number // acertos
  e: number // erros
}

export interface Profile {
  uid: string
  nickname: string
  stats: Partial<Record<MateriaId, Score>>
  areaStats: Record<string, Score>
  pontos: number // soma de acertos (todas as atividades)
  testes: number
  provas: number
  melhorNotaProva: number
  somaNotasProvas: number
  ultimaNotaProva?: number
  createdAt: number
  updatedAt: number
}

export interface Progress {
  correct: string[]
  wrongCount: Record<string, number>
}

export interface Attempt {
  id: string
  tipo: 'teste' | 'prova'
  data: number
  total: number
  acertos: number
  porMateria: Partial<Record<MateriaId, Score>>
  nota?: number
  duracaoSeg?: number
}

export interface ExamQuestion {
  id: string
  ordem: number[]
}

export interface ExamSection {
  id: string
  titulo: string
  grupo: 'CG' | 'CE'
  questoes: ExamQuestion[]
}

export interface ExamResult {
  acertosCG: number
  totalCG: number
  acertosCE: number
  totalCE: number
  notaCG: number
  notaCE: number
  notaFinal: number
  aprovado: boolean
}

export interface ExamState {
  id: string
  numero: number
  status: 'andamento' | 'concluida'
  secoes: ExamSection[]
  respostas: Record<string, number> // id da questão -> índice ORIGINAL da alternativa marcada
  secaoAtual: number
  indiceAtual: number
  elapsed: number // segundos
  startedAt: number
  updatedAt: number
  finishedAt?: number
  resultado?: ExamResult
}

export function emptyProfile(uid: string, nickname: string): Profile {
  const now = Date.now()
  return {
    uid,
    nickname,
    stats: {},
    areaStats: {},
    pontos: 0,
    testes: 0,
    provas: 0,
    melhorNotaProva: 0,
    somaNotasProvas: 0,
    createdAt: now,
    updatedAt: now
  }
}
