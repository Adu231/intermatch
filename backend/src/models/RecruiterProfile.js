import mongoose from 'mongoose'

const recruiterProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    companyName: { type: String, required: true },
    companyDescription: { type: String, default: '' },
    website: { type: String, default: '' },
    location: { type: String, default: 'Bengaluru, India' },
    recruiterName: { type: String, default: '' },
    contactInformation: { type: String, default: '' }
  },
  {
    timestamps: true
  }
)

export const RecruiterProfile = mongoose.model('RecruiterProfile', recruiterProfileSchema)
