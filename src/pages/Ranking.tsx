import { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Award, Crown, FileText, Gauge, Medal, RefreshCw, Trophy } from 'lucide-react'
import { useSession } from '../lib/session'
import { cargoDoPerfil, CARGOS, materiaDoCargo, type Cargo, type CargoId } from '../lib/cargos'
import { totaisPorMateria, zeradasValidas } from '../lib/zeradas'
import { fmtPct } from '../lib/insights'
import { aproveitamentoGeral, aproveitamentoMateria, JANELA_RECENTES, type AprovGeral, type AprovMateria } from '../lib/aproveitamento'
import type { Profile } from '../lib/types'

const MIN_QUESTOES_MATERIA = 5 // das últimas 10 da matéria
const MIN_QUESTOES_APROV = 10 // somando as matérias, para entrar no ranking de aproveitamento
const NOTA_MINIMA = 6 // edital, item 11.3
const AUTO_REFRESH_MS = 60_000

export default function Ranking() {
  const { backend, user, questions, cargo, profile } = useSession()
  const [perfis, setPerfis] = useState<Profile[] | null>(null)
  const [atualizando, setAtualizando] = useState(false)
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null)

  const carregar = useCallback(async () => {
    if (!backend) return
    setAtualizando(true)
    try {
      setPerfis(await backend.listProfiles())
      setAtualizadoEm(new Date())
    } finally {
      setAtualizando(false)
    }
  }, [backend])

  // Carrega ao abrir, ao voltar para a aba e a cada minuto enquanto a tela estiver visível
  useEffect(() => {
    carregar()
    const tick = () => document.visibilityState === 'visible' && carregar()
    const id = window.setInterval(tick, AUTO_REFRESH_MS)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [carregar])

  if (!perfis) return <p className="muted">Carregando ranking…</p>

  // Ranking único com todos os participantes, dos dois perfis: pontos = total de acertos, sem peso
  // o próprio perfil vem da sessão (mais atualizado que a lista do servidor)
  const todos = profile ? perfis.map((p) => (p.uid === profile.uid ? profile : p)) : perfis
  const pts = (p: Profile) => p.pontos
  // Aproveitamento: últimas 10 questões de cada matéria do perfil da pessoa; geral = média das matérias
  const aprov = new Map<string, AprovGeral>(todos.map((p) => [p.uid, aproveitamentoGeral(p, cargoDoPerfil(p))]))
  const geralPct = (p: Profile) => aprov.get(p.uid)?.pct ?? 0
  const respondidas = (p: Profile) => {
    let n = 0
    for (const sc of Object.values(p.stats)) n += (sc?.a ?? 0) + (sc?.e ?? 0)
    return n
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
      <div className="rank-header">
        <h2 className="page-title">
          <Trophy /> Ranking
        </h2>
        <button
          className={'btn-refresh' + (atualizando ? ' girando' : '')}
          onClick={carregar}
          disabled={atualizando}
          title={atualizadoEm ? `Atualizar (última: ${atualizadoEm.toLocaleTimeString('pt-BR')})` : 'Atualizar'}
          aria-label="Atualizar ranking"
        >
          <RefreshCw size={18} />
        </button>
      </div>
      <p className="muted small">
        Todos os participantes, dos dois perfis (Analista de Sistemas e Técnico Bancário). Pontos = total de acertos, sem peso.
      </p>

      <div className="glass rank-card">
        <h3>
          <Crown size={18} /> Top 20 geral (pontos = acertos)
        </h3>
        <p className="muted small">
          Empate em pontos: fica na frente quem tem o melhor aproveitamento (%), calculado como na seção abaixo. 🏆 = matéria zerada.
        </p>
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

      <SecaoAproveitamento todos={todos} aprov={aprov} me={user?.uid} />

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
      <p className="muted small">
        Aproveitamento nas últimas {JANELA_RECENTES} questões da matéria (mínimo {MIN_QUESTOES_MATERIA} questões).
      </p>
      <div className="rank-grid">
        {cargo.materias.map((m, idx) => {
          const am = new Map(todos.map((p) => [p.uid, aproveitamentoMateria(p, m)]))
          const sc = (p: Profile) => am.get(p.uid)!
          const lista = todos
            .filter((p) => sc(p).n >= MIN_QUESTOES_MATERIA)
            .sort((a, b) => sc(b).pct - sc(a).pct || sc(b).n - sc(a).n || a.nickname.localeCompare(b.nickname))
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
                    <span className="muted">
                      {sc(p).acertos}/{sc(p).n}
                    </span>
                    <b>{fmtPct(sc(p).pct)}</b>
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

// Seção “Aproveitamento”: o seu, matéria por matéria (com as últimas 10 respostas), e o ranking por aproveitamento
function SecaoAproveitamento({ todos, aprov, me }: { todos: Profile[]; aprov: Map<string, AprovGeral>; me?: string }) {
  const meu = todos.find((p) => p.uid === me)
  const meuAprov = meu ? aprov.get(meu.uid) : undefined
  const lista = todos
    .filter((p) => (aprov.get(p.uid)?.consideradas ?? 0) >= MIN_QUESTOES_APROV)
    .sort(
      (a, b) =>
        aprov.get(b.uid)!.pct - aprov.get(a.uid)!.pct ||
        aprov.get(b.uid)!.consideradas - aprov.get(a.uid)!.consideradas ||
        a.nickname.localeCompare(b.nickname)
    )
    .slice(0, 20)
  return (
    <div className="glass rank-card aprov-card">
      <h3>
        <Gauge size={18} /> Aproveitamento
      </h3>
      <p className="muted small">
        Por matéria: acertos nas últimas {JANELA_RECENTES} questões feitas nela. Geral: média do aproveitamento de todas as matérias do perfil
        (matéria ainda sem questões conta 0%). Como só valem as últimas {JANELA_RECENTES}, o número acompanha a sua evolução.
      </p>

      {meu && meuAprov && (
        <div className="aprov-meu">
          <div className="aprov-meu-topo">
            <span>Seu aproveitamento geral</span>
            <b>{fmtPct(meuAprov.pct)}</b>
          </div>
          {meuAprov.materias.map((m) => (
            <LinhaMateria key={m.id} m={m} />
          ))}
        </div>
      )}

      <h4 className="aprov-sub">Ranking de aproveitamento</h4>
      <p className="muted small">Entra quem já tem pelo menos {MIN_QUESTOES_APROV} questões contando as janelas de todas as matérias.</p>
      {lista.length === 0 && <p className="muted small">Ninguém atingiu o mínimo ainda.</p>}
      <ol className="rank-list">
        {lista.map((p, i) => {
          const a = aprov.get(p.uid)!
          return (
            <motion.li
              key={p.uid}
              className={'aprov-row' + (p.uid === me ? ' me' : '')}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <span className="pos">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
              <span className="name">{p.nickname}</span>
              <PerfilTag p={p} />
              <b>{fmtPct(a.pct)}</b>
              <div className="aprov-chips">
                {a.materias.map((m) => (
                  <span key={m.id} className={'aprov-chip' + (m.n ? '' : ' vazio')} style={{ borderColor: m.cor + '66', color: m.cor }} title={`${m.nome}: ${m.acertos} de ${m.n}`}>
                    {m.curto} {m.n ? fmtPct(m.pct) : '—'}
                  </span>
                ))}
              </div>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}

function LinhaMateria({ m }: { m: AprovMateria }) {
  // bolinhas das últimas respostas (mais antiga → mais recente); vazias até completar 10
  const seq = m.seq.split('')
  return (
    <div className="aprov-linha">
      <span className="aprov-nome" style={{ color: m.cor }} title={m.nome}>
        {m.curto}
      </span>
      <span className="aprov-dots" aria-label={`${m.acertos} acertos nas últimas ${m.n}`}>
        {Array.from({ length: JANELA_RECENTES }, (_, k) => {
          const v = seq[k]
          return <i key={k} className={v === '1' ? 'ok' : v === '0' ? 'err' : ''} />
        })}
      </span>
      <b className="aprov-pct">{m.n ? fmtPct(m.pct) : '—'}</b>
    </div>
  )
}
