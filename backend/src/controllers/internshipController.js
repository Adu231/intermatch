import { Internship } from '../models/Internship.js'
import { RecruiterProfile } from '../models/RecruiterProfile.js'

// @desc    Get all internships (Public / Student view with filtering & match calculation)
// @route   GET /api/internships
// @access  Public
export const getAllInternships = async (req, res) => {
  try {
    const { query, mode, status = 'Published' } = req.query

    const filter = { status }
    if (mode && mode !== 'All work modes') {
      filter.workMode = mode
    }

    let internships = await Internship.find(filter).sort({ createdAt: -1 })

    if (query) {
      const q = query.toLowerCase()
      internships = internships.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.company.toLowerCase().includes(q) ||
          (item.requiredSkills || []).some((s) => s.toLowerCase().includes(q))
      )
    }

    const formatted = internships.map((item) => {
      const obj = item.toObject()
      return {
        ...obj,
        id: obj._id.toString(),
        skills: obj.requiredSkills || ['React', 'JavaScript', 'Git'],
        mode: obj.workMode || 'Remote',
        type: 'Full-time',
        posted: '2 days ago',
        match: 88
      }
    })

    res.json({ success: true, count: formatted.length, data: formatted })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get single internship by ID
// @route   GET /api/internships/:id
// @access  Public
export const getInternshipById = async (req, res) => {
  try {
    const { id } = req.params
    const internship = await Internship.findById(id)

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' })
    }

    const obj = internship.toObject()
    const formatted = {
      ...obj,
      id: obj._id.toString(),
      skills: obj.requiredSkills || ['React', 'JavaScript', 'Git'],
      preferred: obj.preferredSkills || ['TypeScript', 'Storybook'],
      learn: obj.whatYouWillLearn || ['Modern product engineering', 'Design systems at scale'],
      mode: obj.workMode || 'Remote',
      type: 'Full-time',
      posted: '2 days ago',
      match: 92
    }

    res.json({ success: true, data: formatted })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get internships created by logged-in recruiter
// @route   GET /api/internships/my
// @access  Private (Recruiter)
export const getMyInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ recruiterId: req.user._id }).sort({ createdAt: -1 })
    const formatted = internships.map((item) => {
      const obj = item.toObject()
      return {
        ...obj,
        id: obj._id.toString(),
        skills: obj.requiredSkills || ['React', 'JavaScript', 'Git'],
        mode: obj.workMode || 'Remote',
        type: 'Full-time',
        posted: '2 days ago',
        match: 90
      }
    })
    res.json({ success: true, data: formatted })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private (Recruiter)
export const createInternship = async (req, res) => {
  try {
    const {
      title,
      description,
      responsibilities,
      requiredSkills,
      preferredSkills,
      education,
      experience,
      location,
      workMode,
      stipend,
      duration,
      openings,
      deadline,
      whatYouWillLearn,
      status
    } = req.body

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Please provide title and description' })
    }

    const recruiterProfile = await RecruiterProfile.findOne({ userId: req.user._id })
    const company = recruiterProfile?.companyName || req.user.name || 'TechNova Labs'

    const internship = await Internship.create({
      recruiterId: req.user._id,
      company,
      companyShort: company.substring(0, 2).toUpperCase(),
      companyColor: '#ee6b52',
      title,
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n') : []),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map((s) => s.trim()) : ['React', 'JavaScript']),
      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : (preferredSkills ? preferredSkills.split(',').map((s) => s.trim()) : ['TypeScript']),
      education: education || 'Pursuing CS, Design or related field',
      experience: experience || 'Freshers / Students',
      location: location || 'Bengaluru, India',
      workMode: workMode || 'Remote',
      stipend: stipend || '₹10,000 / month',
      duration: duration || '3 months',
      openings: openings || 1,
      deadline: deadline || 'Nov 15, 2026',
      whatYouWillLearn: Array.isArray(whatYouWillLearn) ? whatYouWillLearn : ['Modern product engineering'],
      status: status || 'Published'
    })

    const obj = internship.toObject()
    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: {
        ...obj,
        id: obj._id.toString(),
        skills: obj.requiredSkills,
        mode: obj.workMode,
        posted: 'just now',
        match: 88
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private (Recruiter)
export const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' })
    }

    if (internship.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this internship' })
    }

    const updated = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, message: 'Internship updated successfully', data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Recruiter)
export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' })
    }

    if (internship.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this internship' })
    }

    await internship.deleteOne()
    res.json({ success: true, message: 'Internship deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update internship status (Published | Draft | Closed)
// @route   PATCH /api/internships/:id/status
// @access  Private (Recruiter)
export const updateInternshipStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!['Published', 'Draft', 'Closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' })
    }

    const internship = await Internship.findById(req.params.id)
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' })
    }

    if (internship.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this internship' })
    }

    internship.status = status
    await internship.save()
    res.json({ success: true, message: `Internship status updated to ${status}`, data: internship })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
