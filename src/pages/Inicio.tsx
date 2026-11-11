import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Flag, Play, RotateCcw } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useSession } from '../lib/session'
import { TESTE_RAPIDO, MATERIAS } from '../lib/materias'
import { getQuestion, pickQuestions, randomOrder } from '../lib/questions'
import QuestionView from '../components/QuestionView'
import Review, { type ReviewItem } from '../components/Review'
import InsightModal from '../components/InsightModal'
import type { Profile } from '../lib/types'

type Fase = 'inicio' | 'teste' | 'resultado'

interface TesteState {
  itens: ReviewItem[]
  atual: number
  repetidas: number
}

const storeKey = (uid: string) => `bti-teste-${uid}`

export default function Inicio() {
  const { questions, progress, profile, user, record } = useSession()
  const [fase, setFase] = useState<Fase>('inicio')
  const [teste, setTeste] = useState<TesteState | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [modal, setModal] = useState(false)
  const [snap, setSnap] = useState<Profile | null>(null)
  const [confirmar, setConfirmar] = useState(false)

  // retoma teste não concluído (ex.: app fechado no meio)
  useEffect(() => {
    if (!user) return
    try {
      const raw = localStorage.getItem(storeKey(user.uid))
      if (raw) {
        setTeste(JSON.parse(raw))
        setFase('teste')
      }
    } catch {
      /* ignora */
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    try {
      if (fase === 'teste' && teste) localStorage.setItem(storeKey(user.uid), JSON.stringify(teste))
      else localStorage.removeItem(storeKey(user.uid))
    } catch {
      /* ignora */
    }
  }, [teste, fase, user])

  const disponiveis = useMemo(() => {
    const acert = new Set(progress.correct)
    return questions.filter((q) => !acert.has(q.id)).length
  }, [questions, progress])

  const iniciar = () => {
    const peso: Record<string, number> = {}
    for (const [a, s] of Object.entries(profile?.areaStats ?? {})) peso[a] = s.e / Math.max(1, s.a + s.e)
    const { ids, repetidas } = pickQuestions(questions, TESTE_RAPIDO, new Set(progress.correct), new Set(), peso)
    setTeste({ itens: ids.map((id) => ({ id, ordem: randomOrder() })), atual: 0, repetidas })
    setFase('teste')
  }

  const marcar = (orig: number) => {
    if (!teste) return
    const itens = teste.itens.map((it, i) => (i === teste.atual ? { ...it, marcada: orig } : it))
    setTeste({ ...teste, itens })
  }

  const finalizar = async () => {
    if (!teste) return
    setConfirmar(false)
    setSalvando(true)
    try {
      await record(
        'teste',
        teste.itens.map((i) => ({ id: i.id, marcada: i.marcada }))
      )
      setFase('resultado')
      const acertos = teste.itens.filter((i) => i.marcada === getQuestion(i.id)?.c).length
      if (acertos / teste.itens.length >= 0.7) confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } })
      setTimeout(() => setModal(true), 700)
    } catch (e) {
      alert('Não foi possível salvar o resultado: ' + (e as Error).message)
    } finally {
      setSalvando(false)
    }
  }

  useEffect(() => {
    if (modal && profile) setSnap(profile)
  }, [modal, profile])

  if (fase === 'inicio' || !teste) {
    return (
      <div className="hero">
        <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          Olá, {profile?.nickname}! 👋
        </motion.h2>
        <p className="muted center">
          Cada rodada traz 12 questões inéditas para você, no estilo FCC:
          <br />2 Português · 2 Raciocínio Lógico · 1 Estatística · 1 Atualidades · 1 Ética/ESG · 5 Específicas
        </p>
        <motion.button
          className="start-btn"
          onClick={iniciar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        >
          <span className="pulse" />
          <span className="pulse delay" />
          <Play size={40} fill="currentColor" />
          <b>INICIAR</b>
        </motion.button>
        <div className="hero-stats">
          <div className="glass stat">
            <b>{questions.length}</b>
            <small>questões no banco</small>
          </div>
          <div className="glass stat">
            <b>{disponiveis}</b>
            <small>ainda não acertadas</small>
          </div>
          <div className="glass stat">
            <b>{profile?.testes ?? 0}</b>
            <small>testes feitos</small>
          </div>
        </div>
        <div className="banco-mini glass">
          {MATERIAS.map((m) => {
            const n = questions.filter((q) => q.m === m.id).length
            return (
              <div key={m.id} className="banco-row">
                <span className="dot" style={{ background: m.cor }} />
                <span>{m.nome}</span>
                <b>{n}</b>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (fase === 'resultado') {
    const acertos = teste.itens.filter((i) => i.marcada === getQuestion(i.id)?.c).length
    return (
      <div className="resultado">
        <motion.div className="score-card glass" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ScoreRing valor={acertos} total={teste.itens.length} />
          <div>
            <h2>{acertos >= 9 ? 'Excelente!' : acertos >= 7 ? 'Muito bom!' : acertos >= 5 ? 'Bom caminho!' : 'Bora revisar!'}</h2>
            <p className="muted">
              Você acertou {acertos} de {teste.itens.length} questões. +{acertos} pontos somados ao seu perfil.
            </p>
            <div className="row gap">
              <button className="btn primary" onClick={iniciar}>
                <RotateCcw size={18} /> Novo teste
              </button>
              <button className="btn ghost" onClick={() => setModal(true)}>
                Ver análise
              </button>
            </div>
          </div>
        </motion.div>
        <Review itens={teste.itens} />
        {(snap ?? profile) && <InsightModal profile={(snap ?? profile)!} open={modal} onClose={() => setModal(false)} titulo="Seu rendimento até agora" />}
      </div>
    )
  }

  const item = teste.itens[teste.atual]
  const q = getQuestion(item.id)!
  const respondidas = teste.itens.filter((i) => i.marcada !== undefined).length
  return (
    <div className="quiz">
      {teste.repetidas > 0 && <div className="alert info">Algumas matérias já foram 100% acertadas por você — {teste.repetidas} questão(ões) repetida(s) para completar o teste.</div>}
      <div className="progress-wrap">
        <div className="progress">
          <motion.div className="progress-fill" animate={{ width: `${(respondidas / teste.itens.length) * 100}%` }} />
        </div>
        <span>
          {respondidas}/{teste.itens.length}
        </span>
      </div>
      <div className="dots">
        {teste.itens.map((it, i) => (
          <button
            key={it.id}
            className={'qdot' + (i === teste.atual ? ' current' : '') + (it.marcada !== undefined ? ' done' : '')}
            onClick={() => setTeste({ ...teste, atual: i })}
            aria-label={`Ir para questão ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <QuestionView key={q.id} q={q} numero={teste.atual + 1} total={teste.itens.length} ordem={item.ordem} marcada={item.marcada} onMarcar={marcar} />
      </AnimatePresence>
      <div className="quiz-nav">
        <button className="btn ghost" disabled={teste.atual === 0} onClick={() => setTeste({ ...teste, atual: teste.atual - 1 })}>
          <ArrowLeft size={18} /> Anterior
        </button>
        {teste.atual < teste.itens.length - 1 ? (
          <button className="btn primary" onClick={() => setTeste({ ...teste, atual: teste.atual + 1 })}>
            Próxima <ArrowRight size={18} />
          </button>
        ) : (
          <button className="btn success" disabled={salvando} onClick={() => (respondidas < teste.itens.length ? setConfirmar(true) : finalizar())}>
            <Flag size={18} /> {salvando ? 'Salvando…' : 'Finalizar'}
          </button>
        )}
      </div>
      <button className="link-btn" onClick={() => (setFase('inicio'), setTeste(null))}>
        Abandonar teste
      </button>
      <AnimatePresence>
        {confirmar && (
          <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal glass" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <h2>Finalizar mesmo assim?</h2>
              <p className="muted">Você deixou {teste.itens.length - respondidas} questão(ões) em branco. Elas contarão como erro.</p>
              <div className="row gap">
                <button className="btn ghost" onClick={() => setConfirmar(false)}>
                  Voltar
                </button>
                <button className="btn success" onClick={finalizar}>
                  Finalizar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ScoreRing({ valor, total, label }: { valor: number; total: number; label?: string }) {
  const r = 52
  const c = 2 * Math.PI * r
  const p = total ? valor / total : 0
  const cor = p >= 0.7 ? '#34d399' : p >= 0.5 ? '#fbbf24' : '#f87171'
  return (
    <div className="ring">
      <svg viewBox="0 0 120 120" width="130" height="130">
        <circle cx="60" cy="60" r={r} stroke="rgba(255,255,255,.1)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          stroke={cor}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - p) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="ring-label">
        <b>{label ?? `${valor}/${total}`}</b>
        <small>{Math.round(p * 100)}%</small>
      </div>
    </div>
  )
}
