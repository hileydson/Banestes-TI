// Valida o banco de questões: formato, ids únicos, gabarito, comentários.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'src/data/questoes'
const MATERIAS = ['POR', 'RLE', 'ATU', 'ETI', 'ESP']
const AREAS = { RLE: ['RL', 'EST'], ESP: ['PDS', 'GOV', 'PRG', 'BD', 'WEB', 'ARQ', 'DEV', 'SO', 'RED', 'SRV', 'SEG', 'NUV', 'ING'] }
const ids = new Set()
const cont = {}
let erros = 0
const err = (f, id, msg) => {
  erros++
  console.error(`✗ ${f} ${id ?? ''}: ${msg}`)
}
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  let arr
  try {
    arr = JSON.parse(readFileSync(join(dir, f), 'utf8'))
  } catch (e) {
    err(f, null, 'JSON inválido: ' + e.message)
    continue
  }
  for (const q of arr) {
    if (!q.id) err(f, null, 'sem id')
    if (ids.has(q.id)) err(f, q.id, 'id duplicado')
    ids.add(q.id)
    if (!MATERIAS.includes(q.m)) err(f, q.id, 'matéria inválida ' + q.m)
    if (AREAS[q.m] && !AREAS[q.m].includes(q.a)) err(f, q.id, 'área inválida ' + q.a)
    if (!q.q || !q.s || !q.e) err(f, q.id, 'faltando enunciado/assunto/explicação')
    if (!Array.isArray(q.o) || q.o.length !== 5) err(f, q.id, 'precisa de 5 alternativas')
    if (!Array.isArray(q.x) || q.x.length !== 5) err(f, q.id, 'precisa de 5 comentários')
    if (!(q.c >= 0 && q.c <= 4)) err(f, q.id, 'gabarito inválido')
    if (Array.isArray(q.o) && new Set(q.o).size !== q.o.length) err(f, q.id, 'alternativas repetidas')
    const k = q.a ? `${q.m}/${q.a}` : q.m
    cont[k] = (cont[k] ?? 0) + 1
  }
}
console.table(cont)
console.log(`Total: ${ids.size} questões. Erros: ${erros}`)
process.exit(erros ? 1 : 0)
