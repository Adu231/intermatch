import express from 'express'
import {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  getRecommendedInternships,
  getStudentApplications,
  getStudentInterviews,
  getSavedInternships,
  saveInternship,
  removeSavedInternship
} from '../controllers/studentController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'
import { uploadResume as uploadMiddleware } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.use(protect)
router.use(authorize('student'))

router.get('/profile', getStudentProfile)
router.put('/profile', updateStudentProfile)
router.post('/resume', uploadMiddleware.single('resume'), uploadResume)
router.get('/recommended', getRecommendedInternships)
router.get('/applications', getStudentApplications)
router.get('/interviews', getStudentInterviews)
router.get('/saved', getSavedInternships)
router.post('/saved/:internshipId', saveInternship)
router.delete('/saved/:internshipId', removeSavedInternship)

export default router
