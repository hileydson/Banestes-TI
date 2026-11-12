import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, ArrowUp, CheckCircle2, Copy, Download, MoreHorizontal, MoreVertical, PlusSquare, Share, X } from 'lucide-react'
import {
  canPromptInstall,
  chromeIntentUrl,
  consumeInstallParam,
  isAlreadyInstalled,
  isAndroid,
  isAndroidChrome,
  isIOS,
  isIOSSafari,
  onInstallChange,
  promptInstall,
  safariUrl,
  wasInstalledNow
} from '../lib/pwa'

type Guia = null | 'ios' | 'android'

export default function InstalarApp() {
  const [, setTick] = useState(0)
  const [jaInstalado, setJaInstalado] = useState(false)
  const [instalando, setInstalando] = useState(false)
  const [guia, setGuia] = useState<Guia>(null)
  const [veioDoAtalho] = useState(() => consumeInstallParam())
  const [copiado, setCopiado] = useState(false)

  const ios = isIOS()
  const android = isAndroid()
  const desconhecido = !ios && !android
  const noSafari = isIOSSafari()
  const noChrome = isAndroidChrome()

  useEffect(() => {
    const off = onInstallChange(() => setTick((t) => t + 1))
    isAlreadyInstalled().then(setJaInstalado)
    // Chegou pelo atalho “Instalar app”: no Safari já abre o guia
    if (veioDoAtalho && noSafari) setGuia('ios')
    return () => {
      off()
    }
  }, [veioDoAtalho, noSafari])

  const instalado = wasInstalledNow() || jaInstalado
  const podePrompt = canPromptInstall()

  // Botão único “Instalar app” — a ação depende do aparelho e do navegador
  const instalarIOS = () => {
    if (noSafari) setGuia('ios')
    else window.location.href = safariUrl() // abre o Safari já no endereço do app
  }

  const instalarAndroid = async () => {
    if (canPromptInstall()) {
      setInstalando(true)
      try {
        const r = await promptInstall()
        if (r === 'dismissed') setGuia(null)
      } finally {
        setInstalando(false)
      }
      return
    }
    if (!noChrome) {
      window.location.href = chromeIntentUrl() // abre no Chrome, que instala com um toque
      return
    }
    setGuia('android') // Chrome ainda não liberou o botão: mostra o caminho pelo menu
  }

  const copiarEndereco = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      /* ignora */
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
              Agora feche esta página e abra o app pelo ícone <b>“Banestes TI”</b> na tela inicial.
            </p>
          </>
        ) : (
          <>
            <p className="muted">No celular e no tablet, o app é usado instalado, como um aplicativo. Leva poucos segundos.</p>

            {/* iPhone / iPad */}
            {(ios || desconhecido) && (
              <div className="install-block">
                {desconhecido && <div className="install-label">iPhone ou iPad</div>}
                <motion.button className="btn primary big pulse-btn" whileTap={{ scale: 0.97 }} onClick={instalarIOS}>
                  <Download size={20} /> {desconhecido ? 'Instalar no iPhone/iPad' : 'Instalar app'}
                </motion.button>
                {ios && !noSafari && (
                  <p className="muted small">
                    No iPhone e no iPad a instalação é feita pelo <b>Safari</b>. O botão abre o Safari no endereço do app e mostra como concluir.
                  </p>
                )}
              </div>
            )}

            {/* Android */}
            {(android || desconhecido) && (
              <div className="install-block">
                {desconhecido && <div className="install-label">Android</div>}
                <motion.button
                  className={'btn primary big' + (veioDoAtalho || podePrompt ? ' pulse-btn' : '')}
                  whileTap={{ scale: 0.97 }}
                  onClick={instalarAndroid}
                  disabled={instalando}
                >
                  <Download size={20} /> {instalando ? 'Instalando…' : desconhecido ? 'Instalar no Android' : 'Instalar app'}
                </motion.button>
                {android && !noChrome && !podePrompt && (
                  <p className="muted small">O botão abre o app no Google Chrome, onde a instalação é feita com um toque.</p>
                )}
              </div>
            )}

            <button className="link-btn" onClick={copiarEndereco}>
              <Copy size={14} /> {copiado ? 'Endereço copiado!' : 'Copiar endereço do app'}
            </button>
          </>
        )}
        <p className="muted small install-foot">No computador, o app pode ser usado direto pelo navegador.</p>
      </motion.div>

      <AnimatePresence>{guia && <GuiaInstalacao tipo={guia} onFechar={() => setGuia(null)} />}</AnimatePresence>
    </div>
  )
}

function GuiaInstalacao({ tipo, onFechar }: { tipo: 'ios' | 'android'; onFechar(): void }) {
  // iPhone: barra do Safari embaixo; iPad: botão Compartilhar em cima
  const ipad = /iPad|Macintosh/i.test(navigator.userAgent)
  const setaEmBaixo = tipo === 'ios' && !ipad
  return (
    <motion.div className="modal-scrim guia-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar}>
      {tipo === 'ios' && (
        <motion.div
          className={'guia-seta ' + (setaEmBaixo ? 'baixo' : 'cima')}
          animate={{ y: setaEmBaixo ? [0, 14, 0] : [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          {setaEmBaixo ? <ArrowDown size={42} /> : <ArrowUp size={42} />}
        </motion.div>
      )}
      {tipo === 'android' && (
        <motion.div className="guia-seta cima direita" animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
          <ArrowUp size={42} />
        </motion.div>
      )}
      <motion.div
        className="modal glass guia"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="icon-btn modal-x" onClick={onFechar} aria-label="Fechar">
          <X size={20} />
        </button>
        <h2>Instalar em 3 toques</h2>
        {tipo === 'ios' ? (
          <ol className="install-steps big">
            <li>
              Toque em <b>Compartilhar</b> <Share size={18} /> {setaEmBaixo ? '(na barra de baixo do Safari)' : '(no topo do Safari)'}.
              <span className="muted small"> Se não aparecer, toque em <MoreHorizontal size={16} /> e depois em Compartilhar.</span>
            </li>
            <li>
              Role a lista e toque em <b>“Adicionar à Tela de Início”</b> <PlusSquare size={18} />.
            </li>
            <li>
              Toque em <b>Adicionar</b>. Depois, abra o app pelo ícone <b>“Banestes TI”</b>.
            </li>
          </ol>
        ) : (
          <ol className="install-steps big">
            <li>
              Toque no menu <MoreVertical size={18} /> do Chrome (canto superior direito).
            </li>
            <li>
              Toque em <b>“Instalar app”</b> (ou “Adicionar à tela inicial”) e confirme.
            </li>
            <li>
              Abra o app pelo ícone <b>“Banestes TI”</b>.
            </li>
          </ol>
        )}
        <button className="btn primary" onClick={onFechar}>
          Entendi
        </button>
      </motion.div>
    </motion.div>
  )
}
