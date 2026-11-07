import { db, methodNotAllowed, requireAdmin } from '../_lib/admin.js'

export default async function handler(req, res) {
  const user = await requireAdmin(req, res)
  if (!user) return
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])

  const [summary, attendance, occupancy, plans] = await Promise.all([
    db().query(
      `SELECT
         (SELECT count(*)::int FROM public.studio_clients WHERE status = 'active') AS active_clients,
         (SELECT count(*)::int FROM public.class_sessions WHERE starts_at >= now()
           AND status = 'scheduled') AS upcoming_classes,
         (SELECT count(*)::int FROM public.class_bookings WHERE status = 'confirmed') AS active_bookings,
         (SELECT count(*)::int FROM public.class_waitlist WHERE status = 'waiting') AS waiting_clients,
         (SELECT COALESCE(sum(amount), 0)::numeric(12,2) FROM public.studio_payments
           WHERE status = 'paid' AND paid_at >= date_trunc('month', now())) AS received_this_month,
         (SELECT COALESCE(sum(amount), 0)::numeric(12,2) FROM public.studio_payments
           WHERE status = 'pending') AS pending_amount,
         (SELECT count(*)::int FROM public.studio_payments
           WHERE status = 'pending' AND due_date < current_date) AS overdue_payments`,
    ),
    db().query(
      `SELECT count(*) FILTER (WHERE b.status = 'attended')::int AS attended,
              count(*) FILTER (WHERE b.status = 'no_show')::int AS no_show,
              count(*) FILTER (WHERE b.status IN ('attended', 'no_show'))::int AS completed
       FROM public.class_bookings b
       JOIN public.class_sessions s ON s.id = b.class_session_id
       WHERE s.starts_at >= now() - interval '30 days' AND s.starts_at < now()`,
    ),
    db().query(
      `SELECT s.id, s.title, s.instructor_name, s.starts_at, s.capacity,
              count(DISTINCT b.id) FILTER (WHERE b.status IN ('confirmed', 'attended', 'no_show'))::int
                + count(DISTINCT w.id) FILTER (WHERE w.status = 'offered')::int AS occupied,
              round(100.0 * (count(DISTINCT b.id) FILTER (WHERE b.status IN ('confirmed', 'attended', 'no_show'))
                    + count(DISTINCT w.id) FILTER (WHERE w.status = 'offered'))
                    / NULLIF(s.capacity, 0), 1) AS occupancy_percent
       FROM public.class_sessions s LEFT JOIN public.class_bookings b ON b.class_session_id = s.id
       LEFT JOIN public.class_waitlist w ON w.class_session_id = s.id
       WHERE s.starts_at >= now() - interval '30 days' AND s.starts_at < now()
         AND s.status <> 'cancelled'
       GROUP BY s.id ORDER BY s.starts_at DESC LIMIT 50`,
    ),
    db().query(
      `SELECT COALESCE(plan_name, 'Sem plano') AS plan_name, count(*)::int AS clients
       FROM public.studio_clients WHERE status = 'active'
       GROUP BY plan_name ORDER BY clients DESC, plan_name`,
    ),
  ])
  const attendanceRate = attendance.rows[0].completed
    ? Number((100 * attendance.rows[0].attended / attendance.rows[0].completed).toFixed(1))
    : 0
  return res.status(200).json({
    summary: summary.rows[0],
    attendance: { ...attendance.rows[0], rate_percent: attendanceRate },
    occupancy: occupancy.rows,
    plans: plans.rows,
  })
}
