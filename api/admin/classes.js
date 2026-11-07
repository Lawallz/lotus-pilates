import { db, methodNotAllowed, parseBody, requireAdmin, requireStaff } from '../_lib/admin.js'

export default async function handler(req, res) {
  const user = req.method === 'GET'
    ? await requireStaff(req, res)
    : await requireAdmin(req, res)
  if (!user) return

  if (req.method === 'GET') {
    const from = req.query?.from
    const to = req.query?.to
    const instructor = req.query?.instructor
    const { rows } = await db().query(
      `SELECT s.id, s.title, s.instructor_name, s.starts_at, s.ends_at,
              s.capacity, s.status,
              count(DISTINCT b.id) FILTER (WHERE b.status IN ('confirmed', 'attended', 'no_show'))::int
                + count(DISTINCT w.id) FILTER (WHERE w.status = 'offered')::int AS booked,
              count(DISTINCT w.id) FILTER (WHERE w.status = 'waiting')::int AS waitlist_count
       FROM public.class_sessions s
       LEFT JOIN public.class_bookings b ON b.class_session_id = s.id
       LEFT JOIN public.class_waitlist w ON w.class_session_id = s.id
       WHERE ($1::timestamptz IS NULL OR s.starts_at >= $1::timestamptz)
         AND ($2::timestamptz IS NULL OR s.starts_at < $2::timestamptz)
         AND ($3::text IS NULL OR s.instructor_name = $3::text)
       GROUP BY s.id
       ORDER BY s.starts_at ASC
       LIMIT 200`,
      [from || null, to || null, user.role === 'instructor' ? user.instructorName : instructor || null],
    )
    return res.status(200).json({ classes: rows })
  }

  if (req.method === 'POST') {
    const { title, instructor_name, starts_at, ends_at, capacity, duration, occurrences } = parseBody(req)
    const start = new Date(starts_at)
    const end = new Date(ends_at)
    const numericCapacity = Number(capacity)
    const numericDuration = Number(duration)
    const starts = Array.isArray(occurrences) ? occurrences.map(value => new Date(value)) : [start]
    if (
      typeof title !== 'string' || title.trim().length < 2 || title.trim().length > 120 ||
      typeof instructor_name !== 'string' || instructor_name.trim().length < 2 || instructor_name.trim().length > 160 ||
      !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start ||
      !Number.isInteger(numericCapacity) || numericCapacity < 1 || numericCapacity > 100 ||
      (Array.isArray(occurrences) && (starts.length < 1 || starts.length > 60 ||
        starts.some(value => !Number.isFinite(value.getTime())) ||
        new Set(starts.map(value => value.getTime())).size !== starts.length))
    ) {
      return res.status(400).json({ error: 'Confira o nome, instrutor, horário e capacidade da aula.' })
    }

    const minutes = Number.isInteger(numericDuration) && numericDuration >= 15 && numericDuration <= 180
      ? numericDuration
      : Math.round((end.getTime() - start.getTime()) / 60000)
    if (minutes < 15 || minutes > 180 || starts.some(value => value.getTime() < start.getTime())) {
      return res.status(400).json({ error: 'Confira as datas e a duração das aulas.' })
    }

    const client = await db().connect()
    try {
      await client.query('BEGIN')
      const created = []
      for (const occurrence of starts) {
        const { rows } = await client.query(
          `INSERT INTO public.class_sessions (title, instructor_name, starts_at, ends_at, capacity)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, title, instructor_name, starts_at, ends_at, capacity, status`,
          [title.trim(), instructor_name.trim(), occurrence.toISOString(),
            new Date(occurrence.getTime() + minutes * 60000).toISOString(), numericCapacity],
        )
        created.push({ ...rows[0], booked: 0, waitlist_count: 0 })
      }
      await client.query('COMMIT')
      return res.status(201).json({ classes: created, count: created.length })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  return methodNotAllowed(res, ['GET', 'POST'])
}
