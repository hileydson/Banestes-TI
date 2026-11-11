import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Award, Crown, FileText, Medal, Trophy } from 'lucide-react'
import { useSession } from '../lib/session'
import { MATERIAS } from '../lib/materias'
import { fmtPct, pct, total } from '../lib/insights'
import type { Profile } from '../lib/types'

const MIN_QUESTOES_MATERIA = 5

export default function Ranking() {
  const { backend, user } = useSession()
  const [perfis, setPerfis] = useState<Profile[] | null>(null)
  useEffect(() => {
    backend?.listProfiles().then(setPerfis)
  }, [backend])

  if (!perfis) return <p className="muted">Carregando ranking…</p>

  const geral = [...perfis].sort((a, b) => b.pontos - a.pontos).slice(0, 20)
  const maisProvas = [...perfis].filter((p) => p.provas > 0).sort((a, b) => b.provas - a.provas).slice(0, 10)
  const melhorNota = [...perfis].filter((p) => p.provas > 0).sort((a, b) => b.melhorNotaProva - a.melhorNotaProva).slice(0, 10)
  const somaProvas = [...perfis].filter((p) => p.provas > 0).sort((a, b) => b.somaNotasProvas - a.somaNotasProvas).slice(0, 10)

  return (
    <div className="ranking">
      <h2 className="page-title">
        <Trophy /> Ranking
      </h2>

      <div className="glass rank-card">
        <h3>
          <Crown size={18} /> Top 20 geral (pontos = acertos)
        </h3>
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
                  <div className="avatar lg">{p.nickname[0]?.toUpperCase()}</div>
                  <strong>{p.nickname}</strong>
                  <small>{p.pontos} pts</small>
                  <div className="podium-base">{pos + 1}º</div>
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
              <span className="muted">{fmtPct(geralPct(p))}</span>
              <b>{p.pontos}</b>
            </motion.li>
          ))}
        </ol>
      </div>

      <h3 className="sub-title">
        <Medal size={18} /> Melhor em cada matéria
      </h3>
      <p className="muted small">Aproveitamento = acertos ÷ questões feitas na matéria (mínimo {MIN_QUESTOES_MATERIA} questões).</p>
      <div className="rank-grid">
        {MATERIAS.map((m, idx) => {
          const lista = perfis
            .filter((p) => total(p.stats[m.id]) >= MIN_QUESTOES_MATERIA)
            .sort((a, b) => pct(b.stats[m.id]) - pct(a.stats[m.id]) || total(b.stats[m.id]) - total(a.stats[m.id]))
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
                    <span className="muted">{total(p.stats[m.id])} q.</span>
                    <b>{fmtPct(pct(p.stats[m.id]))}</b>
                  </li>
                ))}
              </ol>
            </motion.div>
          )
        })}
      </div>

      <div className="rank-grid">
        <ListaSimples titulo="Quem mais fez provas" icon={<FileText size={18} />} lista={maisProvas} valor={(p) => `${p.provas}`} me={user?.uid} />
        <ListaSimples titulo="Maior nota em uma prova" icon={<Award size={18} />} lista={melhorNota} valor={(p) => p.melhorNotaProva.toFixed(2)} me={user?.uid} />
        <ListaSimples titulo="Maior pontuação somada em provas" icon={<Trophy size={18} />} lista={somaProvas} valor={(p) => p.somaNotasProvas.toFixed(2)} me={user?.uid} />
      </div>
    </div>
  )
}

function geralPct(p: Profile) {
  let a = 0,
    e = 0
  for (const s of Object.values(p.stats)) {
    a += s?.a ?? 0
    e += s?.e ?? 0
  }
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
