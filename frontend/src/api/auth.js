import api from './axios'

export function login(email, password) {
  return api.post('/api/auth/login', { email, password })
}

export function register(name, email, password, role) {
  return api.post('/api/auth/register', { name, email, password, role })
}
