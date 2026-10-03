import express from 'express'
import {
  getAllInternships,
  getInternshipById,
  getMyInternships,
  createInternship,
  updateInternship,
  deleteInternship,
  updateInternshipStatus
} from '../controllers/internshipController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'

const router = express.Router()

// Public / Student endpoints
router.get('/', getAllInternships)

// Recruiter specific endpoints
router.get('/my', protect, authorize('recruiter'), getMyInternships)

router.get('/:id', getInternshipById)

router.post('/', protect, authorize('recruiter'), createInternship)
router.put('/:id', protect, authorize('recruiter'), updateInternship)
router.delete('/:id', protect, authorize('recruiter'), deleteInternship)
router.patch('/:id/status', protect, authorize('recruiter'), updateInternshipStatus)

export default router
