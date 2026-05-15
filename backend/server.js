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
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()
const app = express()

// connectDB()

app.use(helmet())
app.use(cors()) // Allow all origins for easier multi-device testing
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/auth', authRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/ai', aiRoutes)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const frontendDist = path.join(__dirname, '../frontend/dist')

app.use(express.static(frontendDist))

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

// Catch-all route to serve index.html for React Router
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next()
  res.sendFile(path.join(frontendDist, 'index.html'))
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8214
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT} (Network Accessible)`)
})
