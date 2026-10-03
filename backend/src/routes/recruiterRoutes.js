import express from 'express'
import { getRecruiterProfile, updateRecruiterProfile } from '../controllers/recruiterController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.use(protect)
router.use(authorize('recruiter'))

router.get('/profile', getRecruiterProfile)
router.put('/profile', updateRecruiterProfile)

export default router
