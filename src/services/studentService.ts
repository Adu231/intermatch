import { api } from './api'

export const studentService = {
  getProfile: async () => {
    try {
      const response = await api.get('/students/profile')
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn('API getStudentProfile failed:', error.message)
    }
    return {
      education: 'B.Tech Computer Science · 3rd year',
      skills: ['React', 'JavaScript', 'Git', 'CSS'],
      profileCompletion: 78,
      resumeUrl: 'maya-singh-resume.pdf'
    }
  },

  updateProfile: async (payload: any) => {
    try {
      const response = await api.put('/students/profile', payload)
      return response.data
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  uploadResume: async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const response = await api.post('/students/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn('API uploadResume failed, returning file name:', error.message)
    }
    return { resumeUrl: file.name }
  },

  getRecommended: async () => {
    try {
      const response = await api.get('/students/recommended')
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn('API getRecommended failed:', error.message)
    }
    return []
  },

  getSaved: async () => {
    try {
      const response = await api.get('/students/saved')
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data
      }
    } catch (error: any) {
      console.warn('API getSaved failed:', error.message)
    }
    return []
  },

  saveInternship: async (internshipId: string) => {
    try {
      const response = await api.post(`/students/saved/${internshipId}`)
      return response.data
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  removeSavedInternship: async (internshipId: string) => {
    try {
      const response = await api.delete(`/students/saved/${internshipId}`)
      return response.data
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
