import { api } from './api'
import { Role } from '../data/mockData'

export const authService = {
  login: async (email: string, password = 'demo1234', role?: Role) => {
    try {
      const response = await api.post('/auth/login', { email, password, role })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed'
      return {
        success: false,
        message
      }
    }
  },

  register: async (name: string, email: string, password = 'demo1234', role: Role, details?: any) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role, details })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed'
      return {
        success: false,
        message
      }
    }
  },

  getMe: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      // Ignore logout errors
    }
    return { success: true }
  }
}
