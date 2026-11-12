import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { useSession } from '../lib/session'
import EscolhaCargo from '../components/EscolhaCargo'
import type { CargoId } from '../lib/cargos'

export default function Apelido() {
  const { user, setNickname, backend } = useSession()
  const [nick, setNick] = useState(user?.username ?? user?.displayName?.split(' ')[0] ?? '')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [cargo, setCargo] = useState<CargoId | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const n = nick.trim()
    if (n.length < 2 || n.length > 20) return setErro('O apelido deve ter entre 2 e 20 caracteres.')
    if (!cargo) return setErro('Escolha para qual cargo você vai estudar.')
    setSalvando(true)
    try {
      const todos = await backend!.listProfiles()
      if (todos.some((p) => p.uid !== user!.uid && p.nickname.toLowerCase() === n.toLowerCase())) {
        setErro('Esse apelido já está sendo usado no ranking. Escolha outro.')
        return
      }
      await setNickname(n, cargo)
    } catch (err) {
      setErro((err as Error).message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="bg-orbs" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <motion.form onSubmit={submit} className="login-card glass form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="big-emoji">🎯</div>
        <h1>Escolha seu apelido</h1>
        <p className="muted">Ele aparece no ranking para os outros estudantes.</p>
        <label>
          Apelido
          <input value={nick} onChange={(e) => setNick(e.target.value)} maxLength={20} autoFocus required />
        </label>
        <div className="cargo-escolha">
          <span className="cargo-label">Para qual cargo você vai estudar?</span>
          <EscolhaCargo
            valor={cargo}
            onChange={(c) => {
              setCargo(c)
              setErro('')
            }}
          />
          <small className="muted">Dá para trocar depois em Configurações.</small>
        </div>
        {erro && <div className="alert error">{erro}</div>}
        <button className="btn primary" disabled={salvando}>
          Começar a estudar
        </button>
        <button type="button" className="btn ghost" onClick={() => backend?.logout()}>
          Sair
        </button>
      </motion.form>
    </div>
  )
}
