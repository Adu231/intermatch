import { RecruiterProfile } from '../models/RecruiterProfile.js'

// @desc    Get current recruiter profile
// @route   GET /api/recruiter/profile
// @access  Private (Recruiter)
export const getRecruiterProfile = async (req, res) => {
  try {
    let profile = await RecruiterProfile.findOne({ userId: req.user._id })
    if (!profile) {
      profile = await RecruiterProfile.create({
        userId: req.user._id,
        companyName: 'TechNova Labs'
      })
    }
    res.json({ success: true, data: profile })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update recruiter profile
// @route   PUT /api/recruiter/profile
// @access  Private (Recruiter)
export const updateRecruiterProfile = async (req, res) => {
  try {
    const { companyName, companyDescription, website, location, recruiterName, contactInformation } = req.body

    let profile = await RecruiterProfile.findOne({ userId: req.user._id })
    if (!profile) {
      profile = new RecruiterProfile({ userId: req.user._id })
    }

    if (companyName) profile.companyName = companyName
    if (companyDescription !== undefined) profile.companyDescription = companyDescription
    if (website !== undefined) profile.website = website
    if (location !== undefined) profile.location = location
    if (recruiterName !== undefined) profile.recruiterName = recruiterName
    if (contactInformation !== undefined) profile.contactInformation = contactInformation

    await profile.save()
    res.json({ success: true, message: 'Recruiter profile updated successfully', data: profile })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
