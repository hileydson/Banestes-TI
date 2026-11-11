// Matérias exatamente como no edital (Concurso Banestes 01/2027 – FCC)
// Cargo 04 – Analista de TI – Desenvolvimento de Sistemas

export type MateriaId = 'POR' | 'RLE' | 'ATU' | 'ETI' | 'ESP'

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
  { id: 'ESP', nome: 'Conhecimentos Específicos', curto: 'Específicos', grupo: 'Conhecimentos Específicos', questoesProvaReal: 50, cor: '#f472b6' }
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

// Composição do teste rápido (12 questões)
export interface Slot {
  materia: MateriaId
  area?: string
  n: number
}

export const TESTE_RAPIDO: Slot[] = [
  { materia: 'POR', n: 2 },
  { materia: 'RLE', area: 'RL', n: 2 },
  { materia: 'RLE', area: 'EST', n: 1 },
  { materia: 'ATU', n: 1 },
  { materia: 'ETI', n: 1 },
  { materia: 'ESP', n: 5 }
]

// Simulado: metade da prova real (30 gerais + 50 específicas => 15 + 25)
export interface SecaoProva {
  id: string
  titulo: string
  grupo: 'CG' | 'CE'
  slots: Slot[]
}

export const SECOES_PROVA: SecaoProva[] = [
  { id: 's1', titulo: 'Língua Portuguesa', grupo: 'CG', slots: [{ materia: 'POR', n: 5 }] },
  {
    id: 's2',
    titulo: 'Raciocínio Lógico e Estatística',
    grupo: 'CG',
    slots: [
      { materia: 'RLE', area: 'RL', n: 3 },
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
]

export const TEMPO_REFERENCIA_PROVA_SEG = 2 * 60 * 60 // metade das 4h do edital
