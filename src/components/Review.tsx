import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, ChevronDown, XCircle } from 'lucide-react'
import { AREA_BY_ID, MATERIA_BY_ID } from '../lib/materias'
import { getQuestion, LETRAS } from '../lib/questions'
import { renderText } from './QuestionView'

export interface ReviewItem {
  id: string
  ordem: number[]
  marcada?: number
}

export default function Review({ itens }: { itens: ReviewItem[] }) {
  const erradas = itens.filter((i) => i.marcada !== getQuestion(i.id)?.c)
  const certas = itens.filter((i) => i.marcada === getQuestion(i.id)?.c)
  return (
    <div className="review">
      <section>
        <h3 className="sec-title err">
          <XCircle size={20} /> Estude agora: questões que você errou ({erradas.length})
        </h3>
        {erradas.length === 0 && <p className="muted">Nenhum erro. Mandou muito bem! 🎉</p>}
        {erradas.map((it, i) => (
          <ReviewCard key={it.id} item={it} index={i} aberto />
        ))}
      </section>
      <section>
        <h3 className="sec-title ok">
          <CheckCircle2 size={20} /> Questões que você acertou ({certas.length})
        </h3>
        {certas.map((it, i) => (
          <ReviewCard key={it.id} item={it} index={i} />
        ))}
      </section>
    </div>
  )
}

function ReviewCard({ item, index, aberto = false }: { item: ReviewItem; index: number; aberto?: boolean }) {
  const [open, setOpen] = useState(aberto)
  const q = getQuestion(item.id)
  if (!q) return null
  const acertou = item.marcada === q.c
  const m = MATERIA_BY_ID[q.m]
  const area = AREA_BY_ID[q.area]
  const letraDe = (orig?: number) => (orig === undefined ? '—' : LETRAS[item.ordem.indexOf(orig)])
  return (
    <motion.div
      className={'review-card glass ' + (acertou ? 'is-ok' : 'is-err')}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5) }}
    >
      <button className="review-head" onClick={() => setOpen(!open)}>
        <span className="badge" style={{ background: m.cor + '26', color: m.cor, borderColor: m.cor + '55' }}>
          {m.curto}
        </span>
        <span className="review-title">{area && area.materia === 'ESP' ? `${area.nome} · ${q.s}` : q.s}</span>
        <ChevronDown size={18} className={'chev' + (open ? ' up' : '')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="review-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {q.t && <div className="q-texto small">{renderText(q.t)}</div>}
            <div className="q-enunciado">{renderText(q.q)}</div>
            <ul className="review-opts">
              {item.ordem.map((orig, i) => (
                <li key={orig} className={(orig === q.c ? 'correct ' : '') + (orig === item.marcada && !acertou ? 'wrong' : '')}>
                  <span className="letter">{LETRAS[i]}</span>
                  <span>{renderText(q.o[orig])}</span>
                </li>
              ))}
            </ul>
            {!acertou && (
              <div className="explain err">
                <strong>
                  {item.marcada === undefined ? 'Você deixou em branco.' : `Por que a alternativa ${letraDe(item.marcada)} está errada:`}
                </strong>
                {item.marcada !== undefined && <p>{renderText(q.x[item.marcada])}</p>}
              </div>
            )}
            <div className="explain ok">
              <strong>Resposta correta: {letraDe(q.c)}</strong>
              <p>{renderText(q.e)}</p>
            </div>
            <details className="all-comments">
              <summary>Comentário de todas as alternativas</summary>
              <ul>
                {item.ordem.map((orig, i) => (
                  <li key={orig}>
                    <b>{LETRAS[i]})</b> {renderText(q.x[orig])}
                  </li>
                ))}
              </ul>
            </details>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
