export async function offerAvailableSeats(client, classSessionId) {
  const offers = []
  while (true) {
    const { rows: occupancy } = await client.query(
      `SELECT
         (SELECT count(*) FROM public.class_bookings
          WHERE class_session_id = $1 AND status IN ('confirmed', 'attended', 'no_show'))::int
         +
         (SELECT count(*) FROM public.class_waitlist
          WHERE class_session_id = $1 AND status = 'offered')::int AS occupied,
         capacity
       FROM public.class_sessions WHERE id = $1::uuid FOR UPDATE`,
      [classSessionId],
    )
    if (!occupancy[0] || occupancy[0].occupied >= occupancy[0].capacity) break
    const { rows } = await client.query(
      `SELECT w.id, w.client_id, c.full_name, c.email, c.phone
       FROM public.class_waitlist w
       JOIN public.studio_clients c ON c.id = w.client_id
       WHERE w.class_session_id = $1::uuid AND w.status = 'waiting'
       ORDER BY w.queued_at, w.id
       FOR UPDATE OF w SKIP LOCKED LIMIT 1`,
      [classSessionId],
    )
    if (!rows[0]) break
    const { rows: updated } = await client.query(
      `UPDATE public.class_waitlist SET status = 'offered', offered_at = now()
       WHERE id = $1::uuid
       RETURNING id, client_id, status, offered_at`,
      [rows[0].id],
    )
    offers.push({ ...updated[0], client_name: rows[0].full_name, email: rows[0].email, phone: rows[0].phone })
  }
  return offers
}
