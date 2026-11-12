import { firebaseConfig } from './firebaseConfig'
import type { AppUser, Attempt, EstudoState, ExamState, Profile, Progress, QuickTestState, TestSlot } from './types'

// Documento (em users/{uid}/private) onde cada tipo de teste fica salvo enquanto pausado/em revisão
const docTeste = (slot: TestSlot) => (slot === 'materia' ? 'materiaTest' : 'quickTest')

export const USERNAME_RE = /^[a-z0-9._-]{3,20}$/
const EMAIL_DOMAIN = 'usuario.estudo-banestes.app'
export const usernameToEmail = (u: string) => `${u.toLowerCase()}@${EMAIL_DOMAIN}`
export const emailToUsername = (e?: string | null) =>
  e && e.endsWith('@' + EMAIL_DOMAIN) ? e.slice(0, -(EMAIL_DOMAIN.length + 1)) : undefined

export interface Backend {
  mode: 'firebase' | 'local'
  onAuthChange(cb: (u: AppUser | null) => void): () => void
  loginGoogle(): Promise<void>
  signup(username: string, password: string): Promise<void>
  login(username: string, password: string): Promise<void>
  logout(): Promise<void>
  resetPassword(username: string, master: string, newPassword: string): Promise<void>
  getProfile(uid: string): Promise<Profile | null>
  saveProfile(p: Profile): Promise<void>
  listProfiles(): Promise<Profile[]>
  getProgress(uid: string): Promise<Progress>
  saveProgress(uid: string, p: Progress): Promise<void>
  addAttempt(uid: string, a: Attempt): Promise<void>
  listAttempts(uid: string): Promise<Attempt[]>
  listExams(uid: string): Promise<ExamState[]>
  saveExam(uid: string, e: ExamState): Promise<void>
  getQuickTest(uid: string, slot?: TestSlot): Promise<QuickTestState | null>
  saveQuickTest(uid: string, t: QuickTestState | null, slot?: TestSlot): Promise<void>
  getEstudo(uid: string): Promise<EstudoState>
  saveEstudo(uid: string, e: EstudoState): Promise<void>
}

export class FriendlyError extends Error {}

function traduzErro(err: unknown): Error {
  const code = (err as { code?: string })?.code ?? ''
  const map: Record<string, string> = {
    'auth/invalid-credential': 'Usuário ou senha incorretos.',
    'auth/wrong-password': 'Usuário ou senha incorretos.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/email-already-in-use': 'Esse nome de usuário já está em uso.',
    'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente de novo.',
    'auth/popup-closed-by-user': 'Login com Google cancelado.',
    'auth/network-request-failed': 'Sem conexão com a internet.'
  }
  if (err instanceof FriendlyError) return err
  return new FriendlyError(map[code] ?? (err as Error)?.message ?? 'Erro inesperado.')
}

let backendPromise: Promise<Backend> | null = null
export function getBackend(): Promise<Backend> {
  if (!backendPromise) backendPromise = firebaseConfig ? createFirebaseBackend() : Promise.resolve(createLocalBackend())
  return backendPromise
}

/* ------------------------------------------------------------------ */
/* Firebase                                                            */
/* ------------------------------------------------------------------ */
async function createFirebaseBackend(): Promise<Backend> {
  const { initializeApp } = await import('firebase/app')
  const authMod = await import('firebase/auth')
  const fs = await import('firebase/firestore')

  const app = initializeApp(firebaseConfig!)
  // Sessão guardada de forma permanente no navegador (sem expiração por tempo)
  let auth: import('firebase/auth').Auth
  try {
    auth = authMod.initializeAuth(app, {
      persistence: [authMod.indexedDBLocalPersistence, authMod.browserLocalPersistence],
      popupRedirectResolver: authMod.browserPopupRedirectResolver
    })
  } catch {
    auth = authMod.getAuth(app)
  }
  let db: import('firebase/firestore').Firestore
  try {
    db = fs.initializeFirestore(app, { localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }) })
  } catch {
    db = fs.getFirestore(app)
  }

  const wrap = async <T>(fn: () => Promise<T>) => {
    try {
      return await fn()
    } catch (e) {
      throw traduzErro(e)
    }
  }

  const toUser = (u: import('firebase/auth').User): AppUser => {
    const username = emailToUsername(u.email)
    return {
      uid: u.uid,
      provider: username ? 'password' : 'google',
      username,
      email: username ? null : u.email,
      displayName: u.displayName
    }
  }

  return {
    mode: 'firebase',
    onAuthChange: (cb) => authMod.onAuthStateChanged(auth, (u) => cb(u ? toUser(u) : null)),
    loginGoogle: () =>
      wrap(async () => {
        const provider = new authMod.GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        await authMod.signInWithPopup(auth, provider)
      }),
    signup: (username, password) =>
      wrap(async () => {
        if (!USERNAME_RE.test(username)) throw new FriendlyError('Usuário inválido: use 3 a 20 letras minúsculas, números, ponto, hífen ou _.')
        await authMod.createUserWithEmailAndPassword(auth, usernameToEmail(username), password)
      }),
    login: (username, password) =>
      wrap(async () => {
        await authMod.signInWithEmailAndPassword(auth, usernameToEmail(username.trim()), password)
      }),
    logout: () => authMod.signOut(auth),
    resetPassword: (username, master, newPassword) =>
      wrap(async () => {
        const r = await fetch('/.netlify/functions/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim().toLowerCase(), master, newPassword })
        })
        const data = await r.json().catch(() => ({}))
        if (!r.ok) throw new FriendlyError(data.error ?? 'Não foi possível redefinir a senha.')
      }),
    getProfile: async (uid) => {
      const s = await fs.getDoc(fs.doc(db, 'users', uid))
      return s.exists() ? (s.data() as Profile) : null
    },
    saveProfile: (p) => fs.setDoc(fs.doc(db, 'users', p.uid), { ...p, updatedAt: Date.now() }),
    listProfiles: async () => {
      const s = await fs.getDocs(fs.query(fs.collection(db, 'users'), fs.limit(1000)))
      return s.docs.map((d) => d.data() as Profile)
    },
    getProgress: async (uid) => {
      const s = await fs.getDoc(fs.doc(db, 'users', uid, 'private', 'progress'))
      return s.exists() ? (s.data() as Progress) : { correct: [], wrongCount: {} }
    },
    saveProgress: (uid, p) => fs.setDoc(fs.doc(db, 'users', uid, 'private', 'progress'), p),
    addAttempt: (uid, a) => fs.setDoc(fs.doc(db, 'users', uid, 'attempts', a.id), a),
    listAttempts: async (uid) => {
      const s = await fs.getDocs(fs.query(fs.collection(db, 'users', uid, 'attempts'), fs.orderBy('data', 'asc'), fs.limit(500)))
      return s.docs.map((d) => d.data() as Attempt)
    },
    listExams: async (uid) => {
      const s = await fs.getDocs(fs.collection(db, 'users', uid, 'exams'))
      return s.docs.map((d) => d.data() as ExamState).sort((a, b) => b.startedAt - a.startedAt)
    },
    saveExam: (uid, e) => fs.setDoc(fs.doc(db, 'users', uid, 'exams', e.id), JSON.parse(JSON.stringify(e))),
    getQuickTest: async (uid, slot = 'rapido') => {
      const s = await fs.getDoc(fs.doc(db, 'users', uid, 'private', docTeste(slot)))
      return s.exists() ? ((s.data().teste as QuickTestState | null) ?? null) : null
    },
    saveQuickTest: (uid, t, slot = 'rapido') => fs.setDoc(fs.doc(db, 'users', uid, 'private', docTeste(slot)), { teste: t ? JSON.parse(JSON.stringify(t)) : null }),
    getEstudo: async (uid) => {
      const s = await fs.getDoc(fs.doc(db, 'users', uid, 'private', 'estudo'))
      const d = s.exists() ? (s.data() as Partial<EstudoState>) : {}
      return { entendidos: d.entendidos ?? {}, pausa: d.pausa ?? null }
    },
    saveEstudo: (uid, e) => fs.setDoc(fs.doc(db, 'users', uid, 'private', 'estudo'), JSON.parse(JSON.stringify(e)))
  }
}

/* ------------------------------------------------------------------ */
/* Modo local (sem Firebase configurado) — dados apenas no navegador   */
/* ------------------------------------------------------------------ */
function createLocalBackend(): Backend {
  const KEY = 'bti-local-db'
  type DB = {
    accounts: Record<string, { uid: string; password: string }>
    session: string | null
    profiles: Record<string, Profile>
    progress: Record<string, Progress>
    attempts: Record<string, Attempt[]>
    exams: Record<string, Record<string, ExamState>>
    quick?: Record<string, QuickTestState | null>
    estudo?: Record<string, EstudoState>
  }
  const load = (): DB => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) return JSON.parse(raw)
    } catch {
      /* ignora */
    }
    return { accounts: {}, session: null, profiles: {}, progress: {}, attempts: {}, exams: {} }
  }
  const save = (db: DB) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(db))
    } catch {
      /* ignora */
    }
  }
  const listeners = new Set<(u: AppUser | null) => void>()
  const current = (): AppUser | null => {
    const db = load()
    if (!db.session) return null
    const entry = Object.entries(db.accounts).find(([, v]) => v.uid === db.session)
    return entry ? { uid: entry[1].uid, provider: 'local', username: entry[0] } : null
  }
  const emit = () => listeners.forEach((l) => l(current()))

  return {
    mode: 'local',
    onAuthChange(cb) {
      listeners.add(cb)
      setTimeout(() => cb(current()), 0)
      return () => listeners.delete(cb)
    },
    async loginGoogle() {
      throw new FriendlyError('Login com Google disponível somente após configurar o Firebase.')
    },
    async signup(username, password) {
      if (!USERNAME_RE.test(username)) throw new FriendlyError('Usuário inválido: use 3 a 20 letras minúsculas, números, ponto, hífen ou _.')
      if (password.length < 6) throw new FriendlyError('A senha precisa ter pelo menos 6 caracteres.')
      const db = load()
      if (db.accounts[username]) throw new FriendlyError('Esse nome de usuário já está em uso.')
      const uid = 'local-' + Math.random().toString(36).slice(2, 10)
      db.accounts[username] = { uid, password }
      db.session = uid
      save(db)
      emit()
    },
    async login(username, password) {
      const db = load()
      const acc = db.accounts[username.trim().toLowerCase()]
      if (!acc || acc.password !== password) throw new FriendlyError('Usuário ou senha incorretos.')
      db.session = acc.uid
      save(db)
      emit()
    },
    async logout() {
      const db = load()
      db.session = null
      save(db)
      emit()
    },
    async resetPassword(username, master, newPassword) {
      if (master !== '12345678') throw new FriendlyError('Senha mestre incorreta.')
      if (newPassword.length < 6) throw new FriendlyError('A nova senha precisa ter pelo menos 6 caracteres.')
      const db = load()
      const acc = db.accounts[username.trim().toLowerCase()]
      if (!acc) throw new FriendlyError('Usuário não encontrado.')
      acc.password = newPassword
      save(db)
    },
    async getProfile(uid) {
      return load().profiles[uid] ?? null
    },
    async saveProfile(p) {
      const db = load()
      db.profiles[p.uid] = { ...p, updatedAt: Date.now() }
      save(db)
    },
    async listProfiles() {
      return Object.values(load().profiles)
    },
    async getProgress(uid) {
      return load().progress[uid] ?? { correct: [], wrongCount: {} }
    },
    async saveProgress(uid, p) {
      const db = load()
      db.progress[uid] = p
      save(db)
    },
    async addAttempt(uid, a) {
      const db = load()
      ;(db.attempts[uid] ??= []).push(a)
      save(db)
    },
    async listAttempts(uid) {
      return load().attempts[uid] ?? []
    },
    async listExams(uid) {
      return Object.values(load().exams[uid] ?? {}).sort((a, b) => b.startedAt - a.startedAt)
    },
    async saveExam(uid, e) {
      const db = load()
      ;(db.exams[uid] ??= {})[e.id] = e
      save(db)
    },
    async getQuickTest(uid, slot = 'rapido') {
      return load().quick?.[slot === 'rapido' ? uid : `${uid}:${slot}`] ?? null
    },
    async saveQuickTest(uid, t, slot = 'rapido') {
      const db = load()
      ;(db.quick ??= {})[slot === 'rapido' ? uid : `${uid}:${slot}`] = t
      save(db)
    },
    async getEstudo(uid) {
      return load().estudo?.[uid] ?? { entendidos: {}, pausa: null }
    },
    async saveEstudo(uid, e) {
      const db = load()
      ;(db.estudo ??= {})[uid] = e
      save(db)
    }
  }
}
