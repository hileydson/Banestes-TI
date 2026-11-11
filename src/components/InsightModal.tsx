import { AnimatePresence, motion } from 'motion/react'
import { Lightbulb, X } from 'lucide-react'
import { computeInsight, fmtPct } from '../lib/insights'
import type { Profile } from '../lib/types'

export default function InsightModal({ profile, open, onClose, titulo }: { profile: Profile; open: boolean; onClose(): void; titulo: string }) {
  const ins = computeInsight(profile)
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="modal glass"
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="icon-btn modal-x" onClick={onClose} aria-label="Fechar">
              <X size={20} />
            </button>
            <div className="modal-icon">
              <Lightbulb size={28} />
            </div>
            <h2>{titulo}</h2>
            <p className="muted">Análise do seu histórico completo, por matéria do edital:</p>
            <div className="insight-bars">
              {ins.materias.map((m, i) => (
                <div key={m.id} className="ibar">
                  <div className="ibar-label">
                    <span>{m.nome}</span>
                    <b>{m.respondidas ? fmtPct(m.aproveitamento) : '—'}</b>
                  </div>
                  <div className="ibar-track">
                    <motion.div
                      className="ibar-fill"
                      style={{ background: m.cor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${m.aproveitamento}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                    />
                    <div className="ibar-avg" style={{ left: `${ins.geral}%` }} title="Sua média geral" />
                  </div>
                </div>
              ))}
              <small className="muted">A linha branca marca sua média geral ({fmtPct(ins.geral)}).</small>
            </div>
            <ul className="insight-msgs">
              {ins.mensagens.map((msg, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.15 }}>
                  {msg}
                </motion.li>
              ))}
            </ul>
            <button className="btn primary" onClick={onClose}>
              Ver correção das questões
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
