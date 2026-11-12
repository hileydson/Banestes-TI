import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Settings, UserCog } from 'lucide-react'
import { useSession } from '../lib/session'
import EscolhaCargo from '../components/EscolhaCargo'
import { CARGOS, type CargoId } from '../lib/cargos'

export default function Configuracoes() {
  const { cargo, setCargo, quickTest, materiaTest } = useSession()
  const [escolhido, setEscolhido] = useState<CargoId>(cargo.id)
  const [confirmar, setConfirmar] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [ok, setOk] = useState(false)
  const mudou = escolhido !== cargo.id
  const temPausado = !!(quickTest || materiaTest)

  const salvar = async () => {
    setConfirmar(false)
    setSalvando(true)
    try {
      await setCargo(escolhido)
      setOk(true)
      setTimeout(() => setOk(false), 3500)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="config">
      <h2 className="page-title">
        <Settings /> Configurações
      </h2>

      <div className="glass config-card">
        <h3>
          <UserCog size={18} /> Perfil de estudo
        </h3>
        <p className="muted small">
          O perfil define as matérias do app: testes, prova, estudo, resultados e ranking passam a seguir o edital do cargo escolhido. Seu progresso fica
          guardado: as questões já acertadas e os assuntos estudados valem nos dois perfis quando a matéria é a mesma.
        </p>
        <EscolhaCargo
          valor={escolhido}
          onChange={(c) => {
            setEscolhido(c)
            setOk(false)
          }}
        />
        <button className="btn primary big" disabled={!mudou || salvando} onClick={() => (temPausado ? setConfirmar(true) : salvar())}>
          {salvando ? 'Salvando…' : mudou ? `Mudar para ${CARGOS[escolhido].curto}` : `Perfil atual: ${cargo.curto}`}
        </button>
        <AnimatePresence>
          {ok && (
            <motion.div className="alert ok" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <CheckCircle2 size={16} style={{ verticalAlign: '-3px' }} /> Perfil alterado para <b>{cargo.curto}</b>.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {confirmar && (
          <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmar(false)}>
            <motion.div className="modal glass" initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
              <h2>Mudar de perfil?</h2>
              <p className="muted">
                Você tem um teste pausado (rápido ou por matéria) do perfil {cargo.curto}. Ao mudar, ele será descartado. Provas em andamento continuam guardadas
                e voltam a aparecer se você retornar a este perfil.
              </p>
              <div className="row gap">
                <button className="btn ghost" onClick={() => setConfirmar(false)}>
                  Voltar
                </button>
                <button className="btn primary" onClick={salvar}>
                  Mudar para {CARGOS[escolhido].curto}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
