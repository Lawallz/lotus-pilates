import { db, methodNotAllowed, parseBody, recordAudit, requireAdmin } from '../_lib/admin.js'

const paymentSelect = `SELECT p.id, p.client_id, p.amount, p.due_date, p.paid_at,
                              CASE WHEN p.status = 'pending' AND p.due_date < current_date
                                   THEN 'overdue' ELSE p.status END AS status,
                              p.method, p.notes, c.full_name AS client_name
                       FROM public.studio_payments p
                       JOIN public.studio_clients c ON c.id = p.client_id`

export default async function handler(req, res) {
  const user = await requireAdmin(req, res)
  if (!user) return

  if (req.method === 'GET') {
    const clientId = req.query?.client_id || null
    const { rows } = await db().query(
      `${paymentSelect} WHERE ($1::uuid IS NULL OR p.client_id = $1::uuid)
       ORDER BY p.due_date DESC LIMIT 500`, [clientId],
    )
    return res.status(200).json({ payments: rows })
  }

  if (req.method === 'POST') {
    const { client_id, amount, due_date, method = null, notes = null } = parseBody(req)
    const numericAmount = Number(amount)
    if (!client_id || !Number.isFinite(numericAmount) || numericAmount <= 0 ||
      !due_date || Number.isNaN(Date.parse(due_date))) {
      return res.status(400).json({ error: 'Informe cliente, valor e vencimento válidos.' })
    }
    const { rows } = await db().query(
      `INSERT INTO public.studio_payments (client_id, amount, due_date, method, notes)
       VALUES ($1::uuid, $2, $3::date, NULLIF($4, ''), NULLIF($5, ''))
       RETURNING id, client_id, amount, due_date, status, method, notes`,
      [client_id, numericAmount, due_date, method, notes],
    )
    await recordAudit(user, 'payment.created', 'payment', rows[0].id, { amount: rows[0].amount, dueDate: rows[0].due_date })
    return res.status(201).json({ payment: rows[0] })
  }

  if (req.method === 'PATCH') {
    const { id, status, method } = parseBody(req)
    if (!id || !['pending', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Situação de pagamento inválida.' })
    }
    const { rows } = await db().query(
      `UPDATE public.studio_payments
       SET status = $2, paid_at = CASE WHEN $2 = 'paid' THEN COALESCE(paid_at, now()) ELSE NULL END,
           method = COALESCE(NULLIF($3, ''), method)
       WHERE id = $1::uuid
       RETURNING id, client_id, amount, due_date, paid_at, status, method, notes`,
      [id, status, method || ''],
    )
    if (!rows[0]) return res.status(404).json({ error: 'Pagamento não encontrado.' })
    await recordAudit(user, `payment.${status}`, 'payment', rows[0].id, { amount: rows[0].amount, dueDate: rows[0].due_date })
    return res.status(200).json({ payment: rows[0] })
  }

  return methodNotAllowed(res, ['GET', 'POST', 'PATCH'])
}
