import { db, methodNotAllowed, parseBody, requireAdmin } from '../_lib/admin.js'

export default async function handler(req, res) {
  const user = await requireAdmin(req, res)
  if (!user) return

  if (req.method === 'GET') {
    const { rows } = await db().query(
      `SELECT s.id, s.title, s.instructor_name, s.starts_at, s.ends_at,
              s.capacity, s.status,
              count(b.id) FILTER (WHERE b.status IN ('confirmed', 'attended', 'no_show'))::int AS booked
       FROM public.class_sessions s
       LEFT JOIN public.class_bookings b ON b.class_session_id = s.id
       GROUP BY s.id
       ORDER BY s.starts_at DESC
       LIMIT 200`,
    )
    return res.status(200).json({ classes: rows })
  }

  if (req.method === 'POST') {
    const { title, instructor_name, starts_at, ends_at, capacity } = parseBody(req)
    const start = new Date(starts_at)
    const end = new Date(ends_at)
    const numericCapacity = Number(capacity)
    if (
      typeof title !== 'string' || title.trim().length < 2 || title.trim().length > 120 ||
      typeof instructor_name !== 'string' || instructor_name.trim().length < 2 || instructor_name.trim().length > 160 ||
      !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start ||
      !Number.isInteger(numericCapacity) || numericCapacity < 1 || numericCapacity > 100
    ) {
      return res.status(400).json({ error: 'Confira o nome, instrutor, horário e capacidade da aula.' })
    }

    const { rows } = await db().query(
      `INSERT INTO public.class_sessions (title, instructor_name, starts_at, ends_at, capacity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, instructor_name, starts_at, ends_at, capacity, status`,
      [title.trim(), instructor_name.trim(), start.toISOString(), end.toISOString(), numericCapacity],
    )
    return res.status(201).json({ class: { ...rows[0], booked: 0 } })
  }

  return methodNotAllowed(res, ['GET', 'POST'])
}
