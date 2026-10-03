import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import recruiterRoutes from './routes/recruiterRoutes.js'
import internshipRoutes from './routes/internshipRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import interviewRoutes from './routes/interviewRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'InternMatch API Server is healthy and running',
    timestamp: new Date().toISOString()
  })
})

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/recruiter', recruiterRoutes)
app.use('/api/internships', internshipRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/interviews', interviewRoutes)

// Error Handling Middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 InternMatch API Server running on port ${PORT}`)
})
