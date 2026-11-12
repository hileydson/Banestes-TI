// Perfis do app: cada um é um cargo do concurso, com suas matérias, teste rápido, simulado e conteúdo de estudo.
// - TI: Analista de TI – Desenvolvimento de Sistemas (Edital 01/2027)
// - TB: Técnico Bancário (Edital 01/2026)
import { MATERIA_BY_ID, type MateriaId, type Slot } from './materias'
import type { Question } from './questions'
import type { Profile, Score } from './types'

export type CargoId = 'TI' | 'TB'

// Matéria do jeito que aparece para o perfil. As questões vêm da matéria "m" do banco,
// opcionalmente só de algumas áreas (ex.: Matemática Financeira = área MF de RLE).
export interface MateriaCargo {
  id: string
  nome: string
  curto: string
  cor: string
  grupo: 'Conhecimentos Gerais' | 'Conhecimentos Específicos'
  questoesProvaReal: number
  m: MateriaId
  areas?: string[]
}

export interface SecaoProva {
  id: string
  titulo: string
  grupo: 'CG' | 'CE'
  slots: Slot[]
}

export interface Cargo {
  id: CargoId
  nome: string
  curto: string
  edital: string
  descricao: string
  materias: MateriaCargo[]
  testeRapido: Slot[]
  testeRapidoTexto: string
  secoesProva: SecaoProva[]
  provaTexto: string
  materiaComAreas?: string // matéria cujo gráfico por área aparece em Resultados
}

// Matéria do perfil igual à do banco
const doBanco = (m: MateriaId, extra: Partial<MateriaCargo> = {}): MateriaCargo => {
  const b = MATERIA_BY_ID[m]
  return { id: m, nome: b.nome, curto: b.curto, cor: b.cor, grupo: b.grupo, questoesProvaReal: b.questoesProvaReal, m, ...extra }
}

const TI: Cargo = {
  id: 'TI',
  nome: 'Analista de TI – Desenvolvimento de Sistemas',
  curto: 'Analista de Sistemas',
  edital: 'Edital 01/2027',
  descricao: 'Nível superior. 30 questões de Conhecimentos Gerais e 50 de Conhecimentos Específicos de TI.',
  materias: [doBanco('POR'), doBanco('RLE'), doBanco('ATU'), doBanco('ETI'), doBanco('ESP')],
  testeRapido: [
    { materia: 'POR', n: 2 },
    { materia: 'RLE', area: ['RL', 'MF'], n: 2 },
    { materia: 'RLE', area: 'EST', n: 1 },
    { materia: 'ATU', n: 1 },
    { materia: 'ETI', n: 1 },
    { materia: 'ESP', n: 5 }
  ],
  testeRapidoTexto: '2 Português · 2 Raciocínio Lógico · 1 Estatística · 1 Atualidades · 1 Ética/ESG · 5 Específicas',
  secoesProva: [
    { id: 's1', titulo: 'Língua Portuguesa', grupo: 'CG', slots: [{ materia: 'POR', n: 5 }] },
    {
      id: 's2',
      titulo: 'Raciocínio Lógico e Estatística',
      grupo: 'CG',
      slots: [
        { materia: 'RLE', area: ['RL', 'MF'], n: 3 },
        { materia: 'RLE', area: 'EST', n: 2 }
      ]
    },
    {
      id: 's3',
      titulo: 'Atualidades, Ética, Compliance e ESG',
      grupo: 'CG',
      slots: [
        { materia: 'ATU', n: 3 },
        { materia: 'ETI', n: 2 }
      ]
    },
    { id: 's4', titulo: 'Conhecimentos Específicos – Parte 1', grupo: 'CE', slots: [{ materia: 'ESP', n: 13 }] },
    { id: 's5', titulo: 'Conhecimentos Específicos – Parte 2', grupo: 'CE', slots: [{ materia: 'ESP', n: 12 }] }
  ],
  provaTexto:
    '15 questões de Conhecimentos Gerais (5 Português, 5 Raciocínio Lógico e Estatística, 3 Atualidades, 2 Ética/ESG) e 25 de Conhecimentos Específicos',
  materiaComAreas: 'ESP'
}

const TB: Cargo = {
  id: 'TB',
  nome: 'Técnico Bancário',
  curto: 'Técnico Bancário',
  edital: 'Edital 01/2026',
  descricao: 'Nível médio. 30 questões de Conhecimentos Gerais e 40 de Conhecimentos Específicos (bancários, vendas, matemática financeira, estatística e informática).',
  materias: [
    doBanco('POR'),
    {
      id: 'RLQ',
      nome: 'Matemática/Raciocínio Lógico e Quantitativo',
      curto: 'Raciocínio Lógico',
      cor: '#f59e0b',
      grupo: 'Conhecimentos Gerais',
      questoesProvaReal: 10,
      m: 'RLE',
      areas: ['RL', 'EST']
    },
    doBanco('ATU', { nome: 'Atualidades do Mercado Financeiro' }),
    doBanco('ETI'),
    doBanco('BAN'),
    doBanco('VEN'),
    { id: 'MFI', nome: 'Matemática Financeira', curto: 'Mat. Financeira', cor: '#facc15', grupo: 'Conhecimentos Específicos', questoesProvaReal: 5, m: 'RLE', areas: ['MF'] },
    doBanco('PES'),
    doBanco('INF')
  ],
  testeRapido: [
    { materia: 'POR', n: 2 },
    { materia: 'RLQ', n: 2 },
    { materia: 'ATU', n: 1 },
    { materia: 'ETI', n: 1 },
    { materia: 'BAN', n: 2 },
    { materia: 'VEN', n: 1 },
    { materia: 'MFI', n: 1 },
    { materia: 'PES', n: 1 },
    { materia: 'INF', n: 1 }
  ],
  testeRapidoTexto: '2 Português · 2 Raciocínio Lógico · 1 Atualidades · 1 Ética/ESG · 2 Bancários · 1 Vendas · 1 Mat. Financeira · 1 Probabilidade · 1 Informática',
  secoesProva: [
    { id: 's1', titulo: 'Língua Portuguesa', grupo: 'CG', slots: [{ materia: 'POR', n: 5 }] },
    {
      id: 's2',
      titulo: 'Matemática/Raciocínio Lógico e Quantitativo',
      grupo: 'CG',
      slots: [
        { materia: 'RLQ', area: 'RL', n: 3 },
        { materia: 'RLQ', area: 'EST', n: 2 }
      ]
    },
    {
      id: 's3',
      titulo: 'Atualidades, Ética, Compliance e ESG',
      grupo: 'CG',
      slots: [
        { materia: 'ATU', n: 3 },
        { materia: 'ETI', n: 2 }
      ]
    },
    {
      id: 's4',
      titulo: 'Conhecimentos Bancários e Vendas',
      grupo: 'CE',
      slots: [
        { materia: 'BAN', n: 8 },
        { materia: 'VEN', n: 5 }
      ]
    },
    {
      id: 's5',
      titulo: 'Matemática Financeira, Estatística e Informática',
      grupo: 'CE',
      slots: [
        { materia: 'MFI', n: 3 },
        { materia: 'PES', n: 2 },
        { materia: 'INF', n: 2 }
      ]
    }
  ],
  provaTexto:
    '15 questões de Conhecimentos Gerais (5 Português, 5 Raciocínio Lógico, 3 Atualidades, 2 Ética/ESG) e 20 de Conhecimentos Específicos (8 Bancários, 5 Vendas, 3 Mat. Financeira, 2 Probabilidade e Estatística, 2 Informática)'
}

export const CARGOS: Record<CargoId, Cargo> = { TI, TB }
export const LISTA_CARGOS: Cargo[] = [TI, TB]

// Perfis antigos (antes da escolha de cargo) são de Analista de TI
export const cargoDoPerfil = (p?: Pick<Profile, 'cargo'> | null): Cargo => CARGOS[p?.cargo ?? 'TI'] ?? TI

export function materiaDoCargo(cargo: Cargo, id: string): MateriaCargo | undefined {
  return cargo.materias.find((m) => m.id === id)
}

export function pertence(q: Question, mc: MateriaCargo): boolean {
  return q.m === mc.m && (!mc.areas || mc.areas.includes(q.area))
}

// Em qual matéria do perfil a questão entra (para o selo colorido na questão)
export function materiaDaQuestao(q: Question, cargo: Cargo): MateriaCargo | undefined {
  return cargo.materias.find((mc) => pertence(q, mc))
}

// Acertos/erros do aluno numa matéria do perfil (matéria inteira: stats; recorte por área: soma das áreas)
export function scoreMateria(p: Profile, mc: MateriaCargo): Score {
  if (!mc.areas) return p.stats[mc.m] ?? { a: 0, e: 0 }
  let a = 0,
    e = 0
  for (const ar of mc.areas) {
    a += p.areaStats[ar]?.a ?? 0
    e += p.areaStats[ar]?.e ?? 0
  }
  return { a, e }
}

export function totaisCargo(p: Profile, cargo: Cargo): Score {
  let a = 0,
    e = 0
  for (const mc of cargo.materias) {
    const s = scoreMateria(p, mc)
    a += s.a
    e += s.e
  }
  return { a, e }
}

// Pontos do perfil = acertos nas matérias do cargo
export const pontosCargo = (p: Profile, cargo: Cargo) => totaisCargo(p, cargo).a
