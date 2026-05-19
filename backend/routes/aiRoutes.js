import express from 'express'
import multer from 'multer'
import { protect } from '../middleware/authMiddleware.js'
import { getAIPrediction, analyzeFreshness } from '../controllers/aiController.js'

const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

router.get('/surplus', protect, getAIPrediction)
router.post('/analyze-freshness', protect, upload.single('image'), analyzeFreshness)

export default router
