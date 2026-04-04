import api, { TOKEN_KEY } from './api'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function verify() {
  const { data } = await api.get('/auth/verify')
  return data
}
