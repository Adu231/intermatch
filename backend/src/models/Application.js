import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    resumeUrl: { type: String, default: '' },
    coverMessage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Applied', 'Under review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied'
    },
    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
)

export const Application = mongoose.model('Application', applicationSchema)
