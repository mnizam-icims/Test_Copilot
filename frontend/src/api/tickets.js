import api from './axios'

export function getTickets(params) {
  return api.get('/api/tickets', { params })
}

export function createTicket(data) {
  return api.post('/api/tickets', data)
}

export function getTicket(id) {
  return api.get(`/api/tickets/${id}`)
}

export function updateTicket(id, data) {
  return api.patch(`/api/tickets/${id}`, data)
}

export function deleteTicket(id) {
  return api.delete(`/api/tickets/${id}`)
}

export function getTicketActivity(id) {
  return api.get(`/api/tickets/${id}/activity`)
}
