import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { getBackend, type Backend } from './backend'
import { loadQuestions, getQuestion, type Question } from './questions'
import type { MateriaId } from './materias'
import { emptyProfile, type AppUser, type Attempt, type Profile, type Progress, type Score } from './types'

interface SessionCtx {
  ready: boolean
  authReady: boolean
  reconectando: boolean
  backend: Backend | null
  user: AppUser | null
  profile: Profile | null
  progress: Progress
  questions: Question[]
  setNickname(n: string): Promise<void>
  record(tipo: Attempt['tipo'], respostas: Resposta[], extra?: Partial<Attempt>): Promise<Attempt>
  reloadProfile(): Promise<void>
  bumpQuickStarts(): Promise<number>
}

export interface Resposta {
  id: string
  marcada: number | undefined // índice ORIGINAL marcado
}

const Ctx = createContext<SessionCtx>(null as unknown as SessionCtx)
export const useSession = () => useContext(Ctx)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [backend, setBackend] = useState<Backend | null>(null)
  const [user, setUser] = useState<AppUser | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [progress, setProgress] = useState<Progress>({ correct: [], wrongCount: {} })
  const [questions, setQuestions] = useState<Question[]>([])
  const [dataReady, setDataReady] = useState(false)
  const [reconectando, setReconectando] = useState(false)

  useEffect(() => {
    let unsub = () => {}
    getBackend().then((b) => {
      setBackend(b)
      unsub = b.onAuthChange((u) => {
        // só troca o usuário se ele realmente mudou (evita recarregar tudo à toa)
        setUser((prev) => (prev?.uid === u?.uid ? prev : u))
        setAuthReady(true)
      })
    })
    loadQuestions().then(setQuestions)
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!backend) return
    if (!user) {
      setProfile(null)
      setDataReady(authReady)
      return
    }
    setDataReady(false)
    setReconectando(false)
    let cancelado = false
    let timer: ReturnType<typeof setTimeout> | undefined
    // Se a conexão falhar (ex.: aba voltando de suspensão), tenta de novo em vez de tratar como “sem perfil”
    const carregar = (tentativa: number) => {
      Promise.all([backend.getProfile(user.uid), backend.getProgress(user.uid)])
        .then(([p, pr]) => {
          if (cancelado) return
          setProfile(p)
          setProgress({ correct: pr.correct ?? [], wrongCount: pr.wrongCount ?? {}, quickStarts: pr.quickStarts ?? 0 })
          setReconectando(false)
          setDataReady(true)
        })
        .catch(() => {
          if (cancelado) return
          setReconectando(true)
          timer = setTimeout(() => carregar(tentativa + 1), Math.min(2000 * (tentativa + 1), 10000))
        })
    }
    carregar(0)
    return () => {
      cancelado = true
      if (timer) clearTimeout(timer)
    }
  }, [backend, user, authReady])

  const reloadProfile = useCallback(async () => {
    if (!backend || !user) return
    setProfile(await backend.getProfile(user.uid))
  }, [backend, user])

  const setNickname = useCallback(
    async (n: string) => {
      if (!backend || !user) return
      // Nunca recria um perfil zerado: confere no servidor se ele já existe
      const atual = profile ?? (await backend.getProfile(user.uid))
      const p = atual ? { ...atual, nickname: n } : emptyProfile(user.uid, n)
      await backend.saveProfile(p)
      setProfile(p)
    },
    [backend, user, profile]
  )

  const record = useCallback(
    async (tipo: Attempt['tipo'], respostas: Resposta[], extra: Partial<Attempt> = {}) => {
      if (!backend || !user || !profile) throw new Error('Sem sessão')
      const p: Profile = structuredClone(profile)
      const pr: Progress = { ...progress, correct: [...progress.correct], wrongCount: { ...progress.wrongCount } }
      const correctSet = new Set(pr.correct)
      const porMateria: Partial<Record<MateriaId, Score>> = {}
      let acertos = 0
      for (const r of respostas) {
        const q = getQuestion(r.id)
        if (!q) continue
        const ok = r.marcada === q.c
        const sm = (p.stats[q.m] ??= { a: 0, e: 0 })
        const sa = (p.areaStats[q.area] ??= { a: 0, e: 0 })
        const am = (porMateria[q.m] ??= { a: 0, e: 0 })
        if (ok) {
          acertos++
          sm.a++
          sa.a++
          am.a++
          correctSet.add(q.id)
        } else {
          sm.e++
          sa.e++
          am.e++
          pr.wrongCount[q.id] = (pr.wrongCount[q.id] ?? 0) + 1
        }
      }
      pr.correct = [...correctSet]
      p.pontos += acertos
      if (tipo === 'teste') p.testes += 1
      if (tipo === 'prova') {
        p.provas += 1
        const nota = extra.nota ?? 0
        p.somaNotasProvas = Math.round((p.somaNotasProvas + nota) * 100) / 100
        p.melhorNotaProva = Math.max(p.melhorNotaProva, nota)
        p.ultimaNotaProva = nota
      }
      const attempt: Attempt = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tipo,
        data: Date.now(),
        total: respostas.length,
        acertos,
        porMateria,
        ...extra
      }
      await Promise.all([backend.saveProfile(p), backend.saveProgress(user.uid, pr), backend.addAttempt(user.uid, attempt)])
      setProfile(p)
      setProgress(pr)
      return attempt
    },
    [backend, user, profile, progress]
  )

  const bumpQuickStarts = useCallback(async () => {
    const n = (progress.quickStarts ?? 0) + 1
    const pr: Progress = { ...progress, quickStarts: n }
    setProgress(pr)
    if (backend && user) await backend.saveProgress(user.uid, pr).catch(() => {})
    return n
  }, [backend, user, progress])

  return (
    <Ctx.Provider
      value={{
        ready: authReady && dataReady && questions.length > 0,
        authReady,
        reconectando,
        backend,
        user,
        profile,
        progress,
        questions,
        setNickname,
        record,
        reloadProfile,
        bumpQuickStarts
      }}
    >
      {children}
    </Ctx.Provider>
  )
}
