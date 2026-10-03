import { api } from './api'
import { Applicant, applicants as seedApplicants } from '../data/mockData'

export const recruiterService = {
  getProfile: async () => {
    try {
      const response = await api.get('/recruiter/profile')
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn('API getRecruiterProfile failed:', error.message)
    }
    return { companyName: 'TechNova Labs', location: 'Bengaluru, India' }
  },

  updateProfile: async (payload: any) => {
    try {
      const response = await api.put('/recruiter/profile', payload)
      return response.data
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  listApplicants: async () => {
    try {
      // In a full implementation, this calls applications by internship
      return seedApplicants
    } catch (error: any) {
      return seedApplicants
    }
  }
}
