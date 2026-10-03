import { Interview } from '../models/Interview.js'
import { Internship } from '../models/Internship.js'

// @desc    Schedule / Create an interview (Recruiter)
// @route   POST /api/interviews
// @access  Private (Recruiter)
export const createInterview = async (req, res) => {
  try {
    const { studentId, internshipId, date, time, mode, meetingLink, location, message } = req.body

    if (!studentId || !internshipId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Please provide student, internship, date, and time' })
    }

    const internship = await Internship.findById(internshipId)
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' })
    }

    const interview = await Interview.create({
      recruiterId: req.user._id,
      studentId,
      internshipId,
      date,
      time,
      mode: mode || 'Video call',
      meetingLink: meetingLink || 'meet.technova.co/interview',
      location: location || 'Online',
      message: message || 'Looking forward to speaking with you.',
      status: 'Upcoming'
    })

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: interview
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get interviews scheduled by current recruiter
// @route   GET /api/interviews/recruiter
// @access  Private (Recruiter)
export const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiterId: req.user._id })
      .populate('studentId', 'name email')
      .populate('internshipId')
    res.json({ success: true, data: interviews })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get interviews scheduled for current student
// @route   GET /api/interviews/student
// @access  Private (Student)
export const getStudentInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ studentId: req.user._id })
      .populate('recruiterId', 'name email')
      .populate('internshipId')
    res.json({ success: true, data: interviews })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update interview details / status
// @route   PUT /api/interviews/:id
// @access  Private (Recruiter)
export const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' })
    }

    if (interview.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this interview' })
    }

    const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, message: 'Interview updated successfully', data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
