import api from './axios'

export function getSummary() {
  return api.get('/api/dashboard/summary')
}
