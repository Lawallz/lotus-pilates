import { db, methodNotAllowed, parseBody, requireAdmin } from '../_lib/admin.js'

export default async function handler(req, res) {
  const user = await requireAdmin(req, res)
  if (!user) return

  if (req.method === 'GET') {
    const { rows } = await db().query(
      `SELECT id, full_name, email, phone, status, created_at
       FROM public.studio_clients
       ORDER BY lower(full_name)
       LIMIT 500`,
    )
    return res.status(200).json({ clients: rows })
  }

  if (req.method === 'POST') {
    const { full_name, email, phone } = parseBody(req)
    const name = typeof full_name === 'string' ? full_name.trim() : ''
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const normalizedPhone = typeof phone === 'string' ? phone.trim() : ''
    if (name.length < 2 || name.length > 160 || (!normalizedEmail && !normalizedPhone)) {
      return res.status(400).json({ error: 'Informe o nome e um e-mail ou telefone válido.' })
    }

    try {
      const { rows } = await db().query(
        `INSERT INTO public.studio_clients (full_name, email, phone)
         VALUES ($1, NULLIF($2, ''), NULLIF($3, ''))
         RETURNING id, full_name, email, phone, status, created_at`,
        [name, normalizedEmail, normalizedPhone],
      )
      return res.status(201).json({ client: rows[0] })
    } catch (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Já existe um cliente com esse e-mail.' })
      throw error
    }
  }

  return methodNotAllowed(res, ['GET', 'POST'])
}
