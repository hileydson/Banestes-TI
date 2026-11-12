import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu } from 'lucide-react'
import { useSession } from './lib/session'
import Sidebar from './components/Sidebar'
import Splash from './components/Splash'
import Login from './pages/Login'
import Apelido from './pages/Apelido'
import Inicio from './pages/Inicio'
import TestePorMateria from './pages/TestePorMateria'
import Resultados from './pages/Resultados'
import Prova from './pages/Prova'
import Estudo from './pages/Estudo'
import Ranking from './pages/Ranking'
import InstalarApp from './pages/InstalarApp'
import { mustInstallFirst } from './lib/pwa'
import { pontosCargo } from './lib/cargos'
import Configuracoes from './pages/Configuracoes'

export default function App() {
  const { ready, authReady, user, profile, backend, cargo } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // No celular/tablet, só libera o uso quando aberto pelo app instalado (PWA)
  if (mustInstallFirst()) return <InstalarApp />
  if (!authReady) return <Splash />
  if (!user) return <Login />
  if (!ready) return <Splash />
  if (!profile) return <Apelido />

  return (
    <div className="app">
      <div className="bg-orbs" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="topbar">
        <button className="icon-btn" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
          <Menu size={22} />
        </button>
        <div className="brand">
          <img src="/icons/favicon.svg" alt="" width={28} height={28} />
          <span>Estudo Banestes TI</span>
        </div>
        <div className="chip" title={`Pontos no perfil ${cargo.curto} (acertos)`}>
          ⭐ {pontosCargo(profile, cargo)}
        </div>
      </header>
      {backend?.mode === 'local' && (
        <div className="banner-local">Modo local: os dados ficam só neste navegador (Firebase ainda não configurado).</div>
      )}
      <main className="content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Inicio />} />
              <Route path="/materia" element={<TestePorMateria />} />
              <Route path="/resultados" element={<Resultados />} />
              <Route path="/prova" element={<Prova />} />
              <Route path="/estudo" element={<Estudo />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/config" element={<Configuracoes />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
