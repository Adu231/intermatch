import express from 'express'
import {
  applyToInternship,
  getMyApplications,
  getApplicationsByInternship,
  getApplicationById,
  updateApplicationStatus
} from '../controllers/applicationController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.use(protect)

// Student endpoints
router.post('/:internshipId', authorize('student'), applyToInternship)
router.get('/my', authorize('student'), getMyApplications)

// Recruiter endpoints
router.get('/internship/:internshipId', authorize('recruiter'), getApplicationsByInternship)
router.patch('/:id/status', authorize('recruiter'), updateApplicationStatus)

// Shared / Detail endpoint
router.get('/:id', getApplicationById)

export default router
