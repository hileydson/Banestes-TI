// Leitura em voz alta, gratuita, com a voz do próprio aparelho (Web Speech API / speechSynthesis).
// Fala trecho a trecho: permite pausar e continuar de onde parou, e evita o corte de falas longas do Chrome.
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Trecho } from './estudo'

export const falaSuportada = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

function vozPortugues(): SpeechSynthesisVoice | undefined {
  const vozes = window.speechSynthesis.getVoices()
  const br = vozes.filter((v) => /^pt[-_]BR/i.test(v.lang))
  const pt = br.length ? br : vozes.filter((v) => /^pt/i.test(v.lang))
  // vozes mais naturais costumam ter estes nomes (Google, Luciana no iPhone, Francisca/Thalita no Windows)
  return pt.find((v) => /google|luciana|francisca|thalita|natural/i.test(v.name)) ?? pt[0]
}

export type EstadoFala = 'parado' | 'falando' | 'pausado'

export function useFala(trechos: Trecho[]) {
  const [estado, setEstado] = useState<EstadoFala>('parado')
  const [indice, setIndice] = useState(0)
  const [erro, setErro] = useState<string | null>(null)
  const [velocidade, setVelocidade] = useState(() => {
    try {
      return Number(localStorage.getItem('bti-fala-vel')) || 1
    } catch {
      return 1
    }
  })
  const token = useRef(0) // invalida callbacks de falas canceladas
  const indiceRef = useRef(0)
  const velRef = useRef(velocidade)
  velRef.current = velocidade
  const trechosRef = useRef(trechos)
  trechosRef.current = trechos
  const wakeLock = useRef<{ release(): Promise<void> } | null>(null)

  // carrega a lista de vozes (no Chrome ela chega depois)
  useEffect(() => {
    if (!falaSuportada()) return
    const s = window.speechSynthesis
    s.getVoices()
    const f = () => s.getVoices()
    s.addEventListener?.('voiceschanged', f)
    return () => s.removeEventListener?.('voiceschanged', f)
  }, [])

  // Mantém a tela acesa enquanto fala (com a tela apagada o aparelho interrompe a voz)
  const segurarTela = async (ligar: boolean) => {
    try {
      if (ligar && !wakeLock.current && 'wakeLock' in navigator) {
        wakeLock.current = await (navigator as Navigator & { wakeLock: { request(t: 'screen'): Promise<{ release(): Promise<void> }> } }).wakeLock.request('screen')
      } else if (!ligar && wakeLock.current) {
        await wakeLock.current.release()
        wakeLock.current = null
      }
    } catch {
      /* sem suporte: segue sem segurar a tela */
    }
  }

  const falar = useCallback((i: number) => {
    const s = window.speechSynthesis
    const meu = ++token.current
    s.cancel()
    const lista = trechosRef.current
    if (i >= lista.length) {
      indiceRef.current = 0
      setIndice(0)
      setEstado('parado')
      segurarTela(false)
      return
    }
    indiceRef.current = i
    setIndice(i)
    setEstado('falando')
    segurarTela(true)
    const u = new SpeechSynthesisUtterance(lista[i].texto)
    u.lang = 'pt-BR'
    const v = vozPortugues()
    if (v) u.voice = v
    u.rate = velRef.current
    u.onend = () => {
      if (token.current === meu) falar(i + 1)
    }
    u.onerror = (e) => {
      if (token.current !== meu) return
      if (e.error === 'interrupted' || e.error === 'canceled') return
      if (e.error === 'not-allowed') {
        // iOS/Android bloquearam a fala sem toque do usuário: pede novo toque
        token.current++
        setEstado('pausado')
        setErro('O aparelho pediu um toque para liberar o áudio. Toque em Continuar.')
        segurarTela(false)
        return
      }
      if (['synthesis-failed', 'synthesis-unavailable', 'language-unavailable', 'voice-unavailable', 'audio-hardware', 'audio-busy'].includes(e.error)) {
        // sem voz disponível: para em vez de “pular” o texto inteiro em silêncio
        token.current++
        window.speechSynthesis.cancel()
        setEstado(i > 0 ? 'pausado' : 'parado')
        setErro(
          'Não foi possível usar a voz deste aparelho. Verifique se há uma voz em português instalada (no Android: Configurações › Acessibilidade › Saída de texto para fala; no iPhone: Ajustes › Acessibilidade › Conteúdo Falado › Vozes).'
        )
        segurarTela(false)
        return
      }
      // erro pontual em um trecho: pula para o próximo em vez de travar
      falar(i + 1)
    }
    s.speak(u)
    // iOS às vezes começa “pausado” depois de um cancel()
    if (s.paused) s.resume()
  }, [])

  const tocar = useCallback(() => {
    setErro(null)
    falar(indiceRef.current)
  }, [falar])

  // Pausa = interrompe e guarda o trecho (pause() nativo não é confiável no Android)
  const pausar = useCallback(() => {
    token.current++
    window.speechSynthesis.cancel()
    setEstado('pausado')
    segurarTela(false)
  }, [])

  const parar = useCallback(() => {
    token.current++
    if (falaSuportada()) window.speechSynthesis.cancel()
    indiceRef.current = 0
    setIndice(0)
    setEstado('parado')
    segurarTela(false)
  }, [])

  // Define de onde começar sem tocar (ex.: ao retomar um estudo pausado)
  const posicionar = useCallback((i: number) => {
    const n = Math.max(0, Math.min(i, trechosRef.current.length - 1))
    indiceRef.current = n
    setIndice(n)
    if (n > 0) setEstado('pausado')
  }, [])

  const estadoRef = useRef(estado)
  estadoRef.current = estado

  const pular = useCallback(
    (delta: number) => {
      const n = Math.max(0, Math.min(indiceRef.current + delta, trechosRef.current.length - 1))
      if (estadoRef.current === 'falando') falar(n)
      else posicionar(n)
    },
    [falar, posicionar]
  )

  const mudarVelocidade = useCallback(
    (v: number) => {
      setVelocidade(v)
      velRef.current = v
      try {
        localStorage.setItem('bti-fala-vel', String(v))
      } catch {
        /* ignora */
      }
      if (estadoRef.current === 'falando') falar(indiceRef.current)
    },
    [falar]
  )

  // Ao sair da tela ou trocar de assunto, para a voz
  useEffect(() => () => {
    token.current++
    if (falaSuportada()) window.speechSynthesis.cancel()
    wakeLock.current?.release().catch(() => {})
    wakeLock.current = null
  }, [])

  return { estado, indice, erro, total: trechos.length, velocidade, tocar, pausar, parar, posicionar, pular, mudarVelocidade, indiceRef }
}
