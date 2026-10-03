import { api } from './api'
import { Internship, internships as seedInternships } from '../data/mockData'

export const internshipService = {
  list: async (query = '', mode = '') => {
    try {
      const response = await api.get('/internships', { params: { query, mode } })
      if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn('API internship fetch failed, falling back to seed internships:', error.message)
    }
    return seedInternships
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/internships/${id}`)
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn(`API fetch internship by id ${id} failed, falling back:`, error.message)
    }
    return seedInternships.find((item) => item.id === id) ?? seedInternships[0]
  },

  getMyInternships: async () => {
    try {
      const response = await api.get('/internships/my')
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn('API getMyInternships failed:', error.message)
    }
    return seedInternships
  },

  create: async (payload: Partial<Internship>) => {
    try {
      const response = await api.post('/internships', payload)
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn('API create internship failed, returning client payload:', error.message)
    }
    return {
      ...seedInternships[0],
      id: `new-${Date.now()}`,
      title: payload.title || 'Frontend Development Intern',
      company: payload.company || 'TechNova Labs',
      location: payload.location || 'Bengaluru, India',
      mode: payload.mode || 'Remote',
      stipend: payload.stipend || '₹10,000 / month',
      posted: 'just now',
      match: 88
    }
  },

  update: async (id: string, payload: Partial<Internship>) => {
    try {
      const response = await api.put(`/internships/${id}`, payload)
      return response.data
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  updateStatus: async (id: string, status: 'Published' | 'Draft' | 'Closed') => {
    try {
      const response = await api.patch(`/internships/${id}/status`, { status })
      return response.data
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
