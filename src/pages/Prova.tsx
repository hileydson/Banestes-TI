import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, Flag, Pause, Play } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useSession } from '../lib/session'
import { TEMPO_REFERENCIA_PROVA_SEG } from '../lib/materias'
import { getQuestion, pickQuestions, randomOrder } from '../lib/questions'
import { acertadasParaSorteio } from '../lib/zeradas'
import { scrollToTop } from '../lib/scroll'
import { notaEdital } from '../lib/insights'
import QuestionView from '../components/QuestionView'
import Review from '../components/Review'
import InsightModal from '../components/InsightModal'
import { ScoreRing } from './Inicio'
import type { ExamState } from '../lib/types'

export const fmtTempo = (s: number) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

const respondidasSecao = (e: ExamState, i: number) => e.secoes[i].questoes.filter((q) => e.respostas[q.id] !== undefined).length
const totalQuestoes = (e: ExamState) => e.secoes.reduce((s, x) => s + x.questoes.length, 0)

export default function Prova() {
  const { backend, user, questions, progress, profile, cargo } = useSession()
  const [exams, setExams] = useState<ExamState[] | null>(null)
  const [ativa, setAtiva] = useState<ExamState | null>(null)
  const [concluida, setConcluida] = useState<{ exam: ExamState; nova: boolean } | null>(null)
  const [perguntar, setPerguntar] = useState(false)

  const carregar = useCallback(async () => {
    if (!backend || !user) return
    // Só as provas do perfil atual (provas antigas, sem perfil, são de Analista de TI)
    const todas = await backend.listExams(user.uid)
    setExams(todas.filter((e) => (e.cargo ?? 'TI') === cargo.id))
  }, [backend, user, cargo.id])

  useEffect(() => {
    carregar()
  }, [carregar])

  const emAndamento = exams?.find((e) => e.status === 'andamento')
  const totalSimulado = cargo.secoesProva.reduce((n, s) => n + s.slots.reduce((m, x) => m + x.n, 0), 0)
  const feitas = exams?.filter((e) => e.status === 'concluida') ?? []
  const ultimaFeita = [...feitas].sort((a, b) => (b.finishedAt ?? b.startedAt) - (a.finishedAt ?? a.startedAt))[0]

  const criar = async () => {
    if (!backend || !user) return
    setPerguntar(false)
    const usados = new Set<string>()
    const acertadas = acertadasParaSorteio(questions, progress.correct, cargo)
    const peso: Record<string, number> = {}
    for (const [a, s] of Object.entries(profile?.areaStats ?? {})) peso[a] = s.e / Math.max(1, s.a + s.e)
    const secoes = cargo.secoesProva.map((sp) => {
      const { ids } = pickQuestions(questions, sp.slots, acertadas, usados, peso, cargo)
      ids.forEach((id) => usados.add(id))
      return { id: sp.id, titulo: sp.titulo, grupo: sp.grupo, questoes: ids.map((id) => ({ id, ordem: randomOrder() })) }
    })
    const now = Date.now()
    const exam: ExamState = {
      id: `prova-${now}`,
      numero: (exams?.length ?? 0) + 1,
      cargo: cargo.id,
      status: 'andamento',
      secoes,
      respostas: {},
      secaoAtual: 0,
      indiceAtual: 0,
      elapsed: 0,
      startedAt: now,
      updatedAt: now
    }
    await backend.saveExam(user.uid, exam)
    setAtiva(exam)
  }

  if (ativa) {
    return (
      <ProvaEmCurso
        inicial={ativa}
        onPausar={async () => {
          setAtiva(null)
          await carregar()
        }}
        onConcluir={async (e) => {
          setAtiva(null)
          setConcluida({ exam: e, nova: true })
          await carregar()
        }}
      />
    )
  }

  if (concluida) return <ResultadoProva exam={concluida.exam} nova={concluida.nova} onVoltar={() => setConcluida(null)} />

  return (
    <div className="prova-home">
      <h2 className="page-title">
        <FileText /> Simulado de prova
      </h2>
      <p className="muted">
        Simulado de <b>{cargo.curto}</b> no padrão FCC, com metade da prova real do edital: {cargo.provaTexto}, em {cargo.secoesProva.length} seções. Tempo de
        referência: 2h. A nota segue o edital: Gerais peso 1, Específicos peso 2, mínimo 6,0.
      </p>

      {exams === null && <p className="muted">Carregando…</p>}

      {emAndamento && (
        <motion.div className="glass exam-card andamento" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h3>Prova #{emAndamento.numero} em andamento</h3>
            <p className="muted">
              <Clock size={14} /> {fmtTempo(emAndamento.elapsed)} decorridos ·{' '}
              {Math.round((Object.keys(emAndamento.respostas).length / totalQuestoes(emAndamento)) * 100)}% respondida
            </p>
            <div className="progress">
              <div className="progress-fill" style={{ width: `${(Object.keys(emAndamento.respostas).length / totalQuestoes(emAndamento)) * 100}%` }} />
            </div>
          </div>
          <button className="btn primary" onClick={() => setAtiva(emAndamento)}>
            <Play size={18} /> Continuar prova
          </button>
        </motion.div>
      )}

      {exams && !emAndamento && (
        <motion.button className="btn primary big" whileTap={{ scale: 0.97 }} onClick={() => setPerguntar(true)}>
          <Play size={20} /> Nova prova
        </motion.button>
      )}

      <div className="hero-stats">
        <div className="glass stat">
          <b>{feitas.length}</b>
          <small>provas concluídas</small>
        </div>
        <div className="glass stat">
          <b>{Math.max(0, ...feitas.map((e) => e.resultado?.notaFinal ?? 0)).toFixed(2)}</b>
          <small>melhor nota</small>
        </div>
        <div className="glass stat">
          <b>{ultimaFeita?.resultado ? ultimaFeita.resultado.notaFinal.toFixed(2) : '—'}</b>
          <small>última nota</small>
        </div>
      </div>

      {feitas.length > 0 && (
        <>
          <h3>Provas concluídas</h3>
          <div className="exam-list">
            {feitas.map((e, i) => (
              <motion.button
                key={e.id}
                className="glass exam-row"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setConcluida({ exam: e, nova: false })}
              >
                <span>Prova #{e.numero}</span>
                <span className="muted">{new Date(e.finishedAt ?? e.startedAt).toLocaleDateString('pt-BR')}</span>
                <span className="muted">{fmtTempo(e.elapsed)}</span>
                <b className={e.resultado?.aprovado ? 'txt-ok' : 'txt-err'}>{e.resultado?.notaFinal.toFixed(2)}</b>
              </motion.button>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {perguntar && (
          <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPerguntar(false)}>
            <motion.div className="modal glass" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon">
                <FileText size={28} />
              </div>
              <h2>Iniciar a simulação de prova?</h2>
              <p className="muted">São {totalSimulado} questões em {cargo.secoesProva.length} seções. O cronômetro começa assim que você confirmar. Você pode pausar e continuar depois.</p>
              <div className="row gap">
                <button className="btn ghost" onClick={() => setPerguntar(false)}>
                  Agora não
                </button>
                <button className="btn primary" onClick={criar}>
                  <Play size={18} /> Iniciar prova
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProvaEmCurso({ inicial, onPausar, onConcluir }: { inicial: ExamState; onPausar(): void; onConcluir(e: ExamState): void }) {
  const { backend, user, record } = useSession()
  const [exam, setExam] = useState<ExamState>(inicial)
  const [elapsed, setElapsed] = useState(inicial.elapsed)
  const [confirmar, setConfirmar] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const ref = useRef({ exam, elapsed })
  ref.current = { exam, elapsed }

  const persistir = useCallback(async () => {
    if (!backend || !user) return
    const { exam: e, elapsed: el } = ref.current
    await backend.saveExam(user.uid, { ...e, elapsed: el, updatedAt: Date.now() })
  }, [backend, user])

  // cronômetro
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // salvamento automático
  useEffect(() => {
    const t = setInterval(persistir, 20000)
    const vis = () => document.visibilityState === 'hidden' && persistir()
    document.addEventListener('visibilitychange', vis)
    return () => {
      clearInterval(t)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [persistir])

  // ao trocar de questão, volta ao início do enunciado
  const primeira = useRef(true)
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false
      return
    }
    scrollToTop()
  }, [exam.secaoAtual, exam.indiceAtual])

  const secao = exam.secoes[exam.secaoAtual]
  const item = secao.questoes[exam.indiceAtual]
  const q = getQuestion(item.id)!
  const total = totalQuestoes(exam)
  const respondidas = Object.keys(exam.respostas).length
  const ultimaSecao = exam.secaoAtual === exam.secoes.length - 1
  const ultimaQuestao = exam.indiceAtual === secao.questoes.length - 1

  const ir = (secaoAtual: number, indiceAtual: number) => setExam((e) => ({ ...e, secaoAtual, indiceAtual }))

  const pausar = async () => {
    setSalvando(true)
    await persistir()
    onPausar()
  }

  const concluir = async () => {
    setConfirmar(false)
    setSalvando(true)
    let aCG = 0,
      tCG = 0,
      aCE = 0,
      tCE = 0
    for (const s of exam.secoes)
      for (const qq of s.questoes) {
        const ok = exam.respostas[qq.id] === getQuestion(qq.id)?.c
        if (s.grupo === 'CG') {
          tCG++
          if (ok) aCG++
        } else {
          tCE++
          if (ok) aCE++
        }
      }
    const n = notaEdital(aCG, tCG, aCE, tCE)
    const final: ExamState = {
      ...exam,
      elapsed,
      status: 'concluida',
      finishedAt: Date.now(),
      updatedAt: Date.now(),
      resultado: { acertosCG: aCG, totalCG: tCG, acertosCE: aCE, totalCE: tCE, ...n }
    }
    try {
      await backend!.saveExam(user!.uid, final)
      await record(
        'prova',
        exam.secoes.flatMap((s) => s.questoes.map((qq) => ({ id: qq.id, marcada: exam.respostas[qq.id] }))),
        { nota: n.notaFinal, duracaoSeg: elapsed }
      )
      onConcluir(final)
    } catch (e) {
      alert('Erro ao salvar a prova: ' + (e as Error).message)
      setSalvando(false)
    }
  }

  const passou = elapsed > TEMPO_REFERENCIA_PROVA_SEG
  return (
    <div className="quiz prova">
      <div className="prova-bar glass">
        <div className={'timer' + (passou ? ' over' : '')}>
          <Clock size={18} />
          <span>{fmtTempo(elapsed)}</span>
        </div>
        <div className="prova-pct">
          <b>{Math.round((respondidas / total) * 100)}%</b>
          <small>
            {respondidas}/{total}
          </small>
        </div>
        <button className="btn ghost sm" onClick={pausar} disabled={salvando}>
          <Pause size={16} /> Pausar
        </button>
      </div>
      <div className="progress">
        <motion.div className="progress-fill" animate={{ width: `${(respondidas / total) * 100}%` }} />
      </div>

      <div className="secoes">
        {exam.secoes.map((s, i) => {
          const r = respondidasSecao(exam, i)
          const p = Math.round((r / s.questoes.length) * 100)
          return (
            <button key={s.id} className={'secao-tab' + (i === exam.secaoAtual ? ' active' : '') + (p === 100 ? ' done' : '')} onClick={() => ir(i, 0)}>
              <span className="secao-n">Seção {i + 1}</span>
              <span className="secao-t">{s.titulo}</span>
              <span className="secao-p">
                <span style={{ width: `${p}%` }} />
              </span>
              <small>{p}%</small>
            </button>
          )
        })}
      </div>

      <div className="dots">
        {secao.questoes.map((qq, i) => (
          <button
            key={qq.id}
            className={'qdot' + (i === exam.indiceAtual ? ' current' : '') + (exam.respostas[qq.id] !== undefined ? ' done' : '')}
            onClick={() => ir(exam.secaoAtual, i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <QuestionView
          key={q.id}
          q={q}
          numero={exam.indiceAtual + 1}
          total={secao.questoes.length}
          ordem={item.ordem}
          marcada={exam.respostas[q.id]}
          onMarcar={(orig) => setExam((e) => ({ ...e, respostas: { ...e.respostas, [q.id]: orig } }))}
        />
      </AnimatePresence>

      <div className="quiz-nav">
        <button
          className="btn ghost"
          disabled={exam.secaoAtual === 0 && exam.indiceAtual === 0}
          onClick={() =>
            exam.indiceAtual > 0 ? ir(exam.secaoAtual, exam.indiceAtual - 1) : ir(exam.secaoAtual - 1, exam.secoes[exam.secaoAtual - 1].questoes.length - 1)
          }
        >
          <ArrowLeft size={18} /> Anterior
        </button>
        {!ultimaQuestao && (
          <button className="btn primary" onClick={() => ir(exam.secaoAtual, exam.indiceAtual + 1)}>
            Próxima <ArrowRight size={18} />
          </button>
        )}
        {ultimaQuestao && !ultimaSecao && (
          <button className="btn primary" onClick={() => ir(exam.secaoAtual + 1, 0)}>
            <CheckCircle2 size={18} /> Próxima seção
          </button>
        )}
        {ultimaQuestao && ultimaSecao && (
          <button className="btn success" onClick={() => setConfirmar(true)} disabled={salvando}>
            <Flag size={18} /> Finalizar prova
          </button>
        )}
      </div>

      <AnimatePresence>
        {confirmar && (
          <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal glass" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <h2>Finalizar a prova?</h2>
              <p className="muted">
                {total - respondidas > 0
                  ? `Ainda há ${total - respondidas} questão(ões) em branco, que contarão como erro.`
                  : 'Todas as questões foram respondidas.'}{' '}
                Depois de finalizar não é possível alterar as respostas.
              </p>
              <div className="row gap">
                <button className="btn ghost" onClick={() => setConfirmar(false)}>
                  Revisar
                </button>
                <button className="btn success" onClick={concluir}>
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

function ResultadoProva({ exam, nova, onVoltar }: { exam: ExamState; nova: boolean; onVoltar(): void }) {
  const { profile } = useSession()
  const [modal, setModal] = useState(false)
  const r = exam.resultado!
  useEffect(() => {
    if (!nova) return
    if (r.aprovado) confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } })
    const t = setTimeout(() => setModal(true), 900)
    return () => clearTimeout(t)
  }, [r.aprovado, nova])
  const itens = exam.secoes.flatMap((s) => s.questoes.map((q) => ({ id: q.id, ordem: q.ordem, marcada: exam.respostas[q.id] })))
  return (
    <div className="resultado">
      <button className="link-btn" onClick={onVoltar}>
        <ArrowLeft size={16} /> Voltar para provas
      </button>
      <motion.div className="score-card glass" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <ScoreRing valor={r.notaFinal} total={10} label={r.notaFinal.toFixed(2)} />
        <div>
          <h2>
            Prova #{exam.numero}: {r.aprovado ? 'Aprovado! 🎉' : 'Abaixo do mínimo'}
          </h2>
          <p className="muted">
            Nota final {r.notaFinal.toFixed(2)} (mínimo do edital: 6,00) · Tempo {fmtTempo(exam.elapsed)}
          </p>
          <div className="nota-grid">
            <div className="glass stat">
              <b>
                {r.acertosCG}/{r.totalCG}
              </b>
              <small>Gerais · nota {r.notaCG.toFixed(2)}</small>
            </div>
            <div className="glass stat">
              <b>
                {r.acertosCE}/{r.totalCE}
              </b>
              <small>Específicos · nota {r.notaCE.toFixed(2)}</small>
            </div>
            <div className="glass stat">
              <b>
                {r.acertosCG + r.acertosCE}/{r.totalCG + r.totalCE}
              </b>
              <small>acertos no total</small>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="secoes-result">
        {exam.secoes.map((s, i) => {
          const a = s.questoes.filter((q) => exam.respostas[q.id] === getQuestion(q.id)?.c).length
          return (
            <div key={s.id} className="glass secao-res">
              <span>
                Seção {i + 1} · {s.titulo}
              </span>
              <b>
                {a}/{s.questoes.length}
              </b>
            </div>
          )
        })}
      </div>
      <Review itens={itens} />
      {profile && <InsightModal profile={profile} open={modal} onClose={() => setModal(false)} titulo="Prova concluída! Veja seu rendimento" />}
    </div>
  )
}
