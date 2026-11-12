import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, BookOpenCheck, Flag, HelpCircle, Pause, Play, RotateCcw, Trash2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useSession } from '../lib/session'
import { TESTE_RAPIDO, MATERIAS } from '../lib/materias'
import { getQuestion, pickQuestions, randomOrder } from '../lib/questions'
import QuestionView from '../components/QuestionView'
import Review, { type ReviewItem } from '../components/Review'
import InsightModal from '../components/InsightModal'
import { acertadasParaSorteio } from '../lib/zeradas'
import { scrollToTop } from '../lib/scroll'
import type { Profile } from '../lib/types'

type Fase = 'inicio' | 'teste' | 'resultado'

interface TesteState {
  itens: ReviewItem[]
  atual: number
  repetidas: number
}

export default function Inicio() {
  const { questions, progress, profile, record, bumpQuickStarts, quickTest, saveQuickTest } = useSession()
  const [fase, setFase] = useState<Fase>('inicio')
  const [teste, setTeste] = useState<TesteState | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [modal, setModal] = useState(false)
  const [snap, setSnap] = useState<Profile | null>(null)
  const [confirmar, setConfirmar] = useState(false)
  const [aviso, setAviso] = useState(false)
  const [confirmarDescarte, setConfirmarDescarte] = useState<null | 'abandonar' | 'novo'>(null)

  // ---- Salvamento automático do teste em andamento (fica “pausado” se a pessoa sair da tela) ----
  const atualRef = useRef<{ fase: Fase; teste: TesteState | null }>({ fase, teste })
  atualRef.current = { fase, teste }
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const saveRef = useRef(saveQuickTest)
  saveRef.current = saveQuickTest

  useEffect(() => {
    if (fase !== 'teste' || !teste) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => saveRef.current(teste), 600)
  }, [teste, fase])

  // Saiu da tela (menu lateral, outra aba do app) no meio do teste: grava na hora
  useEffect(
    () => () => {
      clearTimeout(timerRef.current)
      const { fase: f, teste: t } = atualRef.current
      if (f === 'teste' && t) saveRef.current(t)
    },
    []
  )

  // Ao avançar/voltar de questão (ou abrir a revisão), volta ao início do enunciado
  const primeiraRolagem = useRef(true)
  useEffect(() => {
    if (fase === 'inicio') return
    if (primeiraRolagem.current) {
      primeiraRolagem.current = false
      return
    }
    scrollToTop()
  }, [teste?.atual, fase])

  const pausar = async () => {
    if (!teste) return
    clearTimeout(timerRef.current)
    await saveQuickTest(teste)
    setFase('inicio')
    setTeste(null)
  }

  const emRevisao = quickTest?.fase === 'revisao'

  const continuar = () => {
    if (!quickTest) return
    setTeste({ itens: quickTest.itens, atual: quickTest.atual ?? 0, repetidas: quickTest.repetidas ?? 0 })
    setFase(quickTest.fase === 'revisao' ? 'resultado' : 'teste')
  }

  // Revisão dos erros: pausar só volta para a tela inicial (o teste já está salvo como “em revisão”)
  const pausarRevisao = () => {
    setModal(false)
    setFase('inicio')
    setTeste(null)
  }

  // Só ao pedir um novo teste a revisão é considerada concluída
  const novoTeste = async () => {
    setModal(false)
    await saveQuickTest(null)
    clicarIniciar()
  }

  const descartar = async () => {
    const acao = confirmarDescarte
    setConfirmarDescarte(null)
    clearTimeout(timerRef.current)
    await saveQuickTest(null)
    setFase('inicio')
    setTeste(null)
    if (acao === 'novo') clicarIniciar()
  }

  const disponiveis = useMemo(() => {
    const acert = new Set(progress.correct)
    return questions.filter((q) => !acert.has(q.id)).length
  }, [questions, progress])

  // Ao apertar INICIAR: mostra o aviso do “Não sei responder” na 1ª e na 3ª vez de cada usuário
  const clicarIniciar = async () => {
    const n = await bumpQuickStarts()
    if (n === 1 || n === 3) setAviso(true)
    else iniciar()
  }

  const iniciar = () => {
    setAviso(false)
    const peso: Record<string, number> = {}
    for (const [a, s] of Object.entries(profile?.areaStats ?? {})) peso[a] = s.e / Math.max(1, s.a + s.e)
    const { ids, repetidas } = pickQuestions(questions, TESTE_RAPIDO, acertadasParaSorteio(questions, progress.correct), new Set(), peso)
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
    clearTimeout(timerRef.current)
    try {
      await record(
        'teste',
        teste.itens.map((i) => ({ id: i.id, marcada: i.marcada }))
      )
      atualRef.current = { fase: 'resultado', teste }
      setFase('resultado')
      // continua “em aberto” até a pessoa pedir um novo teste: dá para pausar e retomar a revisão
      saveQuickTest({ ...teste, fase: 'revisao' })
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
        {quickTest && (
          <motion.div className="glass pausado-info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {emRevisao ? (
              <>
                <BookOpenCheck size={16} /> Revisão pausada: você acertou{' '}
                {quickTest.itens.filter((i) => i.marcada === getQuestion(i.id)?.c).length} de {quickTest.itens.length}. Toque em <b>CONTINUAR</b> para
                rever os erros.
              </>
            ) : (
              <>
                <Pause size={16} /> Teste pausado: {quickTest.itens.filter((i) => i.marcada !== undefined).length} de {quickTest.itens.length}{' '}
                respondidas. Toque em <b>CONTINUAR</b> para seguir de onde parou.
              </>
            )}
          </motion.div>
        )}
        <motion.button
          className={'start-btn' + (quickTest ? ' continuar' : '')}
          onClick={quickTest ? continuar : clicarIniciar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        >
          <span className="pulse" />
          <span className="pulse delay" />
          <Play size={40} fill="currentColor" />
          <b>{quickTest ? 'CONTINUAR' : 'INICIAR'}</b>
        </motion.button>
        {quickTest &&
          (emRevisao ? (
            <button className="link-btn" onClick={novoTeste}>
              <RotateCcw size={14} /> Encerrar a revisão e começar um novo teste
            </button>
          ) : (
            <button className="link-btn" onClick={() => setConfirmarDescarte('novo')}>
              <Trash2 size={14} /> Descartar e começar um novo teste
            </button>
          ))}
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
        <AvisoNaoSei aberto={aviso} onOk={iniciar} />
        <ConfirmarDescarte tipo={confirmarDescarte} onCancelar={() => setConfirmarDescarte(null)} onConfirmar={descartar} />
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
              <button className="btn primary" onClick={novoTeste}>
                <RotateCcw size={18} /> Novo teste
              </button>
              <button className="btn ghost" onClick={() => setModal(true)}>
                Ver análise
              </button>
              <button className="btn ghost" onClick={pausarRevisao}>
                <Pause size={16} /> Pausar
              </button>
            </div>
          </div>
        </motion.div>
        <Review itens={teste.itens} />
        <AvisoNaoSei aberto={aviso} onOk={iniciar} />
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
        <button className="btn ghost sm" onClick={pausar}>
          <Pause size={16} /> Pausar
        </button>
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
        <QuestionView key={q.id} q={q} numero={teste.atual + 1} total={teste.itens.length} ordem={item.ordem} marcada={item.marcada} onMarcar={marcar} permitirNaoSei />
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
      <button className="link-btn" onClick={() => setConfirmarDescarte('abandonar')}>
        Abandonar teste
      </button>
      <ConfirmarDescarte tipo={confirmarDescarte} onCancelar={() => setConfirmarDescarte(null)} onConfirmar={descartar} />
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

function AvisoNaoSei({ aberto, onOk }: { aberto: boolean; onOk(): void }) {
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="modal glass"
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <div className="modal-icon">
              <HelpCircle size={28} />
            </div>
            <h2>Não chute!</h2>
            <p>
              Se você <b>não souber</b> a resposta de uma questão, escolha a última opção: <b>“Não sei responder”</b>.
            </p>
            <ul className="aviso-lista muted">
              <li>Ela conta como erro, e no final você vê qual era a alternativa correta e o porquê.</li>
              <li>A questão volta a aparecer nos próximos testes, até você acertar de verdade.</li>
              <li>Acertar no chute engana as suas estatísticas e tira a questão do seu estudo.</li>
            </ul>
            <button className="btn primary" onClick={onOk}>
              Entendi, começar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ConfirmarDescarte({ tipo, onCancelar, onConfirmar }: { tipo: null | 'abandonar' | 'novo'; onCancelar(): void; onConfirmar(): void }) {
  return (
    <AnimatePresence>
      {tipo && (
        <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancelar}>
          <motion.div className="modal glass" initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <h2>{tipo === 'novo' ? 'Descartar o teste pausado?' : 'Abandonar o teste?'}</h2>
            <p className="muted">
              As respostas deste teste não serão salvas nem contarão pontos.{' '}
              {tipo === 'abandonar' && 'Se quiser continuar depois, use o botão Pausar.'}
            </p>
            <div className="row gap">
              <button className="btn ghost" onClick={onCancelar}>
                Voltar
              </button>
              <button className="btn primary" onClick={onConfirmar}>
                {tipo === 'novo' ? 'Descartar e começar novo' : 'Abandonar'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
