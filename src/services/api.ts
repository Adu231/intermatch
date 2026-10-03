import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    try {
      const auth = localStorage.getItem('internMatch_auth')
      if (auth) {
        const parsed = JSON.parse(auth)
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`
        }
      }
    } catch (e) {
      console.error('Error reading token from localStorage:', e)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: 401 & 403 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - session expired or invalid token.')
    } else if (error.response?.status === 403) {
      console.warn('Forbidden request - insufficient role permissions.')
    }
    return Promise.reject(error)
  }
)
