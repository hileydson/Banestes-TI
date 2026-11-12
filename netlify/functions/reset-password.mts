import { createSign } from 'node:crypto'

// Redefinição de senha pela "senha mestre" (somente contas de usuário e senha).
// Usa a API REST do Identity Toolkit com a conta de serviço — sem dependências externas.
// Variáveis de ambiente no Netlify:
//   FIREBASE_SERVICE_ACCOUNT  -> JSON da conta de serviço (Firebase > Configurações do projeto > Contas de serviço)
//   MASTER_RESET_PASSWORD     -> senha mestre (padrão: 12345678)
const EMAIL_DOMAIN = 'usuario.estudo-banestes.app'
const USERNAME_RE = /^[a-z0-9._-]{3,20}$/

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const b64url = (input: string | Buffer) => Buffer.from(input).toString('base64url')

interface ServiceAccount {
  client_email: string
  private_key: string
  project_id: string
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600
    })
  )
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${claims}`)
  const signature = signer.sign(sa.private_key).toString('base64url')
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${signature}`
    })
  })
  const data = await r.json()
  if (!r.ok) throw new Error('token: ' + JSON.stringify(data))
  return data.access_token
}

async function identityToolkit(sa: ServiceAccount, token: string, action: string, body: unknown) {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${sa.project_id}/accounts:${action}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = await r.json()
  if (!r.ok) throw new Error(`${action}: ` + JSON.stringify(data))
  return data
}

export default async (req: Request) => {
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

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) return json(500, { error: 'A redefinição de senha ainda não foi configurada no servidor.' })

  try {
    const sa = JSON.parse(raw) as ServiceAccount
    const token = await getAccessToken(sa)
    const found = await identityToolkit(sa, token, 'lookup', { email: [`${username}@${EMAIL_DOMAIN}`] })
    const user = found.users?.[0]
    if (!user) return json(404, { error: 'Usuário não encontrado.' })
    await identityToolkit(sa, token, 'update', { localId: user.localId, password: newPassword })
    return json(200, { ok: true })
  } catch (e) {
    console.error('reset-password', (e as Error).message)
    return json(500, { error: 'Não foi possível redefinir a senha.' })
  }
}
