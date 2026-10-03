import mongoose from 'mongoose'

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, default: 'Video call' },
    meetingLink: { type: String, default: 'meet.technova.co/interview' },
    location: { type: String, default: 'Online' },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Cancelled'],
      default: 'Upcoming'
    }
  },
  {
    timestamps: true
  }
)

export const Interview = mongoose.model('Interview', interviewSchema)
