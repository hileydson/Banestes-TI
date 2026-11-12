// Impede zoom (pinça, duplo toque, Ctrl + roda/teclas) e tenta travar a orientação em retrato.
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
}
