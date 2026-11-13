import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Award, Crown, FileText, Medal, Trophy } from 'lucide-react'
import { useSession } from '../lib/session'
import { cargoDoPerfil, CARGOS, materiaDoCargo, scoreMateria, type Cargo, type CargoId } from '../lib/cargos'
import { totaisPorMateria, zeradasValidas } from '../lib/zeradas'
import { fmtPct, pct, total } from '../lib/insights'
import type { Profile } from '../lib/types'

const MIN_QUESTOES_MATERIA = 5
const NOTA_MINIMA = 6 // edital, item 11.3

export default function Ranking() {
  const { backend, user, questions, cargo } = useSession()
  const [perfis, setPerfis] = useState<Profile[] | null>(null)
  useEffect(() => {
    backend?.listProfiles().then(setPerfis)
  }, [backend])

  if (!perfis) return <p className="muted">Carregando ranking…</p>

  // Ranking único com todos os participantes, dos dois perfis: pontos = total de acertos, sem peso
  const todos = perfis
  const pts = (p: Profile) => p.pontos
  const geralPct = (p: Profile) => pctGeral(p)
  const respondidas = (p: Profile) => {
    const t = totaisGerais(p)
    return t.a + t.e
  }

  // Desempate: melhor aproveitamento; depois quem respondeu menos questões; depois o apelido
  const geral = [...todos]
    .sort((a, b) => pts(b) - pts(a) || geralPct(b) - geralPct(a) || respondidas(a) - respondidas(b) || a.nickname.localeCompare(b.nickname))
    .slice(0, 20)
  // Selo de matéria zerada: vale conforme o perfil de cada participante
  const totaisPorCargo = {} as Partial<Record<CargoId, Record<string, number>>>
  const zer = (p: Profile) => {
    const c = cargoDoPerfil(p)
    const tot = (totaisPorCargo[c.id] ??= totaisPorMateria(questions, c))
    return zeradasValidas(p.zeradas, tot, c)
  }
  const maisProvas = [...todos].filter((p) => p.provas > 0).sort((a, b) => b.provas - a.provas).slice(0, 10)
  // Top provas: maior nota de cada pessoa em uma prova (desempate: soma das notas)
  const topProvas = [...todos]
    .filter((p) => p.provas > 0)
    .sort((a, b) => b.melhorNotaProva - a.melhorNotaProva || b.somaNotasProvas - a.somaNotasProvas)
    .slice(0, 20)
  const somaProvas = [...todos].filter((p) => p.provas > 0).sort((a, b) => b.somaNotasProvas - a.somaNotasProvas).slice(0, 10)

  return (
    <div className="ranking">
      <h2 className="page-title">
        <Trophy /> Ranking
      </h2>
      <p className="muted small">
        Todos os participantes, dos dois perfis (Analista de Sistemas e Técnico Bancário). Pontos = total de acertos, sem peso.
      </p>

      <div className="glass rank-card">
        <h3>
          <Crown size={18} /> Top 20 geral (pontos = acertos)
        </h3>
        <p className="muted small">Empate em pontos: fica na frente quem tem o melhor aproveitamento (%). 🏆 = matéria zerada.</p>
        {geral.length >= 3 && (
          <div className="podium">
            {[1, 0, 2].map((pos) => {
              const p = geral[pos]
              return (
                <motion.div
                  key={p.uid}
                  className={'podium-col p' + (pos + 1)}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ delay: 0.2 + pos * 0.15 }}
                >
                  <div className="podium-top" style={{ animationDelay: `${pos * 0.35}s` }}>
                    <span className="podium-medal">{pos === 0 ? '👑' : pos === 1 ? '🥈' : '🥉'}</span>
                    <div className="avatar lg">{p.nickname[0]?.toUpperCase()}</div>
                  </div>
                  <strong>{p.nickname}</strong>
                  <small>{pts(p)} pts</small>
                  <PerfilTag p={p} />
                  <SelosZerada ids={zer(p)} cargo={cargoDoPerfil(p)} />
                  <div className="podium-base">
                    <span>{pos + 1}º</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        <ol className="rank-list">
          {geral.map((p, i) => (
            <motion.li
              key={p.uid}
              className={p.uid === user?.uid ? 'me' : ''}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <span className="pos">{i + 1}</span>
              <span className="name">{p.nickname}</span>
              <PerfilTag p={p} />
              <SelosZerada ids={zer(p)} cargo={cargoDoPerfil(p)} />
              <span className="muted">{fmtPct(geralPct(p))}</span>
              <b>{pts(p)}</b>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="glass rank-card">
        <h3>
          <Award size={18} /> Top provas (maior nota de cada um)
        </h3>
        <p className="muted small">
          Nota como no edital: (Gerais + 2 × Específicos) ÷ 3. Aprovado com {NOTA_MINIMA.toFixed(2).replace('.', ',')} ou mais.
        </p>
        {topProvas.length === 0 && <p className="muted small">Nenhuma prova concluída ainda.</p>}
        <ol className="rank-list">
          {topProvas.map((p, i) => {
            const passou = p.melhorNotaProva >= NOTA_MINIMA
            return (
              <motion.li
                key={p.uid}
                className={p.uid === user?.uid ? 'me' : ''}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <span className="pos">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                <span className="name">{p.nickname}</span>
                <span className={'badge rank-status ' + (passou ? 'ok' : 'err')}>{passou ? 'Aprovado' : 'Abaixo de 6'}</span>
                <span className="muted small rank-provas">
                  {p.provas} {p.provas === 1 ? 'prova' : 'provas'}
                </span>
                <b className={passou ? 'txt-ok' : 'txt-err'}>{p.melhorNotaProva.toFixed(2)}</b>
              </motion.li>
            )
          })}
        </ol>
      </div>

      <h3 className="sub-title">
        <Medal size={18} /> Melhor em cada matéria
      </h3>
      <p className="muted small">Aproveitamento = acertos ÷ questões feitas na matéria (mínimo {MIN_QUESTOES_MATERIA} questões).</p>
      <div className="rank-grid">
        {cargo.materias.map((m, idx) => {
          const sc = (p: Profile) => scoreMateria(p, m)
          const lista = todos
            .filter((p) => total(sc(p)) >= MIN_QUESTOES_MATERIA)
            .sort((a, b) => pct(sc(b)) - pct(sc(a)) || total(sc(b)) - total(sc(a)))
            .slice(0, 5)
          return (
            <motion.div key={m.id} className="glass rank-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}>
              <h4 style={{ color: m.cor }}>{m.nome}</h4>
              {lista.length === 0 && <p className="muted small">Ninguém atingiu o mínimo ainda.</p>}
              <ol className="rank-list compact">
                {lista.map((p, i) => (
                  <li key={p.uid} className={p.uid === user?.uid ? 'me' : ''}>
                    <span className="pos">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                    <span className="name">{p.nickname}</span>
                    {zer(p).includes(m.id) && (
                      <span className="selo-zerada" style={{ borderColor: m.cor, color: m.cor }} title="Acertou todas as questões desta matéria">
                        🏆 zerou
                      </span>
                    )}
                    <span className="muted">{total(sc(p))} q.</span>
                    <b>{fmtPct(pct(sc(p)))}</b>
                  </li>
                ))}
              </ol>
            </motion.div>
          )
        })}
      </div>

      <div className="rank-grid">
        <ListaSimples titulo="Quem mais fez provas" icon={<FileText size={18} />} lista={maisProvas} valor={(p) => `${p.provas}`} me={user?.uid} />
        <ListaSimples titulo="Maior pontuação somada em provas" icon={<Trophy size={18} />} lista={somaProvas} valor={(p) => p.somaNotasProvas.toFixed(2)} me={user?.uid} />
      </div>
    </div>
  )
}

// Selo “matéria zerada”: acertou todas as questões existentes da matéria
// Perfil do participante (cargo), para saber de qual edital ele é
function PerfilTag({ p }: { p: Profile }) {
  const c = cargoDoPerfil(p)
  return (
    <span className={'perfil-tag ' + c.id.toLowerCase()} title={CARGOS[c.id].nome}>
      {c.id === 'TB' ? 'Técnico' : 'Analista'}
    </span>
  )
}

function SelosZerada({ ids, cargo }: { ids: string[]; cargo: Cargo }) {
  if (!ids.length) return null
  return (
    <span className="selos-zerada">
      {ids.map((id) => {
        const m = materiaDoCargo(cargo, id)
        if (!m) return null
        return (
          <span key={id} className="selo-zerada" style={{ borderColor: m.cor, color: m.cor }} title={`Zerou ${m.nome}`}>
            🏆<span className="selo-txt"> {m.curto}</span>
          </span>
        )
      })}
    </span>
  )
}

function totaisGerais(p: Profile) {
  let a = 0,
    e = 0
  for (const s of Object.values(p.stats)) {
    a += s?.a ?? 0
    e += s?.e ?? 0
  }
  return { a, e }
}

function pctGeral(p: Profile) {
  const { a, e } = totaisGerais(p)
  return a + e ? (a / (a + e)) * 100 : 0
}

function ListaSimples({ titulo, icon, lista, valor, me }: { titulo: string; icon: React.ReactNode; lista: Profile[]; valor(p: Profile): string; me?: string }) {
  return (
    <motion.div className="glass rank-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <h4>
        {icon} {titulo}
      </h4>
      {lista.length === 0 && <p className="muted small">Nenhuma prova concluída ainda.</p>}
      <ol className="rank-list compact">
        {lista.map((p, i) => (
          <li key={p.uid} className={p.uid === me ? 'me' : ''}>
            <span className="pos">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
            <span className="name">{p.nickname}</span>
            <b>{valor(p)}</b>
          </li>
        ))}
      </ol>
    </motion.div>
  )
}
