import { db, methodNotAllowed, requireAdmin } from '../_lib/admin.js'

export default async function handler(req, res) {
  const user = await requireAdmin(req, res)
  if (!user) return
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])

  const { rows } = await db().query(
    `SELECT id, actor_email, action, entity_type, entity_id, details, created_at
     FROM public.studio_audit_log
     ORDER BY created_at DESC, id DESC
     LIMIT 200`,
  )
  return res.status(200).json({ events: rows })
}
