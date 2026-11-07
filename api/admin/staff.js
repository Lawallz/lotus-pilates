import { db, methodNotAllowed, parseBody, requireAdmin } from '../_lib/admin.js'

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res)
  if (!admin) return

  if (req.method === 'GET') {
    const { rows } = await db().query(
      `SELECT s.user_id, u.email, s.role, s.instructor_name, s.active, s.created_at
       FROM public.studio_staff s
       JOIN neon_auth."user" u ON u.id = s.user_id
       ORDER BY lower(s.instructor_name), lower(u.email)`
    )
    return res.status(200).json({ staff: rows })
  }

  if (req.method === 'POST') {
    const { email, instructor_name } = parseBody(req)
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const name = typeof instructor_name === 'string' ? instructor_name.trim() : ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || name.length < 2 || name.length > 160) {
      return res.status(400).json({ error: 'Informe um e-mail válido e o nome da instrutora.' })
    }
    const { rows: users } = await db().query(
      `SELECT id, role, banned FROM neon_auth."user" WHERE lower(email) = $1 LIMIT 1`,
      [normalizedEmail],
    )
    if (!users[0] || users[0].banned) {
      return res.status(404).json({ error: 'Esse e-mail ainda não tem uma conta ativa no Neon Auth.' })
    }
    if (users[0].role === 'admin') {
      return res.status(409).json({ error: 'Essa conta já tem acesso administrativo.' })
    }
    const { rows } = await db().query(
      `INSERT INTO public.studio_staff (user_id, instructor_name, active)
       VALUES ($1::uuid, $2, true)
       ON CONFLICT (user_id) DO UPDATE
         SET instructor_name = EXCLUDED.instructor_name, active = true
       RETURNING user_id, role, instructor_name, active, created_at`,
      [users[0].id, name],
    )
    return res.status(201).json({ staff: { ...rows[0], email: normalizedEmail } })
  }

  if (req.method === 'PATCH') {
    const { user_id, instructor_name, active } = parseBody(req)
    const name = typeof instructor_name === 'string' ? instructor_name.trim() : null
    if (!user_id || (name !== null && (name.length < 2 || name.length > 160)) ||
      (active !== undefined && typeof active !== 'boolean') || (name === null && active === undefined)) {
      return res.status(400).json({ error: 'Confira o nome e a situação da instrutora.' })
    }
    const { rows } = await db().query(
      `UPDATE public.studio_staff
       SET instructor_name = COALESCE($2, instructor_name), active = COALESCE($3, active)
       WHERE user_id = $1::uuid
       RETURNING user_id, role, instructor_name, active, created_at`,
      [user_id, name, active ?? null],
    )
    if (!rows[0]) return res.status(404).json({ error: 'Instrutora não encontrada.' })
    const { rows: users } = await db().query(
      'SELECT email FROM neon_auth."user" WHERE id = $1::uuid LIMIT 1', [user_id],
    )
    return res.status(200).json({ staff: { ...rows[0], email: users[0]?.email || '' } })
  }

  return methodNotAllowed(res, ['GET', 'POST', 'PATCH'])
}
