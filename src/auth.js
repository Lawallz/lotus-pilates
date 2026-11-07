import { createInternalNeonAuth } from '@neondatabase/auth'

export const auth = createInternalNeonAuth(import.meta.env.VITE_NEON_AUTH_URL)

export async function getAdminToken() {
  const token = await auth.getJWTToken()
  if (!token) throw new Error('Sessão não encontrada. Entre novamente.')
  return token
}

export async function adminRequest(path, options = {}) {
  const token = await getAdminToken()
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a solicitação.')
  return data
}
