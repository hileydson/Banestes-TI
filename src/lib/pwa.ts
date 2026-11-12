// Detecção de dispositivo/instalação e captura do prompt de instalação (PWA).

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
let installedNow = false
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

// Deve ser chamado o quanto antes (antes do React montar), pois o evento pode disparar cedo.
export function initInstallCapture() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
    emit()
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    installedNow = true
    emit()
  })
}

export function onInstallChange(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export const canPromptInstall = () => !!deferredPrompt
export const wasInstalledNow = () => installedNow

export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) return 'unavailable'
  const ev = deferredPrompt
  await ev.prompt()
  const { outcome } = await ev.userChoice
  deferredPrompt = null
  if (outcome === 'accepted') installedNow = true
  emit()
  return outcome
}

const ua = () => navigator.userAgent || ''

export function isIOS() {
  // iPadOS 13+ se apresenta como “Macintosh”, mas tem tela sensível ao toque
  return /iPhone|iPad|iPod/i.test(ua()) || (/Macintosh/i.test(ua()) && navigator.maxTouchPoints > 1)
}

export function isAndroid() {
  return /Android/i.test(ua())
}

export function isMobileOrTablet() {
  return isIOS() || isAndroid() || /Mobi|Tablet|Silk|Kindle|PlayBook|BlackBerry|Opera Mini|IEMobile/i.test(ua())
}

// Navegadores embutidos em apps (Instagram, Facebook etc.) não permitem instalar PWA
export function isInAppBrowser() {
  return /FBAN|FBAV|Instagram|Line\/|; wv\)|GSA\//i.test(ua())
}

export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

// No celular/tablet, o app só pode ser usado aberto pelo ícone instalado.
export function mustInstallFirst() {
  return isMobileOrTablet() && !isStandalone()
}

// Chrome no Android: detecta se o PWA já está instalado (via related_applications do manifest)
export async function isAlreadyInstalled(): Promise<boolean> {
  const nav = navigator as Navigator & { getInstalledRelatedApps?: () => Promise<unknown[]> }
  try {
    if (nav.getInstalledRelatedApps) return (await nav.getInstalledRelatedApps()).length > 0
  } catch {
    /* ignora */
  }
  return false
}

// ---- Navegadores específicos ----
const OUTROS_IOS = /CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|GSA\/|YaBrowser|DuckDuckGo|Instagram|FBAN|FBAV|Line\/|Twitter|LinkedInApp|Snapchat/i

// Safari “de verdade” no iPhone/iPad (único que instala PWA de forma padrão)
export function isIOSSafari() {
  return isIOS() && /Safari/i.test(ua()) && !OUTROS_IOS.test(ua())
}

// Google Chrome no Android (instala PWA com um toque)
export function isAndroidChrome() {
  return isAndroid() && /Chrome\//i.test(ua()) && !/EdgA|OPR\/|SamsungBrowser|Firefox|; wv\)|YaBrowser|FBAN|FBAV|Instagram|Line\/|GSA\//i.test(ua())
}

const PARAM = 'instalar'

// Abre o app no Safari (iOS 17+) já pedindo para mostrar o guia de instalação
export function safariUrl() {
  const u = new URL(window.location.origin + '/')
  u.searchParams.set(PARAM, '1')
  return 'x-safari-' + u.toString()
}

// Abre o app no Chrome do Android (intent), já pedindo para mostrar a instalação
export function chromeIntentUrl() {
  const host = window.location.host
  return `intent://${host}/?${PARAM}=1#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(
    window.location.origin + '/?' + PARAM + '=1'
  )};end`
}

// Veio de um atalho “Instalar app”? (lê e limpa o parâmetro da URL)
export function consumeInstallParam(): boolean {
  const u = new URL(window.location.href)
  if (u.searchParams.get(PARAM) !== '1') return false
  u.searchParams.delete(PARAM)
  window.history.replaceState(null, '', u.pathname + (u.search ? u.search : '') + u.hash)
  return true
}
