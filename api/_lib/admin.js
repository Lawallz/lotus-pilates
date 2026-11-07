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

export async function requireAdmin(req, res) {
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
      'SELECT role, banned FROM neon_auth."user" WHERE id = $1::uuid LIMIT 1',
      [payload.sub],
    )

    if (!rows[0] || rows[0].role !== 'admin' || rows[0].banned === true) {
      res.status(403).json({ error: 'Esta conta não tem acesso à gestão da Lotus.' })
      return null
    }

    return { userId: payload.sub }
  } catch {
    res.status(401).json({ error: 'Sua sessão expirou. Entre novamente.' })
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
