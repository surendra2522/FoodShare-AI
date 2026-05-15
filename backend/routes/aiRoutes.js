import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getAIPrediction } from '../controllers/aiController.js'

const router = express.Router()

router.get('/surplus', protect, getAIPrediction)

export default router
