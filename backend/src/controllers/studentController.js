import { StudentProfile } from '../models/StudentProfile.js'
import { Internship } from '../models/Internship.js'
import { Application } from '../models/Application.js'
import { Interview } from '../models/Interview.js'
import { calculateMatchScore } from '../utils/matchScore.js'
import cloudinary from '../config/cloudinary.js'

// @desc    Get current student profile
// @route   GET /api/students/profile
// @access  Private (Student)
export const getStudentProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id }).populate('savedInternships')
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id })
    }
    res.json({ success: true, data: profile })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
export const updateStudentProfile = async (req, res) => {
  try {
    const { phone, education, skills, interests, projects, experience, achievements } = req.body

    let profile = await StudentProfile.findOne({ userId: req.user._id })
    if (!profile) {
      profile = new StudentProfile({ userId: req.user._id })
    }

    if (phone !== undefined) profile.phone = phone
    if (education !== undefined) profile.education = education
    if (skills !== undefined) profile.skills = skills
    if (interests !== undefined) profile.interests = interests
    if (projects !== undefined) profile.projects = projects
    if (experience !== undefined) profile.experience = experience
    if (achievements !== undefined) profile.achievements = achievements

    // Recalculate profile completion
    let score = 40
    if (profile.education) score += 15
    if (profile.skills && profile.skills.length > 0) score += 15
    if (profile.projects && profile.projects.length > 0) score += 15
    if (profile.resumeUrl) score += 15
    profile.profileCompletion = Math.min(score, 100)

    await profile.save()
    res.json({ success: true, message: 'Profile updated successfully', data: profile })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Upload resume to Cloudinary
// @route   POST /api/students/resume
// @access  Private (Student)
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach a resume file' })
    }

    let resumeUrl = ''

    // If Cloudinary keys are configured, stream file buffer to Cloudinary
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== '1234567890') {
      const b64 = Buffer.from(req.file.buffer).toString('base64')
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'raw',
        folder: 'internmatch_resumes'
      })
      resumeUrl = result.secure_url
    } else {
      // Demo fallback filename if Cloudinary environment variables are not set
      resumeUrl = `${req.user.name.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`
    }

    let profile = await StudentProfile.findOne({ userId: req.user._id })
    if (!profile) {
      profile = new StudentProfile({ userId: req.user._id })
    }
    profile.resumeUrl = resumeUrl
    await profile.save()

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: { resumeUrl }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get recommended internships matching student signal
// @route   GET /api/students/recommended
// @access  Private (Student)
export const getRecommendedInternships = async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ userId: req.user._id })
    const internships = await Internship.find({ status: 'Published' })

    const recommended = internships
      .map((item) => {
        const itemObj = item.toObject()
        const matchInfo = calculateMatchScore(student || {}, itemObj)
        return {
          ...itemObj,
          id: itemObj._id.toString(),
          match: matchInfo.matchPercentage,
          matchInfo
        }
      })
      .filter((item) => item.match >= 75)
      .sort((a, b) => b.match - a.match)

    res.json({ success: true, data: recommended })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get applications submitted by current student
// @route   GET /api/students/applications
// @access  Private (Student)
export const getStudentApplications = async (req, res) => {
  try {
    const apps = await Application.find({ studentId: req.user._id }).populate('internshipId')
    res.json({ success: true, data: apps })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get interviews scheduled for current student
// @route   GET /api/students/interviews
// @access  Private (Student)
export const getStudentInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ studentId: req.user._id })
      .populate('internshipId')
      .populate('recruiterId', 'name email')
    res.json({ success: true, data: interviews })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get saved internships for current student
// @route   GET /api/students/saved
// @access  Private (Student)
export const getSavedInternships = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id }).populate('savedInternships')
    res.json({ success: true, data: profile?.savedInternships || [] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Save an internship
// @route   POST /api/students/saved/:internshipId
// @access  Private (Student)
export const saveInternship = async (req, res) => {
  try {
    const { internshipId } = req.params
    let profile = await StudentProfile.findOne({ userId: req.user._id })
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user._id })
    }

    if (!profile.savedInternships.includes(internshipId)) {
      profile.savedInternships.push(internshipId)
      await profile.save()
    }

    res.json({ success: true, message: 'Internship saved to shortlist', data: profile.savedInternships })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Remove an internship from saved list
// @route   DELETE /api/students/saved/:internshipId
// @access  Private (Student)
export const removeSavedInternship = async (req, res) => {
  try {
    const { internshipId } = req.params
    const profile = await StudentProfile.findOne({ userId: req.user._id })
    if (profile) {
      profile.savedInternships = profile.savedInternships.filter((id) => id.toString() !== internshipId)
      await profile.save()
    }
    res.json({ success: true, message: 'Internship removed from shortlist', data: profile?.savedInternships || [] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
