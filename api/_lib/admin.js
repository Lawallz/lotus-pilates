import { Pool } from 'pg'
import { createRemoteJWKSet, jwtVerify } from 'jose'

let pool
let jwks

function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured')
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 2,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 5000,
      allowExitOnIdle: true,
    })
  }
  return pool
}

function getJwks() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL
  if (!baseUrl) throw new Error('NEON_AUTH_BASE_URL is not configured')
  if (!jwks) {
    const url = new URL(`${baseUrl.replace(/\/$/, '')}/.well-known/jwks.json`)
    jwks = createRemoteJWKSet(url)
  }
  return jwks
}

async function currentUser(req, res) {
  const authorization = req.headers.authorization || ''
  const match = authorization.match(/^Bearer\s+(.+)$/i)
  if (!match) {
    res.status(401).json({ error: 'Entre na sua conta para continuar.' })
    return null
  }

  try {
    const { payload } = await jwtVerify(match[1], getJwks())
    if (typeof payload.sub !== 'string') throw new Error('Missing subject')

    const { rows } = await getPool().query(
      'SELECT id, email, role, banned FROM neon_auth."user" WHERE id = $1::uuid LIMIT 1',
      [payload.sub],
    )

    if (!rows[0] || rows[0].banned === true) {
      res.status(403).json({ error: 'Esta conta não tem acesso à gestão da Lotus.' })
      return null
    }

    return rows[0]
  } catch {
    res.status(401).json({ error: 'Sua sessão expirou. Entre novamente.' })
    return null
  }
}

export async function requireAdmin(req, res) {
  const user = await currentUser(req, res)
  if (!user) return null
  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Esta conta não tem acesso administrativo.' })
    return null
  }
  return { userId: user.id, email: user.email, role: 'admin' }
}

export async function requireStaff(req, res) {
  const user = await currentUser(req, res)
  if (!user) return null
  if (user.role === 'admin') return { userId: user.id, email: user.email, role: 'admin' }

  try {
    const { rows } = await getPool().query(
      `SELECT instructor_name FROM public.studio_staff
       WHERE user_id = $1::uuid AND active = true AND role = 'instructor' LIMIT 1`,
      [user.id],
    )
    if (!rows[0]) {
      res.status(403).json({ error: 'Esta conta não tem acesso à gestão da Lotus.' })
      return null
    }
    return { userId: user.id, email: user.email, role: 'instructor', instructorName: rows[0].instructor_name }
  } catch {
    res.status(503).json({ error: 'Não foi possível carregar as permissões da equipe.' })
    return null
  }
}

export function db() {
  return getPool()
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '))
  return res.status(405).json({ error: 'Método não permitido.' })
}

export function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  return {}
}
