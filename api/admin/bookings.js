import { db, methodNotAllowed, parseBody, requireAdmin } from '../_lib/admin.js'

const bookingSelect = `SELECT b.id, b.class_session_id, b.client_id, b.source, b.status,
                              b.booked_at, b.cancelled_at, c.full_name AS client_name,
                              s.title AS class_title, s.starts_at
                       FROM public.class_bookings b
                       JOIN public.studio_clients c ON c.id = b.client_id
                       JOIN public.class_sessions s ON s.id = b.class_session_id`

export default async function handler(req, res) {
  const user = await requireAdmin(req, res)
  if (!user) return

  if (req.method === 'GET') {
    const { rows } = await db().query(
      `${bookingSelect} ORDER BY s.starts_at DESC, c.full_name LIMIT 500`,
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
    const { rows } = await db().query(
      `UPDATE public.class_bookings
       SET status = $2, cancelled_at = CASE WHEN $2 = 'cancelled' THEN now() ELSE NULL END
       WHERE id = $1::uuid
       RETURNING id`,
      [id, status],
    )
    if (!rows[0]) return res.status(404).json({ error: 'Reserva não encontrada.' })
    const booking = await db().query(`${bookingSelect} WHERE b.id = $1`, [id])
    return res.status(200).json({ booking: booking.rows[0] })
  }

  return methodNotAllowed(res, ['GET', 'POST', 'PATCH'])
}
