import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
// import connectDB from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import aiRoutes from './routes/aiRoutes.js'

import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()

const app = express()

// connectDB()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/ai', aiRoutes)

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend running successfully'
  })
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8214

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`)
})