import api from './axios'

export function getUsers() {
  return api.get('/api/users')
}
