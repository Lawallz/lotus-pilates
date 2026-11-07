import { db, methodNotAllowed, requireAdmin } from '../_lib/admin.js'

export default async function handler(req, res) {
  const user = await requireAdmin(req, res)
  if (!user) return
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])

  const { rows } = await db().query(
    `SELECT b.id AS booking_id, c.full_name AS client_name, c.phone,
            s.id AS class_session_id, s.title AS class_title,
            s.instructor_name, s.starts_at, s.ends_at
     FROM public.class_bookings b
     JOIN public.studio_clients c ON c.id = b.client_id
     JOIN public.class_sessions s ON s.id = b.class_session_id
     WHERE b.status = 'confirmed' AND s.status = 'scheduled'
       AND s.starts_at >= now() AND s.starts_at < now() + interval '7 days'
     ORDER BY s.starts_at, lower(c.full_name)
     LIMIT 500`,
  )
  return res.status(200).json({ reminders: rows })
}
