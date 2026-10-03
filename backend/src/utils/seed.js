import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from '../models/User.js'
import { StudentProfile } from '../models/StudentProfile.js'
import { RecruiterProfile } from '../models/RecruiterProfile.js'
import { Internship } from '../models/Internship.js'
import { Application } from '../models/Application.js'
import { Interview } from '../models/Interview.js'

dotenv.config()

export const seedDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internmatch')
    console.log(`Connected to MongoDB for Seeding: ${conn.connection.host}`)

    await User.deleteMany({})
    await StudentProfile.deleteMany({})
    await RecruiterProfile.deleteMany({})
    await Internship.deleteMany({})
    await Application.deleteMany({})
    await Interview.deleteMany({})

    // Create Demo Users
    const studentUser = await User.create({
      name: 'Maya Singh',
      email: 'student@demo.com',
      passwordHash: 'demo1234',
      role: 'student'
    })

    const recruiterUser = await User.create({
      name: 'TechNova Labs',
      email: 'recruiter@demo.com',
      passwordHash: 'demo1234',
      role: 'recruiter'
    })

    // Create Profiles
    await StudentProfile.create({
      userId: studentUser._id,
      phone: '+91 98765 43210',
      education: 'B.Tech Computer Science · RV College of Engineering',
      skills: ['React', 'JavaScript', 'Git', 'CSS', 'Figma'],
      interests: ['Product building', 'Design systems', 'Frontend'],
      projects: [
        { name: 'StudyCircle', description: 'Collaborative study planning app', tech: ['React', 'Firebase'] },
        { name: 'Campus Cart', description: 'Student marketplace prototype', tech: ['Next.js', 'Stripe'] }
      ],
      experience: 'Design systems contributor at student tech club',
      achievements: 'Winner — Hack Bengaluru 2026',
      resumeUrl: 'maya-singh-resume.pdf',
      profileCompletion: 78
    })

    await RecruiterProfile.create({
      userId: recruiterUser._id,
      companyName: 'TechNova Labs',
      companyDescription: 'Building practical tools for early career software engineers.',
      website: 'https://technova.co',
      location: 'Bengaluru, India',
      recruiterName: 'TechNova Hiring Team',
      contactInformation: 'hr@technova.co'
    })

    // Seed Internships
    const internship1 = await Internship.create({
      recruiterId: recruiterUser._id,
      company: 'TechNova Labs',
      companyShort: 'TN',
      companyColor: '#ee6b52',
      title: 'Frontend Development Intern',
      description: 'Ship thoughtful product experiences with a small, ambitious team building tools used by 100k+ learners.',
      responsibilities: [
        'Build accessible product surfaces in React',
        'Pair with designers to turn prototypes into polished flows',
        'Write maintainable components and document decisions',
        'Participate in weekly product demos'
      ],
      requiredSkills: ['React', 'JavaScript', 'Git'],
      preferredSkills: ['TypeScript', 'Storybook', 'Testing Library'],
      education: 'Pursuing a degree in Computer Science, Design or a related field',
      experience: 'Students / Freshers',
      location: 'Bengaluru, India',
      workMode: 'Remote',
      stipend: '₹10,000 / month',
      duration: '3 months',
      openings: 3,
      deadline: 'Oct 18, 2026',
      whatYouWillLearn: ['Modern product engineering', 'Design systems at scale', 'How a remote team ships'],
      status: 'Published'
    })

    const internship2 = await Internship.create({
      recruiterId: recruiterUser._id,
      company: 'Brightside',
      companyShort: 'B',
      companyColor: '#5a55a8',
      title: 'Product Design Intern',
      description: 'Help make career decisions feel clearer, more human and a little less overwhelming for students everywhere.',
      responsibilities: [
        'Create flows from early concept to prototype',
        'Run lightweight user interviews',
        'Collaborate with PM and engineering'
      ],
      requiredSkills: ['Figma', 'User research', 'Prototyping'],
      preferredSkills: ['Illustration', 'Framer', 'Notion'],
      education: 'Any undergraduate background with a strong portfolio',
      experience: 'Students',
      location: 'Mumbai, India',
      workMode: 'Hybrid',
      stipend: '₹8,000 / month',
      duration: '4 months',
      openings: 1,
      deadline: 'Oct 24, 2026',
      whatYouWillLearn: ['Research-led product design', 'Rapid prototyping', 'Product discovery'],
      status: 'Published'
    })

    // Seed Applications
    const app1 = await Application.create({
      internshipId: internship1._id,
      studentId: studentUser._id,
      resumeUrl: 'maya-singh-resume.pdf',
      coverMessage: 'Super excited about frontend design systems!',
      status: 'Shortlisted'
    })

    // Seed Interviews
    await Interview.create({
      applicationId: app1._id,
      studentId: studentUser._id,
      recruiterId: recruiterUser._id,
      internshipId: internship1._id,
      date: 'Oct 06, 2026',
      time: '4:00 PM IST',
      mode: 'Video call',
      meetingLink: 'meet.technova.co/maya',
      location: 'Online',
      message: 'Hiring team conversation regarding frontend role.',
      status: 'Upcoming'
    })

    console.log('Database successfully seeded with demo accounts and internships!')
  } catch (error) {
    console.error(`Database Seeding Failed: ${error.message}`)
  }
}

// If executed directly from CLI: node src/utils/seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0))
}
