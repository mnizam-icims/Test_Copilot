import api from './axios'

export async function exportCSV() {
  const response = await api.get('/api/export/csv', { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'tickets.csv')
  document.body.appendChild(link)
  link.click()
  link.parentNode.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export async function exportPDF() {
  const response = await api.get('/api/export/pdf', { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'tickets.pdf')
  document.body.appendChild(link)
  link.click()
  link.parentNode.removeChild(link)
  window.URL.revokeObjectURL(url)
}
