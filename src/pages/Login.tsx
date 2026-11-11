import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { KeyRound, LogIn, UserPlus } from 'lucide-react'
import { useSession } from '../lib/session'

type Aba = 'entrar' | 'criar' | 'resetar'

export default function Login() {
  const { backend } = useSession()
  const [aba, setAba] = useState<Aba>('entrar')
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [senha2, setSenha2] = useState('')
  const [mestre, setMestre] = useState('')
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState('')
  const [carregando, setCarregando] = useState(false)

  const run = async (fn: () => Promise<void>) => {
    setErro('')
    setOk('')
    setCarregando(true)
    try {
      await fn()
    } catch (e) {
      setErro((e as Error).message)
    } finally {
      setCarregando(false)
    }
  }

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    if (!backend) return
    const u = usuario.trim().toLowerCase()
    if (aba === 'entrar') return run(() => backend.login(u, senha))
    if (aba === 'criar')
      return run(async () => {
        if (senha !== senha2) throw new Error('As senhas não conferem.')
        await backend.signup(u, senha)
      })
    return run(async () => {
      if (senha !== senha2) throw new Error('As senhas não conferem.')
      await backend.resetPassword(u, mestre, senha)
      setOk('Senha redefinida! Agora é só entrar com a nova senha.')
      setAba('entrar')
      setSenha('')
      setSenha2('')
      setMestre('')
    })
  }

  return (
    <div className="login-wrap">
      <div className="bg-orbs" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <motion.div className="login-card glass" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45 }}>
        <motion.img src="/icons/favicon.svg" width={64} height={64} alt="" initial={{ rotate: -20, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', delay: 0.15 }} />
        <h1>Estudo Banestes TI</h1>
        <p className="muted">Analista de TI – Desenvolvimento de Sistemas · FCC</p>

        <button className="btn google" onClick={() => backend && run(() => backend.loginGoogle())} disabled={carregando}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          Entrar com Google
        </button>

        <div className="divider">
          <span>ou com usuário e senha</span>
        </div>

        <div className="tabs">
          {(
            [
              ['entrar', 'Entrar'],
              ['criar', 'Criar conta'],
              ['resetar', 'Esqueci a senha']
            ] as [Aba, string][]
          ).map(([id, label]) => (
            <button key={id} className={'tab' + (aba === id ? ' active' : '')} onClick={() => (setAba(id), setErro(''))} type="button">
              {label}
              {aba === id && <motion.span layoutId="tab-ind" className="tab-ind" />}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="form">
          <label>
            Usuário
            <input value={usuario} onChange={(e) => setUsuario(e.target.value)} autoCapitalize="none" autoComplete="username" placeholder="ex.: joao.silva" required />
          </label>
          <AnimatePresence initial={false}>
            {aba === 'resetar' && (
              <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                Senha mestre
                <input type="password" value={mestre} onChange={(e) => setMestre(e.target.value)} placeholder="Informe a senha mestre" required />
              </motion.label>
            )}
          </AnimatePresence>
          <label>
            {aba === 'resetar' ? 'Nova senha' : 'Senha'}
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete={aba === 'entrar' ? 'current-password' : 'new-password'}
              minLength={6}
              required
            />
          </label>
          <AnimatePresence initial={false}>
            {aba !== 'entrar' && (
              <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                Confirmar senha
                <input type="password" value={senha2} onChange={(e) => setSenha2(e.target.value)} autoComplete="new-password" minLength={6} required />
              </motion.label>
            )}
          </AnimatePresence>

          {erro && <div className="alert error">{erro}</div>}
          {ok && <div className="alert ok">{ok}</div>}

          <button className="btn primary" disabled={carregando}>
            {aba === 'entrar' && (
              <>
                <LogIn size={18} /> Entrar
              </>
            )}
            {aba === 'criar' && (
              <>
                <UserPlus size={18} /> Criar conta
              </>
            )}
            {aba === 'resetar' && (
              <>
                <KeyRound size={18} /> Redefinir senha
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
