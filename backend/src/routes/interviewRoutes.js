import express from 'express'
import {
  createInterview,
  getRecruiterInterviews,
  getStudentInterviews,
  updateInterview
} from '../controllers/interviewController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/', authorize('recruiter'), createInterview)
router.get('/recruiter', authorize('recruiter'), getRecruiterInterviews)
router.get('/student', authorize('student'), getStudentInterviews)
router.put('/:id', authorize('recruiter'), updateInterview)

export default router
