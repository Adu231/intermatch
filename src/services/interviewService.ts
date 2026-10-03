import { api } from './api'
import { Interview, interviews as seedInterviews } from '../data/mockData'

export const interviewService = {
  create: async (payload: Partial<Interview> & { studentId?: string }) => {
    try {
      const response = await api.post('/interviews', payload)
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn('API create interview failed, returning fallback payload:', error.message)
    }
    return {
      id: `int-${Date.now()}`,
      internshipId: payload.internshipId || 'technova-frontend',
      company: payload.company || 'TechNova Labs',
      role: payload.role || 'Frontend Development Intern',
      date: payload.date || 'Oct 09, 2026',
      time: payload.time || '3:30 PM IST',
      mode: payload.mode || 'Video call',
      meeting: payload.meeting || 'meet.technova.co/maya',
      status: 'Upcoming' as const
    }
  },

  getRecruiterInterviews: async () => {
    try {
      const response = await api.get('/interviews/recruiter')
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn('API getRecruiterInterviews failed:', error.message)
    }
    return seedInterviews
  },

  getStudentInterviews: async () => {
    try {
      const response = await api.get('/interviews/student')
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn('API getStudentInterviews failed:', error.message)
    }
    return seedInterviews
  }
}
