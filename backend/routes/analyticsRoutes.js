import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getSummary } from '../controllers/analyticsController.js'

const router = express.Router()

router.get('/summary', protect, getSummary)

export default router
