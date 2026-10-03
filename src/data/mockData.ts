export type Role = 'student' | 'recruiter'
export type ApplicationStatus = 'New' | 'Applied' | 'Under review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected'

export type Internship = {
  id: string
  title: string
  company: string
  companyShort: string
  companyColor: string
  location: string
  mode: 'Remote' | 'Hybrid' | 'On-site'
  type: 'Full-time' | 'Part-time'
  stipend: string
  duration: string
  skills: string[]
  posted: string
  deadline: string
  openings: number
  match: number
  description: string
  responsibilities: string[]
  preferred: string[]
  learn: string[]
  education: string
}

export type Application = {
  id: string
  internshipId: string
  applied: string
  updated: string
  status: ApplicationStatus
  note: string
}

export type Applicant = {
  id: string
  name: string
  initials: string
  education: string
  location: string
  skills: string[]
  match: number
  applied: string
  updated?: string
  status: ApplicationStatus
  bio: string
  projects: { name: string; description: string; tech: string[] }[]
  experience: string
  achievement: string
}

export type Interview = {
  id: string
  internshipId: string
  company: string
  role: string
  date: string
  time: string
  mode: string
  meeting: string
  status: 'Upcoming' | 'Completed'
}

export const internships: Internship[] = [
  {
    id: 'technova-frontend',
    title: 'Frontend Development Intern',
    company: 'TechNova Labs',
    companyShort: 'TN',
    companyColor: '#ee6b52',
    location: 'Bengaluru, India',
    mode: 'Remote',
    type: 'Full-time',
    stipend: '₹10,000 / month',
    duration: '3 months',
    skills: ['React', 'JavaScript', 'Git'],
    posted: '2 days ago',
    deadline: 'Oct 18, 2026',
    openings: 3,
    match: 92,
    description: 'Ship thoughtful product experiences with a small, ambitious frontend team building tools used by 100k+ learners.',
    responsibilities: ['Build accessible product surfaces in React', 'Pair with designers to turn prototypes into polished flows', 'Write maintainable components and document decisions', 'Participate in weekly product demos'],
    preferred: ['TypeScript', 'Storybook', 'Testing Library'],
    learn: ['Modern product engineering', 'Design systems at scale', 'How a remote team ships'],
    education: 'Pursuing a degree in Computer Science, Design or a related field'
  },
  {
    id: 'brightside-product',
    title: 'Product Design Intern',
    company: 'Brightside',
    companyShort: 'B',
    companyColor: '#5a55a8',
    location: 'Mumbai, India',
    mode: 'Hybrid',
    type: 'Part-time',
    stipend: '₹8,000 / month',
    duration: '4 months',
    skills: ['Figma', 'User research', 'Prototyping'],
    posted: '5 days ago',
    deadline: 'Oct 24, 2026',
    openings: 1,
    match: 87,
    description: 'Help make career decisions feel clearer, more human and a little less overwhelming for students everywhere.',
    responsibilities: ['Create flows from early concept to prototype', 'Run lightweight user interviews', 'Collaborate with PM and engineering', 'Contribute to our product language'],
    preferred: ['Illustration', 'Framer', 'Notion'],
    learn: ['Research-led product design', 'Rapid prototyping', 'A real product discovery cycle'],
    education: 'Any undergraduate background with a strong portfolio'
  },
  {
    id: 'orbit-data',
    title: 'Data Analytics Intern',
    company: 'Orbit Systems',
    companyShort: 'OS',
    companyColor: '#277e7a',
    location: 'Pune, India',
    mode: 'On-site',
    type: 'Full-time',
    stipend: '₹12,000 / month',
    duration: '6 months',
    skills: ['Python', 'SQL', 'Tableau'],
    posted: '1 week ago',
    deadline: 'Nov 02, 2026',
    openings: 2,
    match: 74,
    description: 'Turn product and operations data into decisions the whole company can act on.',
    responsibilities: ['Build repeatable analysis in Python and SQL', 'Partner with operations on reporting', 'Present insights to non-technical teams', 'Improve metric definitions and dashboards'],
    preferred: ['dbt', 'Statistics', 'Looker'],
    learn: ['Analytics engineering', 'Business storytelling', 'Experiment measurement'],
    education: 'Currently studying analytics, economics, computer science or a related field'
  },
  {
    id: 'pixelcommerce-growth',
    title: 'Growth Marketing Intern',
    company: 'Pixel Commerce',
    companyShort: 'PC',
    companyColor: '#cc7b2d',
    location: 'Delhi, India',
    mode: 'Remote',
    type: 'Part-time',
    stipend: '₹7,500 / month',
    duration: '3 months',
    skills: ['Content', 'SEO', 'Analytics'],
    posted: '3 days ago',
    deadline: 'Oct 20, 2026',
    openings: 2,
    match: 81,
    description: 'Help a fast-moving commerce team find the stories, channels and experiments that compound.',
    responsibilities: ['Plan and publish content experiments', 'Track acquisition and activation metrics', 'Support creator partnerships', 'Turn customer language into sharper messaging'],
    preferred: ['Canva', 'GA4', 'Copywriting'],
    learn: ['Growth loops', 'Content systems', 'Experiment design'],
    education: 'Any degree with a curious, analytical approach'
  }
]

export const applications: Application[] = [
  { id: 'app-1', internshipId: 'technova-frontend', applied: 'Sep 24, 2026', updated: 'Sep 27, 2026', status: 'Under review', note: 'Your application is being reviewed by the hiring team.' },
  { id: 'app-2', internshipId: 'brightside-product', applied: 'Sep 18, 2026', updated: 'Sep 23, 2026', status: 'Shortlisted', note: 'Great news — you are on the shortlist.' },
  { id: 'app-3', internshipId: 'orbit-data', applied: 'Sep 10, 2026', updated: 'Sep 11, 2026', status: 'Applied', note: 'Your application was sent successfully.' }
]

export const applicants: Applicant[] = [
  { id: 'maya-singh', name: 'Maya Singh', initials: 'MS', education: 'B.Tech Computer Science · 3rd year', location: 'Bengaluru, India', skills: ['React', 'JavaScript', 'Git', 'CSS'], match: 94, applied: 'Sep 28, 2026', status: 'Shortlisted', bio: 'Frontend builder who cares about the last 10% of polish. Maya enjoys turning complex product ideas into calm, accessible interfaces.', projects: [{ name: 'StudyCircle', description: 'A collaborative study planner used by 240 students.', tech: ['React', 'Firebase', 'Figma'] }, { name: 'Campus Cart', description: 'A lightweight marketplace prototype for campus communities.', tech: ['Next.js', 'Tailwind', 'Stripe'] }], experience: 'Design systems contributor at a student-led edtech club', achievement: 'Winner — Hack Bengaluru 2026' },
  { id: 'arjun-mehta', name: 'Arjun Mehta', initials: 'AM', education: 'BCA · 2nd year', location: 'Pune, India', skills: ['React', 'TypeScript', 'Node.js'], match: 89, applied: 'Sep 27, 2026', status: 'New', bio: 'Full-stack curious, product-minded and always looking for a cleaner way to ship.', projects: [{ name: 'Habit Loop', description: 'A habit tracker with gentle accountability loops.', tech: ['React', 'TypeScript', 'Supabase'] }], experience: 'Open-source contributor and freelance developer', achievement: 'Top 10 — Build for Bharat' },
  { id: 'sana-khan', name: 'Sana Khan', initials: 'SK', education: 'B.Des Interaction Design · 4th year', location: 'Mumbai, India', skills: ['Figma', 'Research', 'Prototyping'], match: 78, applied: 'Sep 25, 2026', updated: 'Sep 25, 2026', status: 'Interview', bio: 'Interaction designer focused on making digital products feel legible and kind.', projects: [{ name: 'ClearTrip Reframe', description: 'A travel planning experience redesigned around confidence.', tech: ['Figma', 'Maze', 'Notion'] }], experience: 'Design intern at a consumer fintech startup', achievement: 'Best Portfolio — Design School Showcase' }
]

export const interviews: Interview[] = [
  { id: 'int-1', internshipId: 'brightside-product', company: 'Brightside', role: 'Product Design Intern', date: 'Oct 06, 2026', time: '4:00 PM IST', mode: 'Video call', meeting: 'meet.brightside.co/maya', status: 'Upcoming' },
  { id: 'int-2', internshipId: 'technova-frontend', company: 'TechNova Labs', role: 'Frontend Development Intern', date: 'Sep 22, 2026', time: '11:00 AM IST', mode: 'Video call', meeting: 'Completed interview', status: 'Completed' }
]
