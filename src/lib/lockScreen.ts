import { isMobileOrTablet } from './pwa'

// Impede zoom (pinça, duplo toque, Ctrl + roda/teclas) e mantém o app sempre em retrato.
export function lockScreen() {
  const prevent = (e: Event) => e.preventDefault()

  // iOS Safari ignora user-scalable=no: bloqueia gestos de pinça
  document.addEventListener('gesturestart', prevent, { passive: false })
  document.addEventListener('gesturechange', prevent, { passive: false })
  document.addEventListener('gestureend', prevent, { passive: false })

  // Pinça com dois dedos
  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length > 1) e.preventDefault()
    },
    { passive: false }
  )

  // Duplo toque para zoom: bloqueado via CSS (touch-action: manipulation), sem atrasar toques legítimos

  // Desktop: Ctrl/Cmd + roda do mouse e Ctrl/Cmd + (+ / - / 0)
  window.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault()
    },
    { passive: false }
  )
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0', '_'].includes(e.key)) e.preventDefault()
  })

  // Orientação: funciona em PWA instalada / tela cheia; no navegador comum, o CSS mostra um aviso
  const tryLock = () => {
    const o = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }
    o?.lock?.('portrait').catch(() => {})
  }
  tryLock()
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && tryLock())

  // Onde a trava não funciona (iPhone/iPad, ou Android que ignorar o pedido), o app
  // “desfaz” a rotação: com o aparelho deitado, o conteúdo é girado de volta e continua em pé.
  if (isMobileOrTablet()) {
    const aplicar = () => forcarRetrato()
    window.addEventListener('resize', aplicar)
    window.addEventListener('orientationchange', () => setTimeout(aplicar, 50))
    screen.orientation?.addEventListener?.('change', aplicar)
    aplicar()
  }
}

function anguloTela(): number {
  const a = screen.orientation?.angle ?? (window as Window & { orientation?: number }).orientation ?? 0
  return ((a % 360) + 360) % 360 // 0, 90, 180 ou 270
}

function forcarRetrato() {
  const html = document.documentElement
  const ang = anguloTela()
  const deitado = (ang === 90 || ang === 270) && window.innerWidth > window.innerHeight
  html.classList.toggle('forca-retrato', deitado)
  html.classList.toggle('rot-90', deitado && ang === 90)
  html.classList.toggle('rot-270', deitado && ang === 270)
  if (deitado) {
    // dimensões do “retrato virtual”: largura = altura da tela deitada, e vice-versa
    html.style.setProperty('--ret-w', `${window.innerHeight}px`)
    html.style.setProperty('--ret-h', `${window.innerWidth}px`)
  }
}
