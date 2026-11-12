import { motion } from 'motion/react'
import { Briefcase, CheckCircle2, Circle, Code2 } from 'lucide-react'
import { LISTA_CARGOS, type CargoId } from '../lib/cargos'

const ICONES: Record<CargoId, typeof Code2> = { TI: Code2, TB: Briefcase }

// Cartões para escolher o perfil (cargo do concurso): usados no cadastro (apelido) e em Configurações
export default function EscolhaCargo({ valor, onChange }: { valor: CargoId | null; onChange(c: CargoId): void }) {
  return (
    <div className="cargo-opcoes" role="radiogroup" aria-label="Perfil">
      {LISTA_CARGOS.map((c, i) => {
        const Icone = ICONES[c.id]
        const ativo = valor === c.id
        return (
          <motion.button
            type="button"
            key={c.id}
            role="radio"
            aria-checked={ativo}
            className={'cargo-opcao' + (ativo ? ' ativo' : '')}
            onClick={() => onChange(c.id)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            whileTap={{ scale: 0.98 }}
          >
            <Icone size={22} className="cargo-icone" />
            <span className="cargo-texto">
              <strong>{c.curto}</strong>
              <small>
                {c.edital} · {c.descricao}
              </small>
            </span>
            {ativo ? <CheckCircle2 size={20} className="txt-ok" /> : <Circle size={20} className="muted" />}
          </motion.button>
        )
      })}
    </div>
  )
}
