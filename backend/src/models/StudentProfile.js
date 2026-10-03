import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  tech: [{ type: String }]
})

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    phone: { type: String, default: '' },
    education: { type: String, default: 'B.Tech Computer Science · 3rd year' },
    skills: [{ type: String }],
    interests: [{ type: String }],
    projects: [projectSchema],
    experience: { type: String, default: '' },
    achievements: { type: String, default: '' },
    resumeUrl: { type: String, default: 'maya-singh-resume.pdf' },
    profileCompletion: { type: Number, default: 78 },
    savedInternships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Internship' }]
  },
  {
    timestamps: true
  }
)

export const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema)
