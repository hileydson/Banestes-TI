import { motion } from 'motion/react'
import { useSession } from '../lib/session'

export default function Splash() {
  const { reconectando } = useSession()
  return (
    <div className="splash">
      <motion.img
        src="/icons/favicon.svg"
        width={84}
        height={84}
        alt=""
        animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      />
      <p>{reconectando ? 'Reconectando… verifique sua internet' : 'Carregando…'}</p>
    </div>
  )
}
