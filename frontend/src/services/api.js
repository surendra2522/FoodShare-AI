import axios from 'axios'

const API_URL = 'https://foodshare-backend-wth8.onrender.com/api'

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use((config) => {
  const persisted = window.localStorage.getItem('redistribution_auth')

  if (persisted) {
    const { token } = JSON.parse(persisted)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export const authService = {
  login: (payload) => http.post('/auth/login', payload),
  register: (payload) => http.post('/auth/register', payload),
  getNgos: () => http.get('/auth/ngos'),
}

export const donationService = {
  submitDonation: (payload) => http.post('/donations', payload),
  getMyDonations: () => http.get('/donations/my'),
  getMyMissions: () => http.get('/donations/my-missions'),
  getAvailable: () => http.get('/donations/available'),
  accept: (id) => http.patch(`/donations/${id}/accept`),
  updateStatus: (id, status) =>
    http.patch(`/donations/${id}/status`, { status }),
}

export const analyticsService = {
  getSummary: () => http.get('/analytics/summary'),
}

export const aiService = {
  getPrediction: (params) => http.get('/ai/surplus', { params }),
}