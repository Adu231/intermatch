import { Application } from '../models/Application.js'
import { Internship } from '../models/Internship.js'
import { StudentProfile } from '../models/StudentProfile.js'

// @desc    Apply to an internship (Student)
// @route   POST /api/applications/:internshipId
// @access  Private (Student)
export const applyToInternship = async (req, res) => {
  try {
    const { internshipId } = req.params
    const { coverMessage } = req.body

    const internship = await Internship.findById(internshipId)
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship opportunity not found' })
    }

    // Check for duplicate application
    const existing = await Application.findOne({
      internshipId,
      studentId: req.user._id
    })

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this internship opportunity' })
    }

    const studentProfile = await StudentProfile.findOne({ userId: req.user._id })

    const application = await Application.create({
      internshipId,
      studentId: req.user._id,
      resumeUrl: studentProfile?.resumeUrl || 'maya-singh-resume.pdf',
      coverMessage: coverMessage || '',
      status: 'Applied'
    })

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get all applications submitted by logged in student
// @route   GET /api/applications/my
// @access  Private (Student)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id }).populate('internshipId')
    res.json({ success: true, data: applications })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get applications for a specific internship (Recruiter)
// @route   GET /api/applications/internship/:internshipId
// @access  Private (Recruiter)
export const getApplicationsByInternship = async (req, res) => {
  try {
    const { internshipId } = req.params
    const applications = await Application.find({ internshipId })
      .populate('studentId', 'name email')
      .populate('internshipId')

    const formatted = await Promise.all(
      applications.map(async (app) => {
        const studentProf = await StudentProfile.findOne({ userId: app.studentId._id })
        return {
          id: app._id.toString(),
          applicantId: app.studentId._id.toString(),
          name: app.studentId.name,
          initials: app.studentId.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2),
          education: studentProf?.education || 'B.Tech Computer Science',
          location: 'Bengaluru, India',
          skills: studentProf?.skills || ['React', 'JavaScript', 'Git'],
          match: 94,
          applied: 'Sep 28, 2026',
          status: app.status,
          bio: 'Frontend builder focused on polished user experiences.',
          projects: studentProf?.projects || [],
          experience: studentProf?.experience || 'Student developer',
          achievement: studentProf?.achievements || 'Hackathon Winner'
        }
      })
    )

    res.json({ success: true, data: formatted })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private (Student / Recruiter)
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('internshipId')

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' })
    }

    res.json({ success: true, data: application })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update application status (Recruiter)
// @route   PATCH /api/applications/:id/status
// @access  Private (Recruiter)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body
    const allowedStatuses = ['Applied', 'Under review', 'Shortlisted', 'Interview', 'Selected', 'Rejected']

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status value' })
    }

    const application = await Application.findById(req.params.id)
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' })
    }

    application.status = status
    application.updatedAt = Date.now()
    await application.save()

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
