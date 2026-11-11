import type { Context } from '@netlify/functions'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Redefinição de senha pela "senha mestre" (somente contas de usuário e senha).
// Variáveis de ambiente no Netlify:
//   FIREBASE_SERVICE_ACCOUNT  -> JSON da conta de serviço do Firebase (Configurações do projeto > Contas de serviço)
//   MASTER_RESET_PASSWORD     -> senha mestre (padrão: 12345678)
const EMAIL_DOMAIN = 'usuario.estudo-banestes.app'
const USERNAME_RE = /^[a-z0-9._-]{3,20}$/

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export default async (req: Request, _ctx: Context) => {
  if (req.method !== 'POST') return json(405, { error: 'Método não permitido.' })
  let body: { username?: string; master?: string; newPassword?: string }
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'Requisição inválida.' })
  }
  const username = String(body.username ?? '').trim().toLowerCase()
  const master = String(body.master ?? '')
  const newPassword = String(body.newPassword ?? '')
  const expected = process.env.MASTER_RESET_PASSWORD || '12345678'

  if (!USERNAME_RE.test(username)) return json(400, { error: 'Usuário inválido.' })
  if (master !== expected) {
    await new Promise((r) => setTimeout(r, 800))
    return json(403, { error: 'Senha mestre incorreta.' })
  }
  if (newPassword.length < 6) return json(400, { error: 'A nova senha precisa ter pelo menos 6 caracteres.' })

  const sa = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!sa) return json(500, { error: 'Servidor sem a credencial do Firebase configurada.' })
  if (!getApps().length) initializeApp({ credential: cert(JSON.parse(sa)) })

  try {
    const user = await getAuth().getUserByEmail(`${username}@${EMAIL_DOMAIN}`)
    await getAuth().updateUser(user.uid, { password: newPassword })
    return json(200, { ok: true })
  } catch (e) {
    const code = (e as { code?: string }).code
    if (code === 'auth/user-not-found') return json(404, { error: 'Usuário não encontrado.' })
    return json(500, { error: 'Não foi possível redefinir a senha.' })
  }
}
