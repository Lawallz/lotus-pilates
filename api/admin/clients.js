import { db, methodNotAllowed, parseBody, requireAdmin } from '../_lib/admin.js'

export default async function handler(req, res) {
  const user = await requireAdmin(req, res)
  if (!user) return

  if (req.method === 'GET') {
    const clientId = req.query?.id
    if (clientId) {
      const [{ rows: clientRows }, { rows: bookingRows }, { rows: paymentRows }] = await Promise.all([
        db().query(
          `SELECT id, full_name, email, phone, status, notes, plan_name,
                  plan_monthly_amount, plan_status, next_payment_date, created_at
           FROM public.studio_clients WHERE id = $1::uuid LIMIT 1`,
          [clientId],
        ),
        db().query(
          `SELECT b.id, b.source, b.status, b.booked_at, b.cancelled_at,
                  s.id AS class_session_id, s.title AS class_title,
                  s.instructor_name, s.starts_at, s.ends_at
           FROM public.class_bookings b
           JOIN public.class_sessions s ON s.id = b.class_session_id
           WHERE b.client_id = $1::uuid
           ORDER BY s.starts_at DESC LIMIT 300`,
          [clientId],
        ),
        db().query(
          `SELECT id, amount, due_date, paid_at,
                  CASE WHEN status = 'pending' AND due_date < current_date THEN 'overdue' ELSE status END AS status,
                  method, notes
           FROM public.studio_payments WHERE client_id = $1::uuid
           ORDER BY due_date DESC LIMIT 100`,
          [clientId],
        ),
      ])
      if (!clientRows[0]) return res.status(404).json({ error: 'Cliente não encontrado.' })
      return res.status(200).json({ client: clientRows[0], bookings: bookingRows, payments: paymentRows })
    }
    const { rows } = await db().query(
      `SELECT id, full_name, email, phone, status, plan_name, plan_status,
              plan_monthly_amount, next_payment_date, created_at
       FROM public.studio_clients
       ORDER BY lower(full_name)
       LIMIT 500`,
    )
    return res.status(200).json({ clients: rows })
  }

  if (req.method === 'POST') {
    const { full_name, email, phone, notes = null, plan_name = null,
      plan_monthly_amount = null, plan_status = 'active', next_payment_date = null } = parseBody(req)
    const name = typeof full_name === 'string' ? full_name.trim() : ''
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const normalizedPhone = typeof phone === 'string' ? phone.trim() : ''
    const planAmount = plan_monthly_amount === '' || plan_monthly_amount == null ? null : Number(plan_monthly_amount)
    if (name.length < 2 || name.length > 160 || (!normalizedEmail && !normalizedPhone) ||
      (planAmount !== null && (!Number.isFinite(planAmount) || planAmount < 0)) ||
      !['active', 'paused', 'ended'].includes(plan_status) ||
      (next_payment_date && Number.isNaN(Date.parse(next_payment_date)))) {
      return res.status(400).json({ error: 'Informe o nome e um e-mail ou telefone válido.' })
    }

    try {
      const { rows } = await db().query(
        `INSERT INTO public.studio_clients
           (full_name, email, phone, notes, plan_name, plan_monthly_amount, plan_status, next_payment_date)
         VALUES ($1, NULLIF($2, ''), NULLIF($3, ''), NULLIF($4, ''), NULLIF($5, ''), $6, $7, $8::date)
         RETURNING id, full_name, email, phone, status, notes, plan_name,
                   plan_monthly_amount, plan_status, next_payment_date, created_at`,
        [name, normalizedEmail, normalizedPhone, typeof notes === 'string' ? notes.trim() : '',
          typeof plan_name === 'string' ? plan_name.trim() : '', planAmount, plan_status, next_payment_date || null],
      )
      return res.status(201).json({ client: rows[0] })
    } catch (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Já existe um cliente com esse e-mail.' })
      throw error
    }
  }

  if (req.method === 'PATCH') {
    const { id, full_name, email, phone, notes, plan_name, plan_monthly_amount,
      plan_status, next_payment_date, status } = parseBody(req)
    const name = typeof full_name === 'string' ? full_name.trim() : ''
    const amount = plan_monthly_amount === '' || plan_monthly_amount == null ? null : Number(plan_monthly_amount)
    if (!id || name.length < 2 || name.length > 160 ||
      (!String(email || '').trim() && !String(phone || '').trim()) ||
      (amount !== null && (!Number.isFinite(amount) || amount < 0)) ||
      !['active', 'paused', 'ended'].includes(plan_status) ||
      !['active', 'inactive'].includes(status) ||
      (next_payment_date && Number.isNaN(Date.parse(next_payment_date)))) {
      return res.status(400).json({ error: 'Confira os dados do cliente e do plano.' })
    }
    try {
      const { rows } = await db().query(
        `UPDATE public.studio_clients
         SET full_name = $2, email = NULLIF(lower(trim($3)), ''), phone = NULLIF(trim($4), ''),
             notes = NULLIF(trim($5), ''), plan_name = NULLIF(trim($6), ''),
             plan_monthly_amount = $7, plan_status = $8, next_payment_date = $9::date,
             status = $10
         WHERE id = $1::uuid
         RETURNING id, full_name, email, phone, status, notes, plan_name,
                   plan_monthly_amount, plan_status, next_payment_date, created_at`,
        [id, name, email || '', phone || '', notes || '', plan_name || '', amount,
          plan_status, next_payment_date || null, status],
      )
      if (!rows[0]) return res.status(404).json({ error: 'Cliente não encontrado.' })
      return res.status(200).json({ client: rows[0] })
    } catch (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Já existe um cliente com esse e-mail.' })
      throw error
    }
  }

  return methodNotAllowed(res, ['GET', 'POST', 'PATCH'])
}
