import mongoose from 'mongoose'

const internshipSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    company: { type: String, required: true, default: 'TechNova Labs' },
    companyShort: { type: String, default: 'TN' },
    companyColor: { type: String, default: '#ee6b52' },
    title: { type: String, required: [true, 'Title is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    responsibilities: [{ type: String }],
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    education: { type: String, default: 'Any undergraduate background' },
    experience: { type: String, default: 'Freshers / Students' },
    location: { type: String, default: 'Bengaluru, India' },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Remote'
    },
    stipend: { type: String, default: '₹10,000 / month' },
    duration: { type: String, default: '3 months' },
    openings: { type: Number, default: 1 },
    deadline: { type: String, default: 'Nov 15, 2026' },
    whatYouWillLearn: [{ type: String }],
    status: {
      type: String,
      enum: ['Published', 'Draft', 'Closed'],
      default: 'Published'
    }
  },
  {
    timestamps: true
  }
)

export const Internship = mongoose.model('Internship', internshipSchema)
