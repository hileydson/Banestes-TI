import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Download, ExternalLink, MoreVertical, PlusSquare, Share } from 'lucide-react'
import {
  canPromptInstall,
  isAlreadyInstalled,
  isAndroid,
  isInAppBrowser,
  isIOS,
  onInstallChange,
  promptInstall,
  wasInstalledNow
} from '../lib/pwa'

export default function InstalarApp() {
  const [, setTick] = useState(0)
  const [jaInstalado, setJaInstalado] = useState(false)
  const [instalando, setInstalando] = useState(false)

  useEffect(() => {
    const off = onInstallChange(() => setTick((t) => t + 1))
    isAlreadyInstalled().then(setJaInstalado)
    return () => {
      off()
    }
  }, [])

  const instalado = wasInstalledNow() || jaInstalado
  const ios = isIOS()
  const android = isAndroid()
  const inApp = isInAppBrowser()
  const podeBotao = canPromptInstall()

  const instalar = async () => {
    setInstalando(true)
    try {
      await promptInstall()
    } finally {
      setInstalando(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="bg-orbs" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <motion.div className="login-card glass install-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <motion.img
          src="/icons/icon-192.png"
          width={88}
          height={88}
          alt=""
          className="install-icon"
          initial={{ scale: 0.6, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.1 }}
        />
        <h1>Estudo Banestes TI</h1>

        {instalado ? (
          <>
            <div className="install-ok">
              <CheckCircle2 size={22} /> App instalado!
            </div>
            <p className="muted">
              Agora feche esta página e abra o app pelo ícone <b>“Banestes TI”</b> na tela inicial do seu {ios ? 'iPhone/iPad' : 'celular'}.
            </p>
          </>
        ) : inApp ? (
          <>
            <p className="muted">Para instalar, abra este link no navegador do celular ({ios ? 'Safari' : 'Chrome'}), e não dentro de outro aplicativo.</p>
            <ol className="install-steps">
              <li>
                Toque no menu <MoreVertical size={16} /> ou em <ExternalLink size={16} /> no canto da tela.
              </li>
              <li>Escolha “Abrir no navegador” ({ios ? 'Safari' : 'Chrome'}).</li>
              <li>Na página que abrir, siga as instruções para instalar.</li>
            </ol>
          </>
        ) : ios ? (
          <>
            <p className="muted">No iPhone e no iPad, o app precisa ser adicionado à Tela de Início para ser usado:</p>
            <ol className="install-steps">
              <li>
                Toque no botão <b>Compartilhar</b> <Share size={16} /> (na barra do Safari, embaixo ou em cima).
              </li>
              <li>
                Role e toque em <b>“Adicionar à Tela de Início”</b> <PlusSquare size={16} />.
              </li>
              <li>
                Toque em <b>Adicionar</b> e abra o app pelo novo ícone <b>“Banestes TI”</b>.
              </li>
            </ol>
            <p className="muted small">Se a opção não aparecer, abra este endereço no Safari.</p>
          </>
        ) : (
          <>
            <p className="muted">No celular e no tablet, o app funciona instalado, como um aplicativo. É rápido e não ocupa quase nada de espaço.</p>
            {podeBotao ? (
              <motion.button className="btn primary big" whileTap={{ scale: 0.97 }} onClick={instalar} disabled={instalando}>
                <Download size={20} /> {instalando ? 'Instalando…' : 'Instalar app'}
              </motion.button>
            ) : (
              <ol className="install-steps">
                <li>
                  Abra o menu do navegador <MoreVertical size={16} /> (canto superior direito).
                </li>
                <li>
                  Toque em <b>“Instalar app”</b> ou <b>“Adicionar à tela inicial”</b>.
                </li>
                <li>
                  Abra o app pelo novo ícone <b>“Banestes TI”</b>.
                </li>
              </ol>
            )}
            {android && !podeBotao && <p className="muted small">Dica: use o Google Chrome para instalar com um toque. Se já instalou, abra pelo ícone na tela inicial.</p>}
          </>
        )}
        <p className="muted small install-foot">No computador, o app pode ser usado direto pelo navegador.</p>
      </motion.div>
    </div>
  )
}
