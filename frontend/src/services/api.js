import axios from 'axios'

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:8000' : ''

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const calculateTrip = async (tripData) => {
  try {
    const response = await api.post('/api/trips/calculate/', tripData)
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Server error')
    } else if (error.request) {
      throw new Error('No response from server')
    } else {
      throw new Error('Request failed')
    }
  }
}

export default api
