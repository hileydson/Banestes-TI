// Matérias do banco de questões (cada questão pertence a uma). Cada perfil/cargo (ver cargos.ts)
// monta as suas matérias a partir destas: Analista de TI (edital 01/2027) e Técnico Bancário (edital 01/2026).

export type MateriaId = 'POR' | 'RLE' | 'ATU' | 'ETI' | 'ESP' | 'BAN' | 'VEN' | 'INF' | 'PES'

export interface Materia {
  id: MateriaId
  nome: string
  curto: string
  grupo: 'Conhecimentos Gerais' | 'Conhecimentos Específicos'
  questoesProvaReal: number
  cor: string
}

export const MATERIAS: Materia[] = [
  { id: 'POR', nome: 'Língua Portuguesa', curto: 'Português', grupo: 'Conhecimentos Gerais', questoesProvaReal: 10, cor: '#60a5fa' },
  { id: 'RLE', nome: 'Raciocínio Lógico e Estatística', curto: 'Rac. Lógico e Estat.', grupo: 'Conhecimentos Gerais', questoesProvaReal: 10, cor: '#f59e0b' },
  { id: 'ATU', nome: 'Atualidades do Mercado Financeiro e Digital', curto: 'Atualidades', grupo: 'Conhecimentos Gerais', questoesProvaReal: 5, cor: '#a78bfa' },
  { id: 'ETI', nome: 'Ética, Compliance e ESG', curto: 'Ética e ESG', grupo: 'Conhecimentos Gerais', questoesProvaReal: 5, cor: '#34d399' },
  { id: 'ESP', nome: 'Conhecimentos Específicos', curto: 'Específicos', grupo: 'Conhecimentos Específicos', questoesProvaReal: 50, cor: '#f472b6' },
  // Técnico Bancário
  { id: 'BAN', nome: 'Conhecimentos Bancários e Securitários', curto: 'Bancários', grupo: 'Conhecimentos Específicos', questoesProvaReal: 15, cor: '#f472b6' },
  { id: 'VEN', nome: 'Vendas, Negociação e Atendimento', curto: 'Vendas', grupo: 'Conhecimentos Específicos', questoesProvaReal: 10, cor: '#fb923c' },
  { id: 'INF', nome: 'Noções de Informática e Comportamentos Digitais', curto: 'Informática', grupo: 'Conhecimentos Específicos', questoesProvaReal: 5, cor: '#22d3ee' },
  { id: 'PES', nome: 'Noções de Probabilidade e Estatística', curto: 'Probabilidade', grupo: 'Conhecimentos Específicos', questoesProvaReal: 5, cor: '#e879f9' }
]

export const MATERIA_BY_ID = Object.fromEntries(MATERIAS.map((m) => [m.id, m])) as Record<MateriaId, Materia>

// Áreas (sub-tópicos) — também seguem os blocos do edital
export interface Area {
  id: string
  materia: MateriaId
  nome: string
}

export const AREAS: Area[] = [
  { id: 'RL', materia: 'RLE', nome: 'Raciocínio Lógico e Matemática' },
  { id: 'EST', materia: 'RLE', nome: 'Estatística' },
  { id: 'MF', materia: 'RLE', nome: 'Matemática financeira' },
  { id: 'PDS', materia: 'ESP', nome: 'Processo de desenvolvimento de software' },
  { id: 'GOV', materia: 'ESP', nome: 'Gestão e Governança de TI' },
  { id: 'PRG', materia: 'ESP', nome: 'Programação' },
  { id: 'BD', materia: 'ESP', nome: 'Banco de Dados' },
  { id: 'WEB', materia: 'ESP', nome: 'Desenvolvimento web e mobile' },
  { id: 'ARQ', materia: 'ESP', nome: 'Arquitetura de sistemas' },
  { id: 'DEV', materia: 'ESP', nome: 'DevOps e DevSecOps' },
  { id: 'SO', materia: 'ESP', nome: 'Sistemas Operacionais' },
  { id: 'RED', materia: 'ESP', nome: 'Redes de computadores' },
  { id: 'SRV', materia: 'ESP', nome: 'Serviços e gerenciamento de redes' },
  { id: 'SEG', materia: 'ESP', nome: 'Segurança da Informação' },
  { id: 'NUV', materia: 'ESP', nome: 'Computação em nuvem, Git e Kubernetes' },
  { id: 'ING', materia: 'ESP', nome: 'Inglês técnico' }
]

export const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<string, Area>

// Sorteio: "materia" é o id da matéria do perfil (cargos.ts); "area" restringe a uma ou mais áreas
export interface Slot {
  materia: string
  area?: string | string[]
  n: number
}

export const TEMPO_REFERENCIA_PROVA_SEG = 2 * 60 * 60 // metade das 4h do edital
