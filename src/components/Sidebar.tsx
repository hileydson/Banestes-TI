import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { BarChart3, FileText, LogOut, PlayCircle, Trophy, X } from 'lucide-react'
import { useSession } from '../lib/session'

const itens = [
  { to: '/', label: 'Teste rápido', icon: PlayCircle },
  { to: '/prova', label: 'Prova', icon: FileText },
  { to: '/resultados', label: 'Ver resultados', icon: BarChart3 },
  { to: '/ranking', label: 'Ranking', icon: Trophy }
]

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile, user, backend } = useSession()
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            className="sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="sidebar-head">
              <div className="avatar">{profile?.nickname?.[0]?.toUpperCase() ?? '?'}</div>
              <div className="who">
                <strong>{profile?.nickname}</strong>
                <small>{user?.username ? `@${user.username}` : user?.email}</small>
              </div>
              <button className="icon-btn" onClick={onClose} aria-label="Fechar menu">
                <X size={20} />
              </button>
            </div>
            <nav>
              {itens.map((it, i) => (
                <motion.div key={it.to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
                  <NavLink to={it.to} end onClick={onClose} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
                    <it.icon size={20} />
                    {it.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="sidebar-foot">
              <div className="mini-stats">
                <div>
                  <b>{profile?.pontos ?? 0}</b>
                  <small>pontos</small>
                </div>
                <div>
                  <b>{profile?.testes ?? 0}</b>
                  <small>testes</small>
                </div>
                <div>
                  <b>{profile?.provas ?? 0}</b>
                  <small>provas</small>
                </div>
              </div>
              <button className="nav-item danger" onClick={() => backend?.logout()}>
                <LogOut size={20} /> Sair
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
