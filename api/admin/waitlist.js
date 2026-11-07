import { db, methodNotAllowed, parseBody, requireAdmin } from '../_lib/admin.js'
import { offerAvailableSeats } from '../_lib/waitlist.js'

const waitlistSelect = `SELECT w.id, w.class_session_id, w.client_id, w.status,
                               w.queued_at, w.offered_at, c.full_name AS client_name,
                               c.email, c.phone, s.title AS class_title, s.starts_at,
                               s.instructor_name
                        FROM public.class_waitlist w
                        JOIN public.studio_clients c ON c.id = w.client_id
                        JOIN public.class_sessions s ON s.id = w.class_session_id`

export default async function handler(req, res) {
  const user = await requireAdmin(req, res)
  if (!user) return

  if (req.method === 'GET') {
    const { rows } = await db().query(
      `${waitlistSelect} WHERE w.status IN ('waiting', 'offered')
       ORDER BY s.starts_at, w.status DESC, w.queued_at LIMIT 500`,
    )
    return res.status(200).json({ waitlist: rows })
  }

  if (req.method === 'POST') {
    const { client_id, class_session_id } = parseBody(req)
    if (!client_id || !class_session_id) {
      return res.status(400).json({ error: 'Selecione cliente e aula para a lista de espera.' })
    }
    const client = await db().connect()
    try {
      await client.query('BEGIN')
      const { rows: sessions } = await client.query(
        `SELECT id, capacity, status FROM public.class_sessions
         WHERE id = $1::uuid FOR UPDATE`, [class_session_id],
      )
      if (!sessions[0] || sessions[0].status !== 'scheduled') {
        await client.query('ROLLBACK')
        return res.status(404).json({ error: 'Aula não encontrada ou indisponível.' })
      }
      const { rows: existing } = await client.query(
        `SELECT id FROM public.class_bookings
         WHERE client_id = $1::uuid AND class_session_id = $2::uuid
           AND status IN ('confirmed', 'attended', 'no_show')`, [client_id, class_session_id],
      )
      if (existing[0]) {
        await client.query('ROLLBACK')
        return res.status(409).json({ error: 'Este cliente já está reservado nessa aula.' })
      }
      const { rows: occupancy } = await client.query(
        `SELECT
           (SELECT count(*) FROM public.class_bookings WHERE class_session_id = $1::uuid
             AND status IN ('confirmed', 'attended', 'no_show'))::int
           + (SELECT count(*) FROM public.class_waitlist WHERE class_session_id = $1::uuid
             AND status = 'offered')::int AS occupied`, [class_session_id],
      )
      if (occupancy[0].occupied < sessions[0].capacity) {
        const { rows } = await client.query(
          `SELECT public.reserve_class_session($1::uuid, $2::uuid, 'direct', NULL) AS id`,
          [client_id, class_session_id],
        )
        await client.query('COMMIT')
        return res.status(201).json({ booked: true, booking_id: rows[0].id, message: 'Havia uma vaga; a reserva foi confirmada.' })
      }
      const { rows } = await client.query(
        `INSERT INTO public.class_waitlist (client_id, class_session_id)
         VALUES ($1::uuid, $2::uuid)
         RETURNING id, client_id, class_session_id, status, queued_at`,
        [client_id, class_session_id],
      )
      await client.query('COMMIT')
      return res.status(201).json({ booked: false, waitlist: rows[0] })
    } catch (error) {
      await client.query('ROLLBACK')
      if (error.code === '23505') return res.status(409).json({ error: 'Este cliente já está na lista de espera.' })
      if (error.code === 'P0002') return res.status(404).json({ error: 'Cliente não encontrado ou inativo.' })
      throw error
    } finally {
      client.release()
    }
  }

  if (req.method === 'PATCH') {
    const { id, status } = parseBody(req)
    if (!id || !['converted', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Ação de lista de espera inválida.' })
    }
    const client = await db().connect()
    try {
      await client.query('BEGIN')
      const { rows: entries } = await client.query(
        `SELECT w.*, s.capacity, s.status AS session_status
         FROM public.class_waitlist w JOIN public.class_sessions s ON s.id = w.class_session_id
         WHERE w.id = $1::uuid FOR UPDATE OF s, w`, [id],
      )
      if (!entries[0] || !['waiting', 'offered'].includes(entries[0].status)) {
        await client.query('ROLLBACK')
        return res.status(404).json({ error: 'Item ativo da lista não encontrado.' })
      }
      if (status === 'converted') {
        if (entries[0].session_status !== 'scheduled') {
          await client.query('ROLLBACK')
          return res.status(409).json({ error: 'Essa aula não está mais disponível.' })
        }
        if (entries[0].status !== 'offered') {
          await client.query('ROLLBACK')
          return res.status(409).json({ error: 'Uma vaga precisa ser oferecida antes de confirmar.' })
        }
        await client.query(`UPDATE public.class_waitlist SET status = 'converted' WHERE id = $1::uuid`, [id])
        const { rows: bookings } = await client.query(
          `SELECT public.reserve_class_session($1::uuid, $2::uuid, 'direct', NULL) AS id`,
          [entries[0].client_id, entries[0].class_session_id],
        )
        await client.query('COMMIT')
        return res.status(200).json({ converted: true, booking_id: bookings[0].id })
      }
      await client.query(
        `UPDATE public.class_waitlist SET status = 'cancelled' WHERE id = $1::uuid`, [id],
      )
      const offers = await offerAvailableSeats(client, entries[0].class_session_id)
      await client.query('COMMIT')
      return res.status(200).json({ cancelled: true, offers })
    } catch (error) {
      await client.query('ROLLBACK')
      if (['23514', '55000'].includes(error.code)) return res.status(409).json({ error: 'Não há vaga disponível para confirmar essa oferta.' })
      if (error.code === 'P0002') return res.status(404).json({ error: 'Cliente ou aula indisponível.' })
      throw error
    } finally {
      client.release()
    }
  }

  return methodNotAllowed(res, ['GET', 'POST', 'PATCH'])
}
