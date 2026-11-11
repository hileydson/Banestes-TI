import { motion } from 'motion/react'

export default function Splash() {
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
      <p>Carregando…</p>
    </div>
  )
}
