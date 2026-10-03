/**
 * Isolated Matching System Utility
 * Compares Student Profile data against Internship requirements to return fit analytics.
 */
export const calculateMatchScore = (studentProfile = {}, internship = {}) => {
  const studentSkills = (studentProfile.skills || []).map((s) => s.toLowerCase().trim())
  const requiredSkills = (internship.requiredSkills || internship.skills || []).map((s) => s.toLowerCase().trim())
  const preferredSkills = (internship.preferredSkills || internship.preferred || []).map((s) => s.toLowerCase().trim())

  if (requiredSkills.length === 0 && preferredSkills.length === 0) {
    return {
      matchPercentage: 85,
      matchedSkills: studentProfile.skills || [],
      missingSkills: [],
      profileAlignment: 'High'
    }
  }

  const allTargetSkills = Array.from(new Set([...requiredSkills, ...preferredSkills]))
  const matchedSkills = []
  const missingSkills = []

  allTargetSkills.forEach((skill) => {
    if (studentSkills.includes(skill)) {
      matchedSkills.push(skill)
    } else {
      missingSkills.push(skill)
    }
  })

  let rawScore = (matchedSkills.length / Math.max(allTargetSkills.length, 1)) * 100

  // Bonus points if student has relevant education or experience keywords
  const studentEdu = (studentProfile.education || '').toLowerCase()
  const reqEdu = (internship.education || '').toLowerCase()
  if (reqEdu && studentEdu.includes(reqEdu.split(' ')[0])) {
    rawScore += 10
  }

  const matchPercentage = Math.min(Math.max(Math.round(rawScore), 50), 98)

  let profileAlignment = 'Medium'
  if (matchPercentage >= 85) {
    profileAlignment = 'High'
  } else if (matchPercentage < 70) {
    profileAlignment = 'Low'
  }

  return {
    matchPercentage,
    matchedSkills: matchedSkills.map((s) => s.toUpperCase()),
    missingSkills: missingSkills.map((s) => s.toUpperCase()),
    profileAlignment
  }
}
