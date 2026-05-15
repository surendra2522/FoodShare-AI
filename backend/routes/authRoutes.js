import express from 'express'
import { registerUser, loginUser, getNgos } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/ngos', getNgos)

export default router
