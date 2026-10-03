import { User } from '../models/User.js'
import { StudentProfile } from '../models/StudentProfile.js'
import { RecruiterProfile } from '../models/RecruiterProfile.js'
import { generateToken } from '../utils/generateToken.js'
import { validateEmail, validatePassword } from '../utils/validation.js'

// @desc    Register a new student or recruiter
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'student', details } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address format' })
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' })
    }

    const userExists = await User.findOne({ email: email.toLowerCase() })
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' })
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      role
    })

    if (role === 'student') {
      await StudentProfile.create({
        userId: user._id,
        education: details?.college || 'RV College of Engineering',
        skills: ['React', 'JavaScript', 'Git', 'CSS'],
        interests: ['Product building', 'Design systems'],
        projects: [
          { name: 'StudyCircle', description: 'Collaborative study planner', tech: ['React', 'Firebase'] },
          { name: 'Campus Cart', description: 'Student marketplace prototype', tech: ['Next.js', 'Stripe'] }
        ]
      })
    } else {
      await RecruiterProfile.create({
        userId: user._id,
        companyName: details?.company || 'TechNova Labs',
        location: details?.location || 'Bengaluru, India'
      })
    }

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          college: role === 'student' ? (details?.college || 'RV College of Engineering') : undefined,
          company: role === 'recruiter' ? (details?.company || 'TechNova Labs') : undefined
        }
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id)

      let profileData = {}
      if (user.role === 'student') {
        const student = await StudentProfile.findOne({ userId: user._id })
        profileData.college = student?.education || 'RV College of Engineering'
      } else {
        const recruiter = await RecruiterProfile.findOne({ userId: user._id })
        profileData.company = recruiter?.companyName || 'TechNova Labs'
      }

      return res.json({
        success: true,
        message: 'Logged in successfully',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            ...profileData
          }
        }
      })
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash')

    let profile = null
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id })
    } else {
      profile = await RecruiterProfile.findOne({ userId: user._id })
    }

    res.json({
      success: true,
      data: {
        user,
        profile
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Log user out
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
}
