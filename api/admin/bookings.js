import { db, methodNotAllowed, parseBody, recordAudit, requireAdmin, requireStaff } from '../_lib/admin.js'
import { offerAvailableSeats } from '../_lib/waitlist.js'

const bookingSelect = `SELECT b.id, b.class_session_id, b.client_id, b.source, b.status,
                              b.booked_at, b.cancelled_at, c.full_name AS client_name,
                              s.title AS class_title, s.starts_at, s.ends_at,
                              s.instructor_name
                       FROM public.class_bookings b
                       JOIN public.studio_clients c ON c.id = b.client_id
                       JOIN public.class_sessions s ON s.id = b.class_session_id`

export default async function handler(req, res) {
  const user = req.method === 'GET' || req.method === 'PATCH'
    ? await requireStaff(req, res)
    : await requireAdmin(req, res)
  if (!user) return

  if (req.method === 'GET') {
    const { rows } = await db().query(
      `${bookingSelect}
       WHERE ($1::text IS NULL OR s.instructor_name = $1::text)
       ORDER BY s.starts_at DESC, c.full_name LIMIT 500`,
      [user.role === 'instructor' ? user.instructorName : null],
    )
    return res.status(200).json({ bookings: rows })
  }

  if (req.method === 'POST') {
    const { client_id, class_session_id, source = 'direct', source_booking_ref = null } = parseBody(req)
    if (!client_id || !class_session_id || !['direct', 'wellhub', 'totalpass', 'classpass'].includes(source)) {
      return res.status(400).json({ error: 'Informe o cliente, a aula e uma origem válida.' })
    }

    try {
      const { rows } = await db().query(
        'SELECT public.reserve_class_session($1::uuid, $2::uuid, $3::text, $4::text) AS id',
        [client_id, class_session_id, source, source_booking_ref],
      )
      const booking = await db().query(`${bookingSelect} WHERE b.id = $1`, [rows[0].id])
      await recordAudit(user, 'booking.created', 'booking', booking.rows[0]?.id, {
        client: booking.rows[0]?.client_name, classTitle: booking.rows[0]?.class_title, source,
      })
      return res.status(201).json({ booking: booking.rows[0] })
    } catch (error) {
      if (['23514', '23505', '55000'].includes(error.code)) {
        return res.status(409).json({ error: error.message === 'Class session is full' ? 'Essa aula já está lotada.' : 'Não foi possível concluir essa reserva.' })
      }
      if (error.code === 'P0002') return res.status(404).json({ error: 'Aula ou cliente não encontrado.' })
      throw error
    }
  }

  if (req.method === 'PATCH') {
    const { id, status } = parseBody(req)
    if (!id || !['confirmed', 'cancelled', 'attended', 'no_show'].includes(status)) {
      return res.status(400).json({ error: 'Situação da reserva inválida.' })
    }
    if (user.role === 'instructor') {
      if (!['attended', 'no_show'].includes(status)) {
        return res.status(403).json({ error: 'Instrutoras só podem registrar presença ou falta.' })
      }
      const { rows } = await db().query(
        `UPDATE public.class_bookings b
         SET status = $2, cancelled_at = NULL
         FROM public.class_sessions s
         WHERE b.id = $1::uuid AND s.id = b.class_session_id
           AND s.instructor_name = $3
           AND b.status IN ('confirmed', 'attended', 'no_show')
         RETURNING b.id`,
        [id, status, user.instructorName],
      )
      if (!rows[0]) return res.status(404).json({ error: 'Reserva não encontrada na sua agenda.' })
      const booking = await db().query(`${bookingSelect} WHERE b.id = $1`, [id])
      await recordAudit(user, `booking.${status}`, 'booking', id, {
        client: booking.rows[0]?.client_name, classTitle: booking.rows[0]?.class_title,
      })
      return res.status(200).json({ booking: booking.rows[0] })
    }
    if (status === 'cancelled') {
      const client = await db().connect()
      try {
        await client.query('BEGIN')
        const { rows: sessionRows } = await client.query(
          `SELECT s.id AS class_session_id FROM public.class_bookings b
           JOIN public.class_sessions s ON s.id = b.class_session_id
           WHERE b.id = $1::uuid FOR UPDATE OF s`,
          [id],
        )
        if (!sessionRows[0]) {
          await client.query('ROLLBACK')
          return res.status(404).json({ error: 'Reserva não encontrada.' })
        }
        const { rows } = await client.query(
          `UPDATE public.class_bookings
           SET status = 'cancelled', cancelled_at = now()
           WHERE id = $1::uuid AND status IN ('confirmed', 'attended', 'no_show')
           RETURNING id`,
          [id],
        )
        if (!rows[0]) {
          await client.query('ROLLBACK')
          return res.status(409).json({ error: 'Essa reserva já foi cancelada.' })
        }
        const offers = await offerAvailableSeats(client, sessionRows[0].class_session_id)
        await client.query('COMMIT')
        const booking = await client.query(`${bookingSelect} WHERE b.id = $1`, [id])
        await recordAudit(user, 'booking.cancelled', 'booking', id, {
          client: booking.rows[0]?.client_name, classTitle: booking.rows[0]?.class_title,
        })
        return res.status(200).json({ booking: booking.rows[0], offers })
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
      }
    }

    const { rows } = await db().query(
      `UPDATE public.class_bookings
       SET status = $2, cancelled_at = NULL
       WHERE id = $1::uuid
       RETURNING id`,
      [id, status],
    )
    if (!rows[0]) return res.status(404).json({ error: 'Reserva não encontrada.' })
    const booking = await db().query(`${bookingSelect} WHERE b.id = $1`, [id])
    await recordAudit(user, `booking.${status}`, 'booking', id, {
      client: booking.rows[0]?.client_name, classTitle: booking.rows[0]?.class_title,
    })
    return res.status(200).json({ booking: booking.rows[0] })
  }

  return methodNotAllowed(res, ['GET', 'POST', 'PATCH'])
}
