import { motion } from 'motion/react'
import { AREA_BY_ID, MATERIA_BY_ID } from '../lib/materias'
import { materiaDaQuestao } from '../lib/cargos'
import { useSession } from '../lib/session'
import { HelpCircle } from 'lucide-react'
import { LETRAS, NAO_SEI, type Question } from '../lib/questions'

interface Props {
  q: Question
  numero: number
  total: number
  ordem: number[]
  marcada?: number
  onMarcar(original: number): void
  permitirNaoSei?: boolean
}

export default function QuestionView({ q, numero, total, ordem, marcada, onMarcar, permitirNaoSei }: Props) {
  const { cargo } = useSession()
  // nome e cor da matéria como aparecem no perfil (ex.: Matemática Financeira no Técnico Bancário)
  const m = materiaDaQuestao(q, cargo) ?? MATERIA_BY_ID[q.m]
  const area = AREA_BY_ID[q.area]
  return (
    <motion.div
      key={q.id}
      className="question glass"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
    >
      <div className="q-head">
        <span className="badge" style={{ background: m.cor + '26', color: m.cor, borderColor: m.cor + '55' }}>
          {m.nome}
        </span>
        {area && area.materia === 'ESP' && <span className="badge subtle">{area.nome}</span>}
        <span className="q-num">
          Questão {numero} de {total}
        </span>
      </div>
      <div className="q-assunto">{q.s}</div>
      {q.t && <div className="q-texto">{renderText(q.t)}</div>}
      <div className="q-enunciado">{renderText(q.q)}</div>
      <div className="options">
        {ordem.map((orig, i) => (
          <motion.button
            key={orig}
            className={'option' + (marcada === orig ? ' selected' : '')}
            onClick={() => onMarcar(orig)}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
          >
            <span className="letter">{LETRAS[i]}</span>
            <span className="opt-text">{renderText(q.o[orig])}</span>
          </motion.button>
        ))}
        {permitirNaoSei && (
          <motion.button
            className={'option nao-sei' + (marcada === NAO_SEI ? ' selected' : '')}
            onClick={() => onMarcar(NAO_SEI)}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <span className="letter">
              <HelpCircle size={16} />
            </span>
            <span className="opt-text">Não sei responder</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

// Suporta quebras de linha e `código` inline simples
export function renderText(s: string) {
  return s.split('\n').map((linha, i) => (
    <span key={i} className={linha.startsWith('    ') || linha.startsWith('\t') ? 'code-line' : undefined}>
      {linha.split(/(`[^`]+`)/g).map((part, j) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 1 ? <code key={j}>{part.slice(1, -1)}</code> : <span key={j}>{part}</span>
      )}
      {i < s.split('\n').length - 1 && <br />}
    </span>
  ))
}
