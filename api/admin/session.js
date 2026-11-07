import { requireAdmin, methodNotAllowed } from '../_lib/admin.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  const user = await requireAdmin(req, res)
  if (!user) return
  return res.status(200).json({ authenticated: true, userId: user.userId })
}
