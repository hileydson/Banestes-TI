// Conteúdo de estudo: resumos por matéria e assunto, escritos em src/data/estudo/*.md
//
// Formato de cada arquivo .md:
//   # id-do-assunto | Título do assunto      (abre um assunto; o id não pode mudar, pois o progresso é salvo por ele)
//   Parágrafo com **negrito** e `código`.
//   ## Subtítulo
//   - item de lista
//   > Dica de prova (caixa de destaque)
import type { CargoId } from './cargos'

export interface Assunto {
  id: string
  titulo: string
  materia: string // id da matéria no perfil (cargos.ts)
  grupo: string // bloco do edital dentro da matéria
  corpo: string
}

type Arquivo = { arq: string; materia: string; grupo: string }

// Arquivos comuns aos dois perfis (o conteúdo programático é igual nos dois editais)
const PORTUGUES: Arquivo = { arq: 'por', materia: 'POR', grupo: 'Língua Portuguesa' }
const ATUALIDADES: Arquivo = { arq: 'atu', materia: 'ATU', grupo: 'Atualidades do mercado financeiro' }
const ETICA: Arquivo = { arq: 'eti', materia: 'ETI', grupo: 'Ética, compliance e ESG' }

// Ordem de exibição de cada perfil: arquivo -> matéria do perfil e bloco do edital
const ARQUIVOS: Record<CargoId, Arquivo[]> = {
  TI: [
    PORTUGUES,
    { arq: 'rle-logica', materia: 'RLE', grupo: 'Raciocínio lógico' },
    { arq: 'rle-matematica', materia: 'RLE', grupo: 'Matemática básica' },
    { arq: 'rle-estatistica', materia: 'RLE', grupo: 'Estatística e contagem' },
    { arq: 'rle-financeira', materia: 'RLE', grupo: 'Matemática financeira' },
    ATUALIDADES,
    ETICA,
    { arq: 'esp-pds', materia: 'ESP', grupo: 'Processo de desenvolvimento de software' },
    { arq: 'esp-gov', materia: 'ESP', grupo: 'Gestão e governança de TI' },
    { arq: 'esp-prg', materia: 'ESP', grupo: 'Programação' },
    { arq: 'esp-bd', materia: 'ESP', grupo: 'Banco de dados' },
    { arq: 'esp-web', materia: 'ESP', grupo: 'Desenvolvimento web e mobile' },
    { arq: 'esp-arq', materia: 'ESP', grupo: 'Arquitetura de sistemas' },
    { arq: 'esp-dev', materia: 'ESP', grupo: 'DevOps e DevSecOps' },
    { arq: 'esp-so', materia: 'ESP', grupo: 'Sistemas operacionais' },
    { arq: 'esp-red', materia: 'ESP', grupo: 'Redes de computadores' },
    { arq: 'esp-srv', materia: 'ESP', grupo: 'Serviços e gerenciamento de redes' },
    { arq: 'esp-seg', materia: 'ESP', grupo: 'Segurança da informação' },
    { arq: 'esp-nuv', materia: 'ESP', grupo: 'Computação em nuvem' },
    { arq: 'esp-ing', materia: 'ESP', grupo: 'Inglês técnico' }
  ],
  TB: [
    PORTUGUES,
    { arq: 'rle-logica', materia: 'RLQ', grupo: 'Raciocínio lógico' },
    { arq: 'rle-matematica', materia: 'RLQ', grupo: 'Matemática básica' },
    { arq: 'rle-estatistica', materia: 'RLQ', grupo: 'Estatística e contagem' },
    ATUALIDADES,
    ETICA,
    { arq: 'ban', materia: 'BAN', grupo: 'Conhecimentos bancários e securitários' },
    { arq: 'ven', materia: 'VEN', grupo: 'Vendas, negociação e atendimento' },
    { arq: 'rle-financeira', materia: 'MFI', grupo: 'Matemática financeira' },
    { arq: 'pes', materia: 'PES', grupo: 'Probabilidade e estatística' },
    { arq: 'inf', materia: 'INF', grupo: 'Informática e comportamentos digitais' }
  ]
}

const cache: Partial<Record<CargoId, Assunto[]>> = {}

export async function loadEstudo(cargo: CargoId): Promise<Assunto[]> {
  if (cache[cargo]) return cache[cargo]!
  const mods = import.meta.glob<string>('../data/estudo/*.md', { query: '?raw', import: 'default' })
  const textos = await Promise.all(
    ARQUIVOS[cargo].map(async (f) => {
      const load = mods[`../data/estudo/${f.arq}.md`]
      return { f, texto: load ? await load() : '' }
    })
  )
  const out: Assunto[] = []
  for (const { f, texto } of textos) out.push(...parseArquivo(texto, f.materia, f.grupo))
  cache[cargo] = out
  return out
}

function parseArquivo(texto: string, materia: string, grupo: string): Assunto[] {
  const out: Assunto[] = []
  let atual: Assunto | null = null
  const linhas: string[] = []
  const fecha = () => {
    if (atual) out.push({ ...atual, corpo: linhas.join('\n').trim() })
    linhas.length = 0
  }
  for (const l of texto.split('\n')) {
    const m = /^# ([a-z0-9-]+) \| (.+)$/.exec(l.trim())
    if (m) {
      fecha()
      atual = { id: m[1], titulo: m[2].trim(), materia, grupo, corpo: '' }
    } else if (atual) linhas.push(l)
  }
  fecha()
  return out
}

/* ------------------------------------------------------------------ */
/* Blocos do texto (para exibir e para a leitura em voz)               */
/* ------------------------------------------------------------------ */
export type Bloco = { tipo: 'h'; texto: string } | { tipo: 'p'; texto: string } | { tipo: 'dica'; texto: string } | { tipo: 'lista'; itens: string[] }

export function blocos(corpo: string): Bloco[] {
  const out: Bloco[] = []
  let par: string[] = []
  let lista: string[] | null = null
  const fechaPar = () => {
    if (par.length) out.push({ tipo: 'p', texto: par.join(' ') })
    par = []
  }
  const fechaLista = () => {
    if (lista) out.push({ tipo: 'lista', itens: lista })
    lista = null
  }
  for (const bruto of corpo.split('\n')) {
    const l = bruto.trim()
    if (!l) {
      fechaPar()
      fechaLista()
    } else if (l.startsWith('## ')) {
      fechaPar()
      fechaLista()
      out.push({ tipo: 'h', texto: l.slice(3) })
    } else if (l.startsWith('> ')) {
      fechaPar()
      fechaLista()
      out.push({ tipo: 'dica', texto: l.slice(2) })
    } else if (l.startsWith('- ')) {
      fechaPar()
      ;(lista ??= []).push(l.slice(2))
    } else if (lista) {
      // continuação do item anterior
      lista[lista.length - 1] += ' ' + l
    } else par.push(l)
  }
  fechaPar()
  fechaLista()
  return out
}

/* ------------------------------------------------------------------ */
/* Texto para a voz: trechos curtos (o Chrome corta falas longas)       */
/* ------------------------------------------------------------------ */
export interface Trecho {
  texto: string
  bloco: number // índice do bloco exibido (para destacar o que está sendo lido)
}

const TROCAS: [RegExp, string][] = [
  [/\*\*|`/g, ''],
  [/\bex\.:/gi, 'por exemplo:'],
  [/\bex\./gi, 'por exemplo'],
  [/\be\.g\./gi, 'por exemplo'],
  [/\bi\.e\./gi, 'isto é'],
  [/→|=>/g, ', que leva a '],
  [/←/g, ' vem de '],
  [/≥/g, ' maior ou igual a '],
  [/≤/g, ' menor ou igual a '],
  [/≠/g, ' diferente de '],
  [/×|·/g, ' vezes '],
  [/÷/g, ' dividido por '],
  [/\^/g, ' elevado a '],
  [/√/g, ' raiz de '],
  [/\bvs\.?\b/gi, 'versus'],
  [/\s+/g, ' ']
]

export function textoFalado(s: string): string {
  let t = s
  for (const [re, rep] of TROCAS) t = t.replace(re, rep)
  return t.trim()
}

const MAX_TRECHO = 220

function quebra(frase: string): string[] {
  if (frase.length <= MAX_TRECHO) return [frase]
  const partes: string[] = []
  let atual = ''
  for (const p of frase.split(/(?<=[,;:])\s+/)) {
    if ((atual + ' ' + p).trim().length > MAX_TRECHO && atual) {
      partes.push(atual.trim())
      atual = p
    } else atual = (atual + ' ' + p).trim()
  }
  if (atual) partes.push(atual.trim())
  // ainda grande demais (sem vírgulas): corta por palavras
  return partes.flatMap((p) => {
    if (p.length <= MAX_TRECHO) return [p]
    const out: string[] = []
    let a = ''
    for (const w of p.split(' ')) {
      if ((a + ' ' + w).length > MAX_TRECHO && a) {
        out.push(a)
        a = w
      } else a = a ? a + ' ' + w : w
    }
    if (a) out.push(a)
    return out
  })
}

export function trechosParaFala(titulo: string, bs: Bloco[]): Trecho[] {
  const out: Trecho[] = [{ texto: textoFalado(titulo) + '.', bloco: -1 }]
  const add = (texto: string, bloco: number) => {
    const t = textoFalado(texto)
    if (!t) return
    const frases = t.split(/(?<=[.!?])\s+/)
    for (const f of frases) for (const q of quebra(f)) out.push({ texto: q, bloco })
  }
  bs.forEach((b, i) => {
    if (b.tipo === 'lista') b.itens.forEach((it) => add(/[.!?:]$/.test(it) ? it : it + '.', i))
    else if (b.tipo === 'h') add(b.texto + '.', i)
    else if (b.tipo === 'dica') add('Dica de prova: ' + b.texto, i)
    else add(b.texto, i)
  })
  return out
}
