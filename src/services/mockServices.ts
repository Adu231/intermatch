import { applicants, applications, interviews, internships } from '../data/mockData'

export const authService = {
  login: async (email: string) => ({ email, role: email.includes('recruiter') ? 'recruiter' as const : 'student' as const }),
  logout: async () => true,
}

export const internshipService = {
  list: async () => internships,
  getById: async (id: string) => internships.find((item) => item.id === id) ?? internships[0],
  create: async (payload: typeof internships[number]) => payload,
}

export const applicationService = {
  list: async () => applications,
  apply: async (internshipId: string) => ({ internshipId, status: 'Applied' as const }),
}

export const studentService = {
  getProfile: async () => ({ name: 'Maya', email: 'maya@demo.com', completion: 78, skills: ['React', 'JavaScript', 'Git', 'Figma'] }),
}

export const recruiterService = {
  listApplicants: async () => applicants,
}

export const interviewService = {
  list: async () => interviews,
  invite: async (payload: { applicantId: string; date: string; time: string }) => payload,
}
